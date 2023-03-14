import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { IJWTData } from '../../types';
import { LoggerInstance } from '../logger';
import { IGenerateTokensInput } from './inputs';
import { IGenerateTokensOutput } from './outputs';

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

export const decodeToken = async (token: string, jwtSecret: string): Promise<IJWTData | null> => {
  let result = null;

  try {
    result = await new Promise<IJWTData>((res, rej) => {
      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          LoggerInstance.error('Token decoding error.');
          throw err;
        } else if (!decoded || !(decoded as IJWTData).sessionKey) {
          LoggerInstance.error('Decoded token not found.');
        } else {
          res(decoded as IJWTData);
        }
      });
    });
  } catch (err) {
    return null;
  }

  return result;
};
