import { randomInt } from 'crypto';
import { DateTime } from 'luxon';
import { IGenerageCodeOutput } from './outputs';

export const createCode = (): IGenerageCodeOutput => {
  const date = DateTime.utc();

  const code = randomInt(101010, 999999);
  const expiresAt = date.plus({ minutes: 3 }).toMillis();

  return { code, expiresAt };
};
