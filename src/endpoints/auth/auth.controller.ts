import Ajv from 'ajv';
import { randomUUID } from 'crypto';
import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { cryptoConfig, jwtConfig } from '../../shared/configs/index';
import { UserEntity, VerificationCodesEntity } from '../../shared/database';
import { createError } from '../../shared/errors/badRequestError';
import { ISendSmsInput, optionsBody } from './inputs/sign-up.input';
import { createEmailCode, createHash, generateTokens } from './outputs/sign-up.output';

const ajv = new Ajv();

const signUpOptions = {
  schema: {
    body: Object.assign({}, optionsBody),
  },
};

export const signUpRouter: FastifyPluginAsync<FastifyPluginOptions> = async (server, options) => {
  server.post<{ Body: ISendSmsInput }>('/sign-up', signUpOptions, async (req, reply) => {
    const { email, password } = req.body;

    await UserEntity.delete({ email });
    const user = await UserEntity.findOne({ email });

    if (user) {
      throw createError(400, 'User exists.');
    }

    const uuid = randomUUID();
    const passwordHash = createHash(password, cryptoConfig.secret);
    const dataUser = UserEntity.create({ email, passwordHash });
    await dataUser.save();

    const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } = generateTokens(uuid, jwtConfig.secret);

    dataUser.sessionKey = uuid;
    await dataUser.save();

    const { code, expiresAt } = createEmailCode();

    const dataCodes = VerificationCodesEntity.create({ userId: dataUser._id, code, expiresAt });
    await dataCodes.save();

    return { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn };
  });
};
