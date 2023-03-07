import { signInOrUpBodySchema } from '../../../shared/models';

export interface ISignUpBodyInput {
  email: string;
  password: string;
}

export const signUpSchema = {
  body: signInOrUpBodySchema,
  response: {
    200: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        accessTokenExpiresIn: { type: 'number', format: 'integer', example: 1638904355716 },
        refreshTokenExpiresIn: { type: 'number', format: 'integer', example: 1641496355716 },
        emailCodeExpiresIn: { type: 'number' },
      },
      required: [
        'accessToken',
        'refreshToken',
        'accessTokenExpiresIn',
        'refreshTokenExpiresIn',
        'emailCodeExpiresIn',
      ],
    },
  },
};
