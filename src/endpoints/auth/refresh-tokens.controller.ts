import { jwtConfig } from '../../shared/configs';
import { UserRepository } from '../../shared/database';
import { UnauthorizedException } from '../../shared/errors';
import { JWTService, LoggerInstance } from '../../shared/services';
import { ControllerOptions } from '../../shared/types';
import { checkAuthSchema, ICheckAuthBodySchema as ICheckAuthBodyInput } from './schemas';

const { accessDeathDate, refreshDeathDate } = jwtConfig;

export const refreshTokensController: ControllerOptions<{ Body: ICheckAuthBodyInput }> = {
  url: '/refresh-tokens',
  method: 'POST',
  schema: checkAuthSchema,
  handler: async (req, reply) => {
    const { refreshToken: inputRefreshToken } = req.body;

    const tokenPayload = await JWTService.verifyToken(inputRefreshToken);

    if (!tokenPayload) {
      throw UnauthorizedException('Invalid refresh token.');
    }

    const user = await UserRepository.removeInvalidSKsById(tokenPayload.userId);

    if (!user) {
      LoggerInstance.error('User does not have session keys. ');
      throw UnauthorizedException('Invalid refresh token.');
    }

    const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } =
      await JWTService.generateTokens({
        payload: { sessionKey: tokenPayload.sessionKey, userId: user._id },
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
