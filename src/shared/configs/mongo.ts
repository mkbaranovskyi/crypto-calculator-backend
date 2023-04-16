const mongoPort = Number(process.env.MONGO_PORT);

if (Number.isNaN(mongoPort)) {
  throw new Error('process.env.MONGO_PORT is NaN');
}

if (!process.env.MONGO_USERNAME) {
  throw new Error('process.env.MONGO_USERNAME is undefined');
}

if (!process.env.MONGO_PASS) {
  throw new Error('process.env.MONGO_PASS is undefined');
}

if (!process.env.MONGO_DATABASE) {
  throw new Error('process.env.MONGO_DATABASE is undefined');
}

export const mongoConfig = {
  username: process.env.MONGO_USERNAME,
  pass: process.env.MONGO_PASS,
  database: process.env.MONGO_DATABASE,
  port: mongoPort,
};
