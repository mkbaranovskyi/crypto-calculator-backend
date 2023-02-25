import { authorizationHeaderSchema } from '../../../shared/models';

export interface ICoinSearchBodyInput {
  searchText: string;
  limit: number;
}

export const CoinSearchSchema = {
  body: {
    type: 'object',
    properties: {
      searchText: { type: 'string' },
      limit: { type: 'number' },
    },
    required: ['searchText', 'limit'],
  },
  headers: authorizationHeaderSchema,
  response: {
    200: {
      type: 'array',
      items: {
        coinId: { type: 'string' },
        image: { type: 'string' },
        symbol: { type: 'string' },
        name: { type: 'string' },
      },
    },
  },
};
