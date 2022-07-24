import { statusOutputSchema } from '../../../shared/models';

export interface IValidateEmailBodySchema {
  code: string;
}

export const validateEmailSchema = {
  body: {
    type: 'object',
    properties: {
      code: { type: 'string', minLength: 6, maxLength: 6 },
    },
    required: ['code'],
  },
  headers: {
    type: 'object',
    properties: {
      authorization: { type: 'string' },
    },
    required: ['authorization'],
  },
  response: {
    200: statusOutputSchema,
  },
};
