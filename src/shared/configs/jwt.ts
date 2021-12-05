if (!process.env.JWT_SECRET) {
  throw new Error('process.env.JWT_SECRET is undefined');
}
if (!process.env.JWT_ACCESS_LIFETIME) {
  throw new Error('process.env.JWT_ACCESS_LIFETIME is undefined');
}
if (!process.env.JWT_REFRESH_LIFETIME) {
  throw new Error('process.env.JWT_REFRESH_LIFETIME is undefined');
}

export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  accessLifetime: Number(process.env.JWT_ACCESS_LIFETIME),
  refreshLifetime: Number(process.env.JWT_REFRESH_LIFETIME),
};
