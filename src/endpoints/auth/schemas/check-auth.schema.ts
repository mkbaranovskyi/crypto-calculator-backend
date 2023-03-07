import { FastifySchema } from 'fastify';
import { jwtBodySchema } from '../../../shared/models';

export interface ICheckAuthBodySchema {
  refreshToken: string;
}

export const checkAuthSchema: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      refreshToken: { type: 'string' },
    },
    required: ['refreshToken'],
  },
  response: {
    200: jwtBodySchema,
  },
};
