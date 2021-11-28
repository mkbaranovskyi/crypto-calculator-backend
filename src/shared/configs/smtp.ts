if (!process.env.SMTP_HOST) {
  throw new Error('process.env.SMTP_HOST is undefined');
}
if (!process.env.SMTP_PORT) {
  throw new Error('process.env.SMTP_PORT is undefined');
}
if (!process.env.SMTP_USER) {
  throw new Error('process.env.SMTP_USER is undefined');
}
if (!process.env.SMTP_PASSWORD) {
  throw new Error('process.env.SMTP_PASSWORD is undefined');
}

export const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
};
