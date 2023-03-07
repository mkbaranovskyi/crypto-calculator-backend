import { jwtConfig } from '../../shared/configs';
import { USER_STATE_COOKIE } from '../../shared/consts';
import { UserEntity } from '../../shared/database';
import { UserStateEnum } from '../../shared/enums';
import { BadRequestException, UnauthorizedException } from '../../shared/errors';
import { HashingService, JWTService } from '../../shared/services';
import { RouteCustomOptions } from '../../shared/types';
import { ISignUpOrInBodyInput, signUpOrInSchema } from './schemas';

const { secret, accessDeathDate, refreshDeathDate } = jwtConfig;

export const signInRoute: RouteCustomOptions<{ Body: ISignUpOrInBodyInput }> = {
  url: '/sign-in',
  method: 'POST',
  schema: signUpOrInSchema,
  handler: async (req, reply) => {
    const { email, password: inputPassword } = req.body;

    const user = await UserEntity.findOneBy({ email });

    if (!user) {
      throw new BadRequestException('User does not exist.');
    }

    const { passwordHash, sessionKey } = user;
    const inputPasswordHash = HashingService.createHash(inputPassword, sessionKey);

    if (inputPasswordHash !== passwordHash) {
      throw new UnauthorizedException('Wrong email or password.');
    }

    reply.setCookie(USER_STATE_COOKIE, user.state || UserStateEnum.NOT_VERIFIED);

    const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } =
      await JWTService.generateTokens({
        sessionKey,
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
