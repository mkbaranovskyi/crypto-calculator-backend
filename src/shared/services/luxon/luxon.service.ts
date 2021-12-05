import { DateTime } from 'luxon';
import { ITokensLifetimeOutput } from './outputs';

export const tokensLifetime = (accessLifetime: number, refreshLifetime: number): ITokensLifetimeOutput => {
  const date = DateTime.utc();

  const accessTokenExpiresIn = date.plus({ days: accessLifetime }).toMillis();
  const refreshTokenExpiresIn = date.plus({ days: refreshLifetime }).toMillis();

  return { accessTokenExpiresIn, refreshTokenExpiresIn };
};
