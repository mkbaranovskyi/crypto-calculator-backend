import { createHmac } from 'crypto';

export const createHash = (password: string, secretKey: string): string => {
  return createHmac('sha512', secretKey).update(password).digest('hex');
};
