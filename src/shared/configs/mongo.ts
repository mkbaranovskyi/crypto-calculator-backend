if (!process.env.MONGO_USERNAME) {
  throw new Error('process.env.MONGO_USERNAME is undefined');
}

if (!process.env.MONGO_PASS) {
  throw new Error('process.env.MONGO_PASS is undefined');
}

export const mongoConfig = {
  username: process.env.MONGO_USERNAME,
  pass: process.env.MONGO_PASS,
};
