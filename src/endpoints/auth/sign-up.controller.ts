import { randomUUID } from 'crypto';
import { jwtConfig } from '../../shared/configs';
import { USER_STATE_COOKIE } from '../../shared/consts';
import { UserEntity, VerificationCodeEntity } from '../../shared/database';
import { EMAIL, USER_STATE } from '../../shared/enums';
import { BadRequestException } from '../../shared/errors';
import {
  EmailService,
  HashingService,
  JWTService,
  VerificationCodeService,
} from '../../shared/services';
import { LoggerInstance } from '../../shared/services/logger';
import { ControllerOptions } from '../../shared/types';
import { ISignUpBodyInput, signUpSchema } from './schemas';

const { secret, accessDeathDate, refreshDeathDate } = jwtConfig;

export const signUpController: ControllerOptions<{ Body: ISignUpBodyInput }> = {
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

    reply.setCookie(USER_STATE_COOKIE, USER_STATE.NOT_VERIFIED);

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
      await EmailService.sendMessageToEmail(email, code, EMAIL.REGISTRATION_LETTER);
    } catch (err) {
      LoggerInstance.error('Send message to email error.');
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
