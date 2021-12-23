import { UserEntity } from '../database';
import { createError } from '../errors';
import { JWTService, LocalStorage } from '../services';

export const checkAccessToken = async (jwtSecret: string, token?: string): Promise<void> => {
  if (!token) {
    return;
  }

  const cleanedUpCode = token.replace('Bearer ', '');

  const sessionKey = await JWTService.decodeToken(cleanedUpCode, jwtSecret);

  if (!sessionKey) {
    throw createError(400, 'Invalid access token.');
  }

  const user = await UserEntity.findOne({ sessionKey });

  if (!user) {
    throw createError(401, 'Invalid access token.');
  }

  LocalStorage.setUser(user);
};
