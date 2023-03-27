import { jwtConfig } from '../../shared/configs';
import { UserEntity, UserRepository } from '../../shared/database';
import { UnauthorizedException } from '../../shared/errors';
import { JWTService, LoggerInstance } from '../../shared/services';
import { ControllerOptions } from '../../shared/types';
import { checkAuthSchema, ICheckAuthBodySchema as ICheckAuthBodyInput } from './schemas';

const { secret, accessDeathDate, refreshDeathDate } = jwtConfig;

export const refreshTokensController: ControllerOptions<{ Body: ICheckAuthBodyInput }> = {
  url: '/refresh-tokens',
  method: 'POST',
  schema: checkAuthSchema,
  handler: async (req, reply) => {
    const { refreshToken: inputRefreshToken } = req.body;

    const tokenPayload = await JWTService.decodeToken(inputRefreshToken, secret);

    if (!tokenPayload) {
      throw UnauthorizedException('Invalid refresh token.');
    }

    const user = await UserRepository.findOneBySessionKey(tokenPayload.sessionKey);

    if (!user) {
      LoggerInstance.error('User does not have a session key. ');
      throw UnauthorizedException('Invalid refresh token.');
    }

    const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } =
      await JWTService.generateTokens({
        sessionKey: tokenPayload.sessionKey,
        jwtSecret: secret,
        accessDeathDate,
        refreshDeathDate,
      });

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    };
  },
};
