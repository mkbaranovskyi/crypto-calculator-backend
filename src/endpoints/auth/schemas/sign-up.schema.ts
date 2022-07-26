export interface ISignUpBodyInput {
  email: string;
  password: string;
}

export const signUpSchema = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 256,
      },
    },
    required: ['email', 'password'],
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
