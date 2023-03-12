import { UserEntity } from '../database';
import { BadRequestException, UnauthorizedException } from '../errors';
import { JWTService, LocalStorage } from '../services';
import { LoggerInstance } from '../services/logger';

export const checkAccessToken = async (jwtSecret: string, token?: string): Promise<void> => {
  if (!token) {
    return;
  }

  const cleanedUpCode = token.replace('Bearer ', '');

  const tokenPayload = await JWTService.decodeToken(cleanedUpCode, jwtSecret);

  if (!tokenPayload) {
    throw BadRequestException('Invalid access token.');
  }

  const user = await UserEntity.findOneBy({ sessionKey: tokenPayload.sessionKey });

  if (!user) {
    LoggerInstance.info('User does not have a session key.');
    throw new UnauthorizedException(401, 'Invalid access token.');
  }

  LocalStorage.setUser(user);
};
