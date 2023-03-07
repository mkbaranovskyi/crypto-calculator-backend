import { jwtSchema } from '../../../shared/models';

export interface ISignUpOrInBodyInput {
  email: string;
  password: string;
}

export const signUpOrInSchema = {
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
    200: jwtSchema,
  },
};
