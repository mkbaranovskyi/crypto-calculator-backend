import { jwtConfig } from '../../../shared/configs';
import { tokensLifetime } from '../../../shared/services/luxon';

const { accessLifetime, refreshLifetime } = jwtConfig;

const { accessTokenExpiresIn, refreshTokenExpiresIn } = tokensLifetime(accessLifetime, refreshLifetime);

export const statusOutputSchema = {
  type: 'object',
  properties: {
    accessToken: { type: 'string' },
    refreshToken: { type: 'string' },
    accessTokenExpiresIn: { type: 'number', format: 'integer', example: accessTokenExpiresIn },
    refreshTokenExpiresIn: { type: 'number', format: 'integer', example: refreshTokenExpiresIn },
  },
  required: ['accessToken', 'refreshToken', 'accessTokenExpiresIn', 'refreshTokenExpiresIn'],
};
