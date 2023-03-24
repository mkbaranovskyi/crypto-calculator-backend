import { DateTime } from 'luxon';
import {
  ICoinInfo,
  ICoinMainData,
  ICoinProfitResult,
  ICoinsCapitals,
  ICoinShareData,
  ICoinsPrices,
} from '../../../types';

export interface IGetCoinPricesInput {
  startDate: DateTime;
  endDate: DateTime;
  coinId: string;
}

export interface IGetMainCoinsDataInput {
  coinsPrices: ICoinsPrices[];
  coinsShares: ICoinShareData[];
  mainCoinsInfo: ICoinInfo[];
}

export interface IGetCoinsProfitInput {
  monthlyInvestment: number;
  mainCoinsData: ICoinMainData[];
}

export type GetTotalCapitalInput = ICoinProfitResult[];

export interface IGetMonthlyCapitalsInput {
  coinsCapitals: ICoinsCapitals;
  startDate: DateTime;
  endDate: DateTime;
}
