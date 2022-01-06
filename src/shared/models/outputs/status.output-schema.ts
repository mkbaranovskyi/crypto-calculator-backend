export const statusOutputSchema = {
  type: 'object',
  properties: {
    status: { type: 'string' },
  },
  required: ['status'],
};

export const status500OutputSchema = {
  type: 'object',
  properties: {
    error: {
      message: { type: 'string' },
    },
  },
  required: ['status'],
};
