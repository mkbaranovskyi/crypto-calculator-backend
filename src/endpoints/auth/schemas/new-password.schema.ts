import { jwtSchema } from '../../../shared/models';

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
    200: jwtSchema,
  },
};
