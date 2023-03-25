import {
  ICoinMainData,
  ICoinsPrices,
  ICoinProfitResult,
  IMonthlyCapitalData,
  ICoinsCapitals,
} from '../../../types';

export type GetCoinsPricesOutput = ICoinsPrices;

export type GetMainCoinsDataOutput = ICoinMainData[];

export interface IGetCoinsProfitOutput {
  coinsCapitals: ICoinsCapitals;
  coinsProfit: ICoinProfitResult[];
}

export type GetMonthlyCapitalsOutput = IMonthlyCapitalData[];
