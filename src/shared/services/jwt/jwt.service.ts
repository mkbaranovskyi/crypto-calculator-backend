import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { IGenerateTokensInput } from './inputs';
import { IGenerateTokensOutput } from './outputs';

const createToken = async (sessionKey: string, jwtSecret: string, tokenLifetime: string): Promise<string> => {
  return new Promise((res) => {
    jwt.sign({ sessionKey }, jwtSecret, { expiresIn: tokenLifetime }, (err, token) => {
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
  accessLifetime,
  refreshLifetime,
}: IGenerateTokensInput): Promise<IGenerateTokensOutput> => {
  const date = DateTime.utc();

  const result = await Promise.all([
    createToken(sessionKey, jwtSecret, accessLifetime),
    createToken(sessionKey, jwtSecret, refreshLifetime),
  ]);

  if (!result.length) {
    throw new Error('Error while creating tokens.');
  }

  const [accessToken, refreshToken] = result;

  const accessTokenExpiresIn = String(date.plus({ days: 1 }).toMillis());
  const refreshTokenExpiresIn = String(date.plus({ days: 31 }).toMillis());

  return { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn };
};
