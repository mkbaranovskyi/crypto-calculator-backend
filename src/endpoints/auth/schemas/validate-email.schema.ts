import { authorizationHeaderSchema, statusOutputSchema } from '../../../shared/models';

export interface IValidateEmailBodyInput {
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
  headers: authorizationHeaderSchema,
  response: {
    200: statusOutputSchema,
  },
};
