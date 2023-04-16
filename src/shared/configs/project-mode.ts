if (!process.env.NODE_ENV) {
  throw new Error('process.env.NODE_ENV is undefined');
}

export const projectModeConfig = {
  mode: process.env.NODE_ENV,
};
