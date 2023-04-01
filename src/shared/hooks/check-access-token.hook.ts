import { UserRepository } from '../database';
import { BadRequestException, UnauthorizedException } from '../errors';
import { JWTService, LocalStorage, LoggerInstance } from '../services';

export const checkAccessToken = async (token?: string): Promise<void> => {
  try {
    if (!token) {
      throw new Error('Invalid access token.');
    }

    const cleanedUpCode = token.replace('Bearer ', '');

    const tokenPayload = await JWTService.verifyToken(cleanedUpCode);

    if (!tokenPayload) {
      const payload = await JWTService.decodeToken(cleanedUpCode);

      if (payload?.userId) {
        await UserRepository.removeInvalidSKsById(payload.userId);
      } else {
        LoggerInstance.warn(
          `Token ${cleanedUpCode} does not have payload for removeInvalidSKsById.`
        );
      }

      throw BadRequestException('Invalid access token.');
    }

    const user = await UserRepository.removeInvalidSKsById(tokenPayload.userId);

    LocalStorage.setUser(user);
  } catch (err) {
    throw new UnauthorizedException('Invalid access token.');
  }
};
