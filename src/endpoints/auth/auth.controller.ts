import Ajv from 'ajv';
import { randomUUID } from 'crypto';
import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { cryptoConfig, jwtConfig } from '../../shared/configs/index';
import { UserEntity, VerificationCodesEntity } from '../../shared/database';
import { createError } from '../../shared/errors/badRequestError';
import { messageToEmail, transporter } from '../../shared/services/email/email.service';
import { createHash } from '../../shared/services/hashing/hashing.service';
import { generateTokens } from '../../shared/services/jwt/jwt.service';
import { createEmailCode } from '../../shared/services/verification-code/verification-code.service';
import { ISendSmsInput, optionsBody } from './inputs/sign-up.input';

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
  server.post<{ Body: ISendSmsInput }>('/sign-up', signUpOptions, async (req, reply) => {
    const { email, password } = req.body;

    // todo 28.11.2021: remove later - only here for testing
    await UserEntity.delete({ email });

    const user = await UserEntity.findOne({ email });

    if (user) {
      throw createError(400, 'User exists.');
    }

    const sessionKey = randomUUID();
    const passwordHash = createHash(password, cryptoConfig.secret);
    const dataUser = UserEntity.create({ email, passwordHash });

    const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } = await generateTokens({
      sessionKey: sessionKey,
      jwtSecret: secret,
      accessLifetime,
      refreshLifetime,
    });

    dataUser.sessionKey = sessionKey;
    await dataUser.save();

    const { code, expiresAt } = createEmailCode();

    const dataCodes = VerificationCodesEntity.create({ userId: dataUser._id, code, expiresAt });
    await dataCodes.save();

    // await transporter.sendMail(messageToEmail(email, code));

    return { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn };
  });
};
