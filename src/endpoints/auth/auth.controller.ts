import Ajv from 'ajv';
import { randomUUID } from 'crypto';
import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { DateTime } from 'luxon';
import { jwtConfig } from '../../shared/configs';
import { UserEntity, VerificationCodesEntity } from '../../shared/database';
import { createError } from '../../shared/errors';
import { EmailService, HashingService, JWTService, LocalStorage, VerificationCodeService } from '../../shared/services';
import { IBodySignUp, IBodyValidateEmail, IHeadersValidateEmail } from './inputs';
import { signUpOutputSchema, valitdateEmailOutputSchema } from './outputs';

const ajv = new Ajv();

const { secret, accessDeathDate, refreshDeathDate } = jwtConfig;
const { getUser } = LocalStorage;

export const signUpRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  server.post<{ Body: IBodySignUp }>(
    '/sign-up',
    {
      schema: {
        tags: ['auth'],
        summary: 'Sign up',
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', minLength: 6, maxLength: 256, example: 'only@test.com' },
            password: {
              type: 'string',
              minLength: 8,
              maxLength: 256,
              example: 'passwordTest',
            },
          },
          required: ['email', 'password'],
        },
        response: {
          200: signUpOutputSchema,
        },
      },
    },
    async (req, reply) => {
      const { email, password } = req.body;

      // todo 28.11.2021: remove later - only here for testing
      await UserEntity.delete({ email });

      const user = await UserEntity.findOne({ email });

      if (user) {
        throw createError(400, 'User exists.');
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

      const dataCodes = VerificationCodesEntity.create({ userId: dataUser._id, code, expiresAt });
      await dataCodes.save();

      await EmailService.sendMessageToEmail(email, code);

      return { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn };
    }
  );
};

export const validateEmailRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  server.post<{ Body: IBodyValidateEmail; Headers: IHeadersValidateEmail }>(
    '/email/validate',
    {
      schema: {
        tags: ['auth'],
        summary: 'Verify email here',
        body: {
          type: 'object',
          properties: {
            code: { type: 'string', minLength: 6, maxLength: 6 },
          },
          required: ['code'],
        },
        headers: {
          type: 'object',
          properties: {
            authorization: { type: 'string' },
          },
          required: ['authorization'],
        },
        response: {
          200: valitdateEmailOutputSchema,
        },
      },
    },
    async (req, reply) => {
      const { code } = req.body;
      const user = getUser();

      const verificationCode = await VerificationCodesEntity.findOne({ userId: user._id });

      if (!verificationCode || verificationCode.code !== code) {
        throw createError(401, 'Invalid code sent.');
      }

      const currentDate = DateTime.utc();
      const codeExpiresAt = DateTime.fromJSDate(verificationCode.expiresAt);

      if (+currentDate > +codeExpiresAt) {
        throw createError(401, 'Code lifetime expired.');
      }

      return { status: 'ok!' };
    }
  );
};
