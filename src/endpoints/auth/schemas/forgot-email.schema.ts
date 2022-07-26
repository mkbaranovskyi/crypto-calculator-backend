import { statusOutputSchema } from '../../../shared/models';

export interface IForgotEmailBodySchema {
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
    200: statusOutputSchema,
  },
};
