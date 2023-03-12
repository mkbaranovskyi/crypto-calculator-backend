import { jwtBodySchema, signInOrUpBodySchema } from '../../../shared/models';

export interface ISignInBodyInput {
  email: string;
  password: string;
}

export const signInSchema = {
  body: signInOrUpBodySchema,
  response: {
    200: jwtBodySchema,
  },
};
