import { DateTime } from 'luxon';
import {
  ICoinInfo,
  ICoinMainData,
  ICoinPrices,
  ICoinProfitResult,
  ICoinShareData,
} from '../../../types';

export interface IGetCoinPricesInput {
  startDate: DateTime;
  endDate: DateTime;
  coinId: string;
}

export interface IGetMainCoinsDataInput {
  coinsPrices: ICoinPrices[];
  coinsShares: ICoinShareData[];
  mainCoinsInfo: ICoinInfo[];
}

export interface IGetCoinsProfitInput {
  monthlyInvestment: number;
  mainCoinsData: ICoinMainData[];
}

export type GetTotalCapitalInput = ICoinProfitResult[];
