import { statusOutputSchema } from '../../../shared/models';

export interface ICodeEmailBodyInput {
  email: string;
  code: string;
}

export const CodeEmailSchema = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      code: { type: 'string', minLength: 6, maxLength: 6 },
    },
    required: ['email', 'code'],
  },
  response: {
    200: statusOutputSchema,
  },
};
