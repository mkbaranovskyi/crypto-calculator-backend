export const signInOrUpBodySchema = {
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
};
