export interface ISendSmsInput {
  email: string;
  password: string;
}

export const optionsBody = {
  body: {
    200: {
      type: 'object',
      required: ['email', 'passwordHash', 'sessionKey'],
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  },
};
