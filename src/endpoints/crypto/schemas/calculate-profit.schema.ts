import { FastifySchema } from 'fastify';
import { authorizationHeaderSchema } from '../../../shared/models';
import { ICoinShareData } from '../../../shared/types';

export type CalculateProfitBodyInput = ICoinShareData[];

export const CalculateProfitSchema: FastifySchema = {
  body: {
    type: 'array',
    items: {
      type: 'object',
      required: ['coinId', 'share'],
      properties: {
        coinId: { type: 'string' },
        share: { type: 'number' },
      },
    },
  },
  headers: authorizationHeaderSchema,
  response: {
    200: {
      totalInvested: { type: 'number' },
      investmentPeriod: { type: 'number' },
      totalCapital: { type: 'number' },
      totalGrowth: { type: 'number' },
      monthlyCapitals: {
        type: 'array',
        items: {
          date: { type: 'number' },
          capital: { type: 'number' },
        },
      },
      coins: {
        type: 'array',
        items: {
          coinId: { type: 'string' },
          image: { type: 'string' },
          symbol: { type: 'string' },
          name: { type: 'string' },
          startingPrice: { type: 'number' },
          averagePrice: { type: 'number' },
          lastPrice: { type: 'number' },
          invested: { type: 'number' },
          capital: { type: 'number' },
          purchasedCoins: { type: 'number' },
          growth: { type: 'number' },
          share: { type: 'number' },
        },
      },
    },
  },
};
