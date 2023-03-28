import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { jwtConfig } from '../../configs';
import { IJWTData, IJWTPayload } from '../../types';
import { LoggerInstance } from '../logger';
import { IGenerateTokensInput } from './inputs';
import { IGenerateTokensOutput } from './outputs';

const { secret } = jwtConfig;

const createToken = async (payload: IJWTPayload, tokenDeathDate: string): Promise<string> =>
  new Promise((res) => {
    jwt.sign({ ...payload }, secret, { expiresIn: tokenDeathDate }, (err, token) => {
      if (err) {
        throw err;
      } else if (!token) {
        throw new Error('Error while creating token');
      } else {
        res(token);
      }
    });
  });

export const generateTokens = async ({
  payload,
  accessDeathDate,
  refreshDeathDate,
}: IGenerateTokensInput): Promise<IGenerateTokensOutput> => {
  const result = await Promise.all([
    createToken(payload, `${accessDeathDate}s`),
    createToken(payload, `${refreshDeathDate}s`),
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

export const decodeToken = async (token: string): Promise<IJWTData | null> =>
  jwt.decode(token) as IJWTData | null;

export const verifyToken = async (token: string): Promise<IJWTData | null> => {
  let result = null;

  try {
    result = await new Promise<IJWTData>((res, rej) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          LoggerInstance.error('Token decoding error.');
          throw err;
        } else if (!decoded || !(decoded as IJWTData).sessionKey) {
          LoggerInstance.error('Decoded token not found.');
          rej();
        } else {
          res(decoded as IJWTData);
        }
      });
    });
  } catch (err) {
    LoggerInstance.error('Verify JWT error.');
    return null;
  }

  return result;
};
