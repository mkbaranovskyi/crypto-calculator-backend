if (!process.env.JWT_SECRET) {
  throw new Error('process.env.JWT_SECRET is undefined');
}

export const jwtConfig = {
  secret: process.env.JWT_SECRET,
};
