if (!process.env.CRYPTO_SECRET) {
  throw new Error('process.env.CRYPTO_SECRET is undefined');
}

export const cryptoConfig = {
  secret: process.env.CRYPTO_SECRET,
};
