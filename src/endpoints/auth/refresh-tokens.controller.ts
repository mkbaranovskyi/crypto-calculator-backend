import { jwtConfig } from '../../shared/configs';
import { USER_STATE_COOKIE } from '../../shared/consts';
import { UserEntity } from '../../shared/database';
import { USER_STATE } from '../../shared/enums';
import { UnauthorizedException } from '../../shared/errors';
import { JWTService } from '../../shared/services';
import { ControllerOptions } from '../../shared/types';
import { checkAuthSchema, ICheckAuthBodySchema as ICheckAuthBodyInput } from './schemas';

const { secret, accessDeathDate, refreshDeathDate } = jwtConfig;

export const refreshTokensController: ControllerOptions<{ Body: ICheckAuthBodyInput }> = {
  url: '/refresh-tokens',
  method: 'POST',
  schema: checkAuthSchema,
  handler: async (req, reply) => {
    const { refreshToken: inputRefreshToken } = req.body;

    const tokenPayload = await JWTService.decodeToken(secret, inputRefreshToken);

    if (!tokenPayload) {
      throw UnauthorizedException('Invalid refresh token.');
    }

    const user = await UserEntity.findOneBy({ sessionKey: tokenPayload.sessionKey });

    if (!user) {
      throw UnauthorizedException('Invalid refresh token.');
    }

    reply.setCookie(USER_STATE_COOKIE, user.state || USER_STATE.NOT_VERIFIED);

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
