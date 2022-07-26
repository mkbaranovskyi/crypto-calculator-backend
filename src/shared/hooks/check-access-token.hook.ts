import { UserEntity } from '../database';
import { BadRequestException, UnauthorizedException } from '../errors';
import { JWTService, LocalStorage } from '../services';
import { LoggerInstance } from '../services/logger';

export const checkAccessToken = async (jwtSecret: string, token?: string): Promise<void> => {
  if (!token) {
    return;
  }

  const cleanedUpCode = token.replace('Bearer ', '');

  const sessionKey = await JWTService.decodeToken(cleanedUpCode, jwtSecret);

  if (!sessionKey) {
    LoggerInstance.info('Invalid session key in access token.');
    throw new BadRequestException('Invalid access token.');
  }

  const user = await UserEntity.findOneBy({ sessionKey });

  if (!user) {
    LoggerInstance.info('User does not have a session key.');
    throw new UnauthorizedException(401, 'Invalid access token.');
  }

  LocalStorage.setUser(user);
};
