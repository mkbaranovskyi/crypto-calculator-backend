import { DateTime } from 'luxon';

export interface IGetCoinPricesInput {
  startDate: DateTime;
  endDate: DateTime;
  coinId: string;
}
