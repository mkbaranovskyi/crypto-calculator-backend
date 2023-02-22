import { statusOutputSchema } from '../../../shared/models';

export interface IUpdateCoinListQueryInput {
  per_page: number;
  page: number;
}

export const UpdateCoinListSchema = {
  query: {
    type: 'object',
    properties: {
      per_page: { type: 'number' },
      page: { type: 'number' },
    },
    required: ['per_page', 'page'],
  },
  response: {
    200: statusOutputSchema,
  },
};
