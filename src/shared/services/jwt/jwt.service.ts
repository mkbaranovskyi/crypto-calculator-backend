import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { JWTService } from '..';
import { LoggerInstance } from '../logger';
import { IGenerateTokensInput } from './inputs';
import { DecodeTokenOutput, IGenerateTokensOutput } from './outputs';

const createToken = async (
  sessionKey: string,
  jwtSecret: string,
  tokenDeathDate: string
): Promise<string> => {
  return new Promise((res) => {
    jwt.sign({ sessionKey }, jwtSecret, { expiresIn: tokenDeathDate }, (err, token) => {
      if (err) {
        throw err;
      } else if (!token) {
        throw new Error('Error while creating token');
      } else {
        res(token);
      }
    });
  });
};

export const checkRefreshToken = async (
  jwtSecret: string,
  token: string
): Promise<DecodeTokenOutput> => {
  const tokenData = await JWTService.decodeToken(token, jwtSecret);

  if (tokenData) {
    const currentDate = DateTime.utc().toMillis();
    const codeExpiresAt = DateTime.fromSeconds(tokenData.exp).toMillis();

    return currentDate < codeExpiresAt ? tokenData : null;
  }

  return null;
};

export const generateTokens = async ({
  sessionKey,
  jwtSecret,
  accessDeathDate,
  refreshDeathDate,
}: IGenerateTokensInput): Promise<IGenerateTokensOutput> => {
  const result = await Promise.all([
    createToken(sessionKey, jwtSecret, `${accessDeathDate}s`),
    createToken(sessionKey, jwtSecret, `${refreshDeathDate}s`),
  ]);

  if (!result.length) {
    throw new Error('Error while creating tokens.');
  }

  const [accessToken, refreshToken] = result;

  const date = DateTime.utc();
  const accessTokenExpiresIn = date.plus({ seconds: accessDeathDate }).toMillis();
  const refreshTokenExpiresIn = date.plus({ seconds: refreshDeathDate }).toMillis();

  return { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn };
};

export const decodeToken = async (token: string, jwtSecret: string): Promise<DecodeTokenOutput> => {
  let result = null;

  try {
    result = await new Promise<DecodeTokenOutput>((res, rej) => {
      jwt.verify(token, jwtSecret, (err, decoded: any) => {
        if (err) {
          throw err;
        } else if (!decoded || !decoded.sessionKey) {
          LoggerInstance.info('Token decoding error.');
          throw new Error('Error while decorating token.');
        } else {
          res(decoded);
        }
      });
    });
  } catch (err) {
    return null;
  }

  return result;
};
