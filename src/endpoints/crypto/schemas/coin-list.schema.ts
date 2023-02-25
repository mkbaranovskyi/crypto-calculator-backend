import { authorizationHeaderSchema, statusOutputSchema } from '../../../shared/models';

export interface ICoinListBodyInput {
  startDate: number;
  endDate: number;
  monthlyInvestment: number;
}

export const CoinListSchema = {
  body: {
    type: 'object',
    properties: {
      startDate: { type: 'number' },
      endDate: { type: 'number' },
      monthlyInvestment: { type: 'number' },
    },
    required: ['startDate', 'endDate', 'monthlyInvestment'],
  },
  headers: authorizationHeaderSchema,
  response: {
    200: statusOutputSchema,
  },
};
