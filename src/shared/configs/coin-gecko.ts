if (!process.env.COIN_GECKO_URL) {
  throw new Error('process.env.COIN_GECKO_URL is undefined');
}

export const coinGeckoConfig = {
  url: process.env.COIN_GECKO_URL,
};
