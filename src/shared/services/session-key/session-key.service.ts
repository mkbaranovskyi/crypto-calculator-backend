import { randomUUID } from 'crypto';
import { DateTime } from 'luxon';
import { jwtConfig } from '../../configs';
import { ISessionKeyData } from '../../types';
import { CreateSessionKeyOutput as CreateOutput } from './outputs';

const { refreshDeathDate } = jwtConfig;

export const create = (): CreateOutput => {
  const id = randomUUID();

  const date = DateTime.utc();
  const expiresIn = date.plus({ seconds: refreshDeathDate }).toMillis();

  return { id, expiresIn };
};

export const isValid = (sessionKey: ISessionKeyData) => {
  const date = DateTime.utc();

  return sessionKey.expiresIn < date.toMillis();
};
