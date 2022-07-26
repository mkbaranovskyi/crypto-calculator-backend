export interface INewPasswordBodyInput {
  email: string;
  password: string;
  code: string;
}

export const newPasswordSchema = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 256,
      },
      code: { type: 'string', minLength: 6, maxLength: 6 },
    },
    required: ['email', 'password', 'code'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        accessTokenExpiresIn: { type: 'number', format: 'integer', example: 1638904355716 },
        refreshTokenExpiresIn: { type: 'number', format: 'integer', example: 1641496355716 },
      },
      required: ['accessToken', 'refreshToken', 'accessTokenExpiresIn', 'refreshTokenExpiresIn'],
    },
  },
};
