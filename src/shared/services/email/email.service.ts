import { createTransport } from 'nodemailer';
import { smtpConfig } from '../../configs/index';

export interface IMessageToEmail_Return {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export const transporter = createTransport({
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: false,
  auth: {
    user: smtpConfig.user,
    pass: smtpConfig.password,
  },
});

export const messageToEmail = (toEmail: string, code: string): IMessageToEmail_Return => {
  return {
    from: `Kravich13 <${smtpConfig.user}>`,
    to: `<${toEmail}>`,
    subject: 'Crypto-Financial-Calculator: регистрация аккаунта',
    html: `<h3>Ваш код активации аккаунта:</h3>\n<h2>${code}</h2>`,
  };
};
