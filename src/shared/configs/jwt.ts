if (!process.env.JWT_SECRET) {
  throw new Error('process.env.JWT_SECRET is undefined');
}
if (!process.env.JWT_ACCESS_DEATHDATE) {
  throw new Error('process.env.JWT_ACCESS_DEATHDATE is undefined');
}
if (!process.env.JWT_REFRESH_DEATHDATE) {
  throw new Error('process.env.JWT_REFRESH_DEATHDATE is undefined');
}

export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  accessDeathDate: Number(process.env.JWT_ACCESS_DEATHDATE),
  refreshDeathDate: Number(process.env.JWT_REFRESH_DEATHDATE),
};
