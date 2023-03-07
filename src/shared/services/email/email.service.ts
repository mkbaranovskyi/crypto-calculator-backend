import fs from 'fs';
import handlebars from 'handlebars';
import { createTransport } from 'nodemailer';
import path from 'path';
import { smtpConfig } from '../../configs/index';
import { EmailEnum } from '../../enums';
import { BadGatewayException, InternalServerError } from '../../errors';

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

export const sendMessageToEmail = async (
  toEmail: string,
  code: string,
  type: EmailEnum
): Promise<void> => {
  const actionTypeTitle = type === EmailEnum.REGISTRATION_LETTER ? 'registration' : 'recovery';

  const filePath = path.resolve(process.cwd(), 'email-html/index.html');

  fs.readFile(filePath, async (err, data) => {
    if (err) {
      throw new InternalServerError('Server error while sending email.');
    }

    try {
      const template = handlebars.compile(data.toString());

      const sendMail: ISendData = {
        from: `Kravich13 <${smtpConfig.user}>`,
        to: `<${toEmail}>`,
        subject: `Crypto-Financial-Calculator: account ${actionTypeTitle}`,
        html: template({ activateType: actionTypeTitle, code }),
      };

      await transporter.sendMail(sendMail);
    } catch (err) {
      console.log(err);
      throw new BadGatewayException('Bad gateway');
    }
  });
};
