import Ajv from 'ajv';
import { randomUUID } from 'crypto';
import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { jwtConfig } from '../../shared/configs';
import { UserEntity, VerificationCodesEntity } from '../../shared/database';
import { createError } from '../../shared/errors';
import { EmailService, HashingService, JWTService, VerificationCodeService } from '../../shared/services';
import { IBodySignUp } from './inputs';

const ajv = new Ajv();

const { secret, accessLifetime, refreshLifetime } = jwtConfig;

const signUpOptions = {
  schema: {
    body: {
      200: {
        type: 'object',
        required: ['email', 'passwordHash', 'sessionKey'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
        },
      },
    },
  },
};

export const signUpRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  server.post<{ Body: IBodySignUp }>('/sign-up', signUpOptions, async (req, reply) => {
    const { email, password } = req.body;

    // todo 28.11.2021: remove later - only here for testing
    await UserEntity.delete({ email });

    const user = await UserEntity.findOne({ email });

    if (user) {
      throw createError(400, 'User exists.');
    }

    const sessionKey = randomUUID();
    const passwordHash = HashingService.createHash(password, sessionKey);
    const dataUser = UserEntity.create({ email, passwordHash });

    const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } = await JWTService.generateTokens({
      sessionKey,
      jwtSecret: secret,
      accessLifetime,
      refreshLifetime,
    });

    dataUser.sessionKey = sessionKey;
    await dataUser.save();

    const { code, expiresAt } = VerificationCodeService.createCode();

    const dataCodes = VerificationCodesEntity.create({ userId: dataUser._id, code, expiresAt });
    await dataCodes.save();

    await EmailService.sendMessageToEmail(email, code);

    return { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn };
  });
};
