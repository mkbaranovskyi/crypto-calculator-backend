import { signInOrUpBodySchema, signInOrUpOutputSchema } from '../../../shared/models';

export interface ISignInBodyInput {
  email: string;
}

export const signInSchema = {
  body: signInOrUpBodySchema,
  response: {
    200: signInOrUpOutputSchema,
  },
};
