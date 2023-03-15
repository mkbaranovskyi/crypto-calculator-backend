import fs from 'fs';
import handlebars from 'handlebars';
import { createTransport } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import path from 'path';
import { smtpConfig } from '../../configs/index';

const transporter = createTransport({
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: false,
  auth: {
    user: smtpConfig.user,
    pass: smtpConfig.password,
  },
});

const getStringFile = async (): Promise<string> => {
  const filePath = path.resolve(process.cwd(), 'html/email-index.html');

  const stringFile = await new Promise<string>((res) => {
    fs.readFile(filePath, async (err, data) => {
      if (err) {
        throw err;
      }

      res(data.toString());
    });
  });

  return stringFile;
};

const stringFile = getStringFile();

const getEmailHTML = async <T extends object>(templateContext: T): Promise<string> => {
  const handlebarFileString = await stringFile;

  const template = handlebars.compile(handlebarFileString);

  return template(templateContext);
};

export const sendSignInLetter = async (toEmail: string, code: string): Promise<void> => {
  const html = await getEmailHTML({ code, email: toEmail });

  const mailOptions: MailOptions = {
    from: `<${smtpConfig.user}>`,
    to: `<${toEmail}>`,
    subject: 'Crypto Financial Calculator: sign in',
    html,
  };

  await transporter.sendMail(mailOptions);
};
