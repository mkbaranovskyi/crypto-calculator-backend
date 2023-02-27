export interface ICoinShareData {
  coinId: string;
  share: number;
}

export interface ICoinsPrices {
  [key: string]: number[];
}

export interface IProfitOfCoinData {
  lastPrice: number;
  totalInvested: number;
  finalCapital: number;
  purchasedCoins: number;
  growth: number;
  coinId: string;
  share: number;
}
