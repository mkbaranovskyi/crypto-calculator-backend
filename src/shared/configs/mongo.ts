if (!process.env.MONGO_URL) {
  throw new Error("process.env.MONGO_URL is undefined")
}

export const mongoConfig = {
  url: process.env.MONGO_URL
}
