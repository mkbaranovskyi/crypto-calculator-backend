import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';

export interface IGenerateTokens_Props {
  jwtSecret: string;
  sessionKey: string;
  accessLifetime: string;
  refreshLifetime: string;
}

export interface IGenerateTokens_Return {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

export const generateTokens = async ({
  sessionKey,
  jwtSecret,
  accessLifetime,
  refreshLifetime,
}: IGenerateTokens_Props): Promise<IGenerateTokens_Return> => {
  const date = DateTime.utc();

  let accessToken = '';
  let refreshToken = '';

  const createToken = async (tokenLifetime: string) => {
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
  const result = await Promise.all([createToken(accessLifetime), createToken(refreshLifetime)]);

  if (result.length) {
    const [access, refresh] = result;
    accessToken = access as string;
    refreshToken = refresh as string;
  }

  const accessTokenExpiresIn = String(date.plus({ days: 1 }).toMillis());
  const refreshTokenExpiresIn = String(date.plus({ days: 31 }).toMillis());

  return { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn };
};
