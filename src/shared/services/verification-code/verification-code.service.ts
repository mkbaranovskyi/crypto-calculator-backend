import { randomInt } from 'crypto';
import { DateTime } from 'luxon';

export interface ICreateEmailCode_Return {
  code: string;
  expiresAt: string;
}

export const createEmailCode = (): ICreateEmailCode_Return => {
  const date = DateTime.utc();

  const code = String(randomInt(1e5, 1e6));
  const expiresAt = String(date.plus({ minutes: 3 }).toMillis());

  return { code, expiresAt };
};
