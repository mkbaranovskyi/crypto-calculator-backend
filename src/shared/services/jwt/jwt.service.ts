import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { IGenerateTokensInput } from './inputs';
import { IGenerateTokensOutput } from './outputs';

const createToken = async (sessionKey: string, jwtSecret: string, tokenDeathDate: string): Promise<string> => {
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
