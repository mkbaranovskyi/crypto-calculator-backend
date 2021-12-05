import { createTransport } from 'nodemailer';
import { smtpConfig } from '../../configs/index';

interface ISendData {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const transporter = createTransport({
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: false,
  auth: {
    user: smtpConfig.user,
    pass: smtpConfig.password,
  },
});

export const sendMessageToEmail = async (toEmail: string, code: number): Promise<void> => {
  const sendData: ISendData = {
    from: `Kravich13 <${smtpConfig.user}>`,
    to: `<${toEmail}>`,
    subject: 'Crypto-Financial-Calculator: регистрация аккаунта',
    html: `<h3>Ваш код активации аккаунта:</h3>\n<h2>${code}</h2>`,
  };

  await transporter.sendMail(sendData);
};
