export const jwtSchema = {
  type: 'object',
  properties: {
    accessToken: { type: 'string' },
    refreshToken: { type: 'string' },
    accessTokenExpiresIn: { type: 'number', format: 'integer', example: 1638904355716 },
    refreshTokenExpiresIn: { type: 'number', format: 'integer', example: 1641496355716 },
  },
  required: ['accessToken', 'refreshToken', 'accessTokenExpiresIn', 'refreshTokenExpiresIn'],
};
