export interface IForgotEmailBodyInput {
  email: string;
}

export const ForgotEmailSchema = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
    },
    required: ['email'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        emailCodeExpiresIn: { type: 'number', format: 'integer', example: 1638904355716 },
      },
      required: ['emailCodeExpiresIn'],
    },
  },
};
