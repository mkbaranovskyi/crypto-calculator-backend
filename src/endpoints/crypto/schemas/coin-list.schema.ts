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
  headers: {
    type: 'object',
    properties: {
      authorization: { type: 'string' },
    },
    required: ['authorization'],
  },
  response: {
    200: {
      type: 'array',
      items: {
        coinId: { type: 'string' },
        image: { type: 'string' },
        symbol: { type: 'string' },
      },
    },
  },
};
