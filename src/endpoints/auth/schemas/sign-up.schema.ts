import { signInOrUpBodySchema, signInOrUpOutputSchema } from '../../../shared/models';

export interface ISignUpBodyInput {
  email: string;
}

export const signUpSchema = {
  body: signInOrUpBodySchema,
  response: {
    200: signInOrUpOutputSchema,
  },
};
