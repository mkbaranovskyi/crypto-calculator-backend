import { DateTime } from 'luxon';
import { ICoinsPrices, ICoinShareData } from '../../../coin-gecko';

export interface IGetCoinPricesInput {
  startDate: DateTime;
  endDate: DateTime;
  coinId: string;
}

export interface IGetProfitOfCoinsInput {
  monthlyInvestment: number;
  coinsShares: ICoinShareData[];
  coinsPrices: ICoinsPrices;
}
