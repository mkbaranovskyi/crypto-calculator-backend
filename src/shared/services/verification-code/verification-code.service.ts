import { randomInt } from 'crypto';
import { DateTime } from 'luxon';

export interface IGenerageCodeOutput {
  code: string;
  expiresAt: string;
}

export const createCode = (): IGenerageCodeOutput => {
  const date = DateTime.utc();

  const code = String(randomInt(101010, 999999));
  const expiresAt = String(date.plus({ minutes: 3 }).toMillis());

  return { code, expiresAt };
};
