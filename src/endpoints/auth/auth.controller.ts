import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import { UserEntity, VerificationCodes } from '../../shared/database';
import Ajv from 'ajv';
const ajv = new Ajv();
import jwt from 'jsonwebtoken';
import { createHmac, randomUUID } from 'crypto';
import { createTransport } from 'nodemailer';

const secret = process.env.CRYPT_SECRET!;

const generateTokens = (sessionKey: string) => {
  const accessToken = jwt.sign({ sessionKey }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '1d' });
  const refreshToken = jwt.sign({ sessionKey }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '31d' });

  return { accessToken, refreshToken };
};

const createHash = (password: string, secretKey = secret): string => {
  return createHmac('sha256', secretKey).update(password).digest('hex');
};

const transporter = createTransport({
  host: String(process.env.SMTP_HOST),
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASSWORD!,
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

    await UserEntity.delete({ email });
    const user = await UserEntity.findOne({ email });

    if (!user) {
      const uuid = randomUUID();
      const passwordHash = createHash(password);
      const dataUser = UserEntity.create({ email, passwordHash });
      await dataUser.save();

      const generatedUser = await UserEntity.findOne({ email });
      const { accessToken, refreshToken } = generateTokens(uuid);

      const date = new Date();

      const accessTokenExpiresIn = String(date.setUTCDate(date.getUTCDate() + 1));
      const refreshTokenExpiresIn = String(date.setUTCDate(date.getUTCDate() + 31));

      generatedUser!.sessionKey = uuid;
      await generatedUser!.save();

      const code = String(Math.floor(Math.random() * 1e6));
      const expiresAt = String(date.setUTCMinutes(date.getUTCMinutes() + 10));
      console.log(expiresAt);

      const dataCodes = VerificationCodes.create({ userId: generatedUser!._id, code, expiresAt });
      await dataCodes.save();

      const message = {
        from: `Nodemailer <${process.env.SMTP_USER}>`,
        to: `Nodemailer <${email}>`,
        html: `<h2>Ваш код активации аккаунта:</h2>\n${code}`,
      };

      await transporter.sendMail(message);

      return reply.code(200).send({ accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn });
    } else {
      return reply.code(400).header('Content-Type', 'application/json; charset=utf-8').send({ message: 'User exists.' });
    }

    // await user.save();
    // const users = await UserEntity.find({});
    // console.log(users);
  });
};
