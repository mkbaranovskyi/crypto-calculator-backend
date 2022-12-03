import { jwtConfig } from '../../shared/configs';
import { UserEntity } from '../../shared/database';
import { BadRequestException, UnauthorizedException } from '../../shared/errors';
import { HashingService, JWTService } from '../../shared/services';
import { ISignUpOrInBodyInput, signUpOrInSchema } from './schemas';
import { RouteCustomOptions } from './types';

const { secret, accessDeathDate, refreshDeathDate } = jwtConfig;

export const signInRoute: RouteCustomOptions<ISignUpOrInBodyInput> = {
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
