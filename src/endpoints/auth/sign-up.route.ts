import { randomUUID } from 'crypto';
import { RouteOptions } from 'fastify';
import { jwtConfig } from '../../shared/configs';
import { UserEntity, VerificationCodesEntity } from '../../shared/database';
import { EmailEnum } from '../../shared/enums';
import { BadRequestException } from '../../shared/errors';
import { EmailService, HashingService, JWTService, VerificationCodeService } from '../../shared/services';
import { ISignUpBodyInput } from './inputs';
import { signUpOutputSchema } from './outputs';

const { secret, accessDeathDate, refreshDeathDate } = jwtConfig;

export const SignUpRoute: RouteOptions = {
  url: '/sign-up',
  method: 'POST',
  schema: {
    // tags: [OpenAPITagsEnum.AUTH],
    // summary: 'Sign up',
    body: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: {
          type: 'string',
          minLength: 8,
          maxLength: 256,
        },
      },
      required: ['email', 'password'],
    },
    response: {
      200: signUpOutputSchema,
    },
  },
  handler: async (req, reply) => {
    const { email, password } = req.body as ISignUpBodyInput;

    const user = await UserEntity.findOneBy({ email });

    if (user) {
      throw new BadRequestException('User exists.');
    }

    const sessionKey = randomUUID();
    const salt = randomUUID();
    const passwordHash = HashingService.createHash(password, sessionKey);
    const dataUser = UserEntity.create({ email, passwordHash });

    const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } = await JWTService.generateTokens({
      sessionKey,
      jwtSecret: secret,
      accessDeathDate,
      refreshDeathDate,
    });

    dataUser.sessionKey = sessionKey;
    dataUser.salt = salt;
    await dataUser.save();

    const { code, expiresAt } = VerificationCodeService.createCode();

    await VerificationCodesEntity.create({ userId: String(dataUser._id), code: '123456', expiresAt }).save();

    await EmailService.sendMessageToEmail(email, code, EmailEnum.REGISTRATION_LETTER);

    return { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn };
  },
};
