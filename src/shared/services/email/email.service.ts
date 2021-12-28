import { createTransport } from 'nodemailer';
import { smtpConfig } from '../../configs/index';
import { EmailConstants } from '../../constants';

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

export const sendMessageToEmail = async (toEmail: string, code: string, type: string): Promise<void> => {
  const sendData: ISendData = {
    from: `Kravich13 <${smtpConfig.user}>`,
    to: `<${toEmail}>`,
    subject: '',
    html: '',
  };

  switch (type) {
    case EmailConstants.registrationLetter:
      sendData.subject = 'Crypto-Financial-Calculator: регистрация аккаунта';
      sendData.html = `<h3>Ваш код активации аккаунта:</h3>\n<h2>${code}</h2>`;
      break;
    case EmailConstants.recoveryLetter:
      sendData.subject = 'Crypto-Financial-Calculator: восстановление аккаунта';
      sendData.html = `<h3>Ваш код восстановления аккаунта:</h3>\n<h2>${code}</h2>`;
      break;
    default:
      break;
  }

  await transporter.sendMail(sendData);
};
