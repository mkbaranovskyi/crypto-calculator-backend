import { randomInt } from 'crypto';
import { DateTime } from 'luxon';
import { VerificationCodesEntity } from '../../database';
import { IGenerageCodeOutput } from './outputs';

export const createCode = (): IGenerageCodeOutput => {
  const date = DateTime.utc();

  const code = String(randomInt(101010, 999999));
  const expiresAt = date.plus({ minutes: 3 }).toJSDate();

  return { code, expiresAt };
};

export const validateCode = (savedCode: VerificationCodesEntity | undefined, receivedCode: string): void => {
  if (!savedCode || savedCode.code !== receivedCode) {
    throw new Error('Invalid code sent.');
  }

  const currentDate = DateTime.utc();
  const codeExpiresAt = DateTime.fromJSDate(savedCode.expiresAt);

  if (+currentDate > +codeExpiresAt) {
    throw new Error('Code lifetime expired..');
  }
};
