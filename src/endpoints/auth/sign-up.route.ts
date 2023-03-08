import { randomUUID } from 'crypto';
import { jwtConfig } from '../../shared/configs';
import { USER_STATE_COOKIE } from '../../shared/consts';
import { UserEntity, VerificationCodeEntity } from '../../shared/database';
import { EmailEnum, UserStateEnum } from '../../shared/enums';
import { BadRequestException, InternalServerError } from '../../shared/errors';
import {
  EmailService,
  HashingService,
  JWTService,
  VerificationCodeService,
} from '../../shared/services';
import { RouteCustomOptions } from '../../shared/types';
import { ISignUpBodyInput, signUpSchema } from './schemas';

const { secret, accessDeathDate, refreshDeathDate } = jwtConfig;

export const signUpRoute: RouteCustomOptions<{ Body: ISignUpBodyInput }> = {
  url: '/sign-up',
  method: 'POST',
  schema: signUpSchema,
  handler: async (req, reply) => {
    const { email, password } = req.body;

    const user = await UserEntity.findOneBy({ email });

    if (user) {
      throw new BadRequestException('User exists.');
    }

    const sessionKey = randomUUID();
    const salt = randomUUID();
    const passwordHash = HashingService.createHash(password, sessionKey);
    const dataUser = UserEntity.create({ email, passwordHash });

    reply.setCookie(USER_STATE_COOKIE, UserStateEnum.NOT_VERIFIED);

    const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } =
      await JWTService.generateTokens({
        sessionKey,
        jwtSecret: secret,
        accessDeathDate,
        refreshDeathDate,
      });

    dataUser.sessionKey = sessionKey;
    dataUser.salt = salt;
    await dataUser.save();

    const { code, expiresAt } = VerificationCodeService.createCode();

    await VerificationCodeEntity.create({
      userId: String(dataUser._id),
      code,
      expiresAt,
    }).save();

    try {
      await EmailService.sendMessageToEmail(email, code, EmailEnum.REGISTRATION_LETTER);
    } catch (err) {
      new InternalServerError(err);
    }

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
      emailCodeExpiresIn: expiresAt,
    };
  },
};
