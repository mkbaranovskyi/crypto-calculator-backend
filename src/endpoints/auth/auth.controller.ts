import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import Ajv from 'ajv';
const ajv = new Ajv();
import jwt from 'jsonwebtoken';
import { createHmac, randomUUID } from 'crypto';
import { createTransport } from 'nodemailer';

import { UserEntity, VerificationCodesEntity } from '../../shared/database';
import { jwtConfig, cryptoConfig, smtpConfig } from '../../shared/configs/index';

interface IGenerateTokens_Return {
  accessToken: string;
  refreshToken: string;
}

interface IError extends Error {
  status?: number;
}

const generateTokens = (sessionKey: string, jwtSecret: string): IGenerateTokens_Return => {
  const accessToken = jwt.sign({ sessionKey }, jwtSecret, { expiresIn: '1d' });
  const refreshToken = jwt.sign({ sessionKey }, jwtSecret, { expiresIn: '31d' });

  return { accessToken, refreshToken };
};

const createHash = (password: string, secretKey: string): string => {
  return createHmac('sha256', secretKey).update(password).digest('hex');
};

const transporter = createTransport({
  host: smtpConfig.host,
  port: Number(smtpConfig.port),
  secure: false,
  auth: {
    user: smtpConfig.user,
    pass: smtpConfig.password,
  },
});

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
  server.post('/sign-up', signUpOptions, async (req, reply) => {
    const { email, password } = req.body as any;

    const user = await UserEntity.findOne({ email });

    if (!user) {
      const uuid = randomUUID();
      const passwordHash = createHash(password, cryptoConfig.secret);
      const dataUser = UserEntity.create({ email, passwordHash });
      await dataUser.save();

      const generatedUser = await UserEntity.findOne({ email });
      const { accessToken, refreshToken } = generateTokens(uuid, jwtConfig.secret);

      const date = new Date();

      const accessTokenExpiresIn = String(date.setUTCDate(date.getUTCDate() + 1));
      const refreshTokenExpiresIn = String(date.setUTCDate(date.getUTCDate() + 31));

      generatedUser!.sessionKey = uuid;
      await generatedUser!.save();

      const code = String(Math.floor(Math.random() * 1e6));
      const expiresAt = String(date.setUTCMinutes(date.getUTCMinutes() + 10));

      const dataCodes = VerificationCodesEntity.create({ userId: generatedUser!._id, code, expiresAt });
      await dataCodes.save();

      const message = {
        from: `Nodemailer <${smtpConfig.user}>`,
        to: `Nodemailer <${email}>`,
        html: `<h2>Ваш код активации аккаунта:</h2>\n${code}`,
      };

      await transporter.sendMail(message);

      return { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn };
    } else {
      const error: IError = new Error('User exists.');
      error.status = 400;
      throw error;
    }
  });
};
