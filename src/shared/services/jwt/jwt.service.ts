import jwt from 'jsonwebtoken';
import { tokensLifetime } from '../luxon';
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
  const result = await Promise.all([
    createToken(sessionKey, jwtSecret, `${accessLifetime}d`),
    createToken(sessionKey, jwtSecret, `${refreshLifetime}d`),
  ]);

  if (!result.length) {
    throw new Error('Error while creating tokens.');
  }

  const [accessToken, refreshToken] = result;

  const { accessTokenExpiresIn, refreshTokenExpiresIn } = tokensLifetime(accessLifetime, refreshLifetime);

  return { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn };
};
