const expiresIn = Number(process.env.EMAIL_CODE_EXPIRES_IN_SECONDS);

if (Number.isNaN(expiresIn)) {
  throw new Error('process.env.EMAIL_CODE_EXPIRES_IN_SECONDS is NaN');
}

export const emailConfig = {
  expiresIn,
};
