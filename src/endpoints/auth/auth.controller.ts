import Ajv from 'ajv';
import { randomUUID } from 'crypto';
import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { DateTime } from 'luxon';
import { jwtConfig } from '../../shared/configs';
import { UserEntity, VerificationCodesEntity } from '../../shared/database';
import { EmailEnum, OpenAPITagsEnum } from '../../shared/enums';
import { createError } from '../../shared/errors';
import { statusOutputSchema } from '../../shared/models/outputs';
import { EmailService, HashingService, JWTService, LocalStorage, VerificationCodeService } from '../../shared/services';
import { IBodyCodeEmail, IBodySignUp } from './inputs';
import { signUpOutputSchema } from './outputs';

const ajv = new Ajv();

const { secret, accessDeathDate, refreshDeathDate } = jwtConfig;

export const signUpRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  server.post<{ Body: IBodySignUp }>(
    '/sign-up',
    {
      schema: {
        tags: [OpenAPITagsEnum.AUTH],
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

      await VerificationCodesEntity.create({ userId: String(dataUser._id), code, expiresAt }).save();

      await EmailService.sendMessageToEmail(email, code, EmailEnum.REGISTRATION_LETTER);

      return { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn };
    }
  );
};

export const validateEmailRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  server.post<{ Body: { code: string }; Headers: { authorization: string } }>(
    '/email/validate',
    {
      schema: {
        tags: [OpenAPITagsEnum.AUTH],
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
          200: statusOutputSchema,
        },
      },
    },
    async (req, reply) => {
      const { code: receivedCode } = req.body;
      const user = LocalStorage.getUser();

      const savedCode = await VerificationCodesEntity.findOne({ userId: String(user._id) });
      VerificationCodeService.validateCode(savedCode, receivedCode);

      return { status: 'ok!' };
    }
  );
};

export const forgotEmailRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  server.post<{ Body: { email: string } }>(
    '/email/forgot',
    {
      schema: {
        tags: [OpenAPITagsEnum.AUTH],
        summary: 'Forgot email here',
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', minLength: 6, maxLength: 256, example: 'only@test.com' },
          },
          required: ['email'],
        },
        response: {
          200: statusOutputSchema,
        },
      },
    },
    async (req, reply) => {
      const { email } = req.body;

      const user = await UserEntity.findOne({ email });

      if (!user) {
        throw createError(401, 'Email does not exist.');
      }

      const { code, expiresAt } = VerificationCodeService.createCode();

      const savedCode = await VerificationCodesEntity.findOne({ userId: String(user._id) });

      const currentDate = DateTime.utc();
      const codeExpiresAt = DateTime.fromJSDate(savedCode!.createdAt).plus({ seconds: 90 });

      if (+currentDate < +codeExpiresAt) {
        throw createError(400, 'Wait before you can request another code.');
      }

      await VerificationCodesEntity.delete({ userId: String(user._id) });

      await VerificationCodesEntity.create({ userId: String(user._id), code, expiresAt }).save();

      await EmailService.sendMessageToEmail(email, code, EmailEnum.RECOVERY_LETTER);

      return { status: 'ok!' };
    }
  );
};

export const codeEmailRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  server.post<{ Body: IBodyCodeEmail }>(
    '/email/code',
    {
      schema: {
        tags: [OpenAPITagsEnum.AUTH],
        summary: 'Code email here',
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', minLength: 6, maxLength: 256, example: 'only@test.com' },
            code: { type: 'string', minLength: 6, maxLength: 6 },
          },
          required: ['email', 'code'],
        },
        response: {
          200: statusOutputSchema,
        },
      },
    },
    async (req, reply) => {
      const { email, code: receivedCode } = req.body;

      const user = await UserEntity.findOne({ email });

      if (!user) {
        throw createError(401, 'Email does not exist.');
      }

      const savedCode = await VerificationCodesEntity.findOne({ userId: String(user._id) });

      VerificationCodeService.validateCode(savedCode, receivedCode);

      return { status: 'ok!' };
    }
  );
};
