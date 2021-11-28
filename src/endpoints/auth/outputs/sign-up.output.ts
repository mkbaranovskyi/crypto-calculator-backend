import { createHmac, randomInt } from 'crypto';
import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { createTransport } from 'nodemailer';

import { smtpConfig } from '../../../shared/configs/index';

export interface IGenerateTokens_Return {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

export interface IMessageToEmail_Return {
  from: string;
  to: string;
  html: string;
}

export interface ICreateEmailCode_Return {
  code: string;
  expiresAt: string;
}

export const transporter = createTransport({
  host: smtpConfig.host,
  port: Number(smtpConfig.port),
  secure: false,
  auth: {
    user: smtpConfig.user,
    pass: smtpConfig.password,
  },
});

export const generateTokens = (sessionKey: string, jwtSecret: string): IGenerateTokens_Return => {
  const date = DateTime.utc();

  const accessToken = jwt.sign({ sessionKey }, jwtSecret, { expiresIn: '1d' });
  const refreshToken = jwt.sign({ sessionKey }, jwtSecret, { expiresIn: '31d' });

  const accessTokenExpiresIn = String(date.plus({ days: 1 }).toMillis());
  const refreshTokenExpiresIn = String(date.plus({ days: 31 }).toMillis());

  return { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn };
};

export const createHash = (password: string, secretKey: string): string => {
  return createHmac('sha256', secretKey).update(password).digest('hex');
};

export const messageToEmail = (toEmail: string, code: string): IMessageToEmail_Return => {
  return {
    from: `Nodemailer <${smtpConfig.user}>`,
    to: `Nodemailer <${toEmail}>`,
    html: `<h2>Ваш код активации аккаунта:</h2>\n${code}`,
  };
};

export const createEmailCode = (): ICreateEmailCode_Return => {
  const date = DateTime.utc();

  const code = String(randomInt(1e5, 1e6));
  const expiresAt = String(date.plus({ minutes: 3 }).toMillis());

  return { code, expiresAt };
};
