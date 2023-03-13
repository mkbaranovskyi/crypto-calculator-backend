export const signInOrUpOutputSchema = {
  type: 'object',
  properties: {
    emailCodeExpiresIn: { type: 'number' },
  },
  required: ['emailCodeExpiresIn'],
};
