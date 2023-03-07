import { jwtConfig } from '../../shared/configs';
import { USER_STATE_COOKIE } from '../../shared/consts';
import { UserEntity } from '../../shared/database';
import { UserStateEnum } from '../../shared/enums';
import { UnauthorizedException } from '../../shared/errors';
import { JWTService } from '../../shared/services';
import { RouteCustomOptions } from '../../shared/types';
import { checkAuthSchema, ICheckAuthBodySchema as ICheckAuthBodyInput } from './schemas';

const { secret, accessDeathDate, refreshDeathDate } = jwtConfig;

export const checkAuthRoute: RouteCustomOptions<{ Body: ICheckAuthBodyInput }> = {
  url: '/check-auth',
  method: 'POST',
  schema: checkAuthSchema,
  handler: async (req, reply) => {
    const { refreshToken: inputRefreshToken } = req.body;

    const tokenData = await JWTService.checkRefreshToken(secret, inputRefreshToken);

    if (!tokenData) {
      throw UnauthorizedException('Invalid refresh token.');
    }

    const user = await UserEntity.findOneBy({ sessionKey: tokenData.sessionKey });

    if (!user) {
      throw UnauthorizedException('Invalid refresh token.');
    }

    reply.setCookie(USER_STATE_COOKIE, user.state || UserStateEnum.NOT_VERIFIED);

    const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } =
      await JWTService.generateTokens({
        sessionKey: tokenData.sessionKey,
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
