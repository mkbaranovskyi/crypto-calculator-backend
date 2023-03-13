import { jwtBodySchema } from '../../../shared/models';

export interface IValidateEmailBodyInput {
  email: string;
  code: string;
}

export const validateEmailSchema = {
  body: {
    type: 'object',
    properties: {
      code: { type: 'string', minLength: 6, maxLength: 6 },
      email: { type: 'string', format: 'email' },
    },
    required: ['code', 'email'],
  },
  response: {
    200: jwtBodySchema,
  },
};
