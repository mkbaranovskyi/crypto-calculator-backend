if (!process.env.COOKIE_SECRET) {
  throw new Error('process.env.COOKIE_SECRET is undefined');
}

export const cookieConfig = {
  secret: process.env.COOKIE_SECRET,
};
