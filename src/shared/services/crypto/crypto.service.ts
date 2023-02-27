import { DateTime } from 'luxon';
import fetch from 'node-fetch';
import { ICoinsMarketChartRangeResponse } from '../../coin-gecko';
import { coinGeckoConfig } from '../../configs';
import { INVEST_DAY_OF_MONTH } from '../../consts';
import { IGetCoinPricesInput, IGetProfitOfCoinsInput } from './inputs';
import { GetCoinsPricesOutput, GetProfitOfCoinsOutput } from './outputs';

const isSameMonthAndYear = (priceDate: DateTime, usersDate: DateTime) =>
  priceDate.month === usersDate.month && priceDate.year === usersDate.year;

const isSameDate = (priceDate: DateTime, usersDate: DateTime) =>
  priceDate.day === usersDate.day && isSameMonthAndYear(priceDate, usersDate);

export const getCoinPrices = async ({
  coinId,
  startDate,
  endDate,
}: IGetCoinPricesInput): Promise<GetCoinsPricesOutput> => {
  const correctStartDate = Math.floor(startDate.toMillis() / 1000);
  const correctEndDate = Math.floor(endDate.toMillis() / 1000);

  const res = await fetch(
    `${coinGeckoConfig.url}/coins/${coinId}/market_chart/range?vs_currency=usd&from=${correctStartDate}&to=${correctEndDate}`
  );

  const data: ICoinsMarketChartRangeResponse = await res.json();

  const prices: number[] = [];

  for (const [timestamp, price] of data.prices) {
    const priceDate = DateTime.fromMillis(timestamp);

    if (isSameDate(priceDate, startDate) || isSameDate(priceDate, endDate)) {
      prices.push(price);
    }

    const inNotSameMonthAndYear =
      !isSameMonthAndYear(priceDate, startDate) || !isSameMonthAndYear(priceDate, endDate);

    if (inNotSameMonthAndYear && priceDate.day === INVEST_DAY_OF_MONTH) {
      prices.push(price);
    }
  }

  return { [coinId]: prices };
};

const getInvestAndPurchased = (inputInvest: number, prices: number[]) => {
  const result = { totalInvested: 0, purchasedCoins: 0 };

  for (const price of prices) {
    result.totalInvested += inputInvest;
    result.purchasedCoins += inputInvest / price;
  }

  return result;
};

export const getProfitOfCoins = ({
  coinsPrices,
  coinsShares,
  monthlyInvestment,
}: IGetProfitOfCoinsInput): GetProfitOfCoinsOutput => {
  const coinsData: GetProfitOfCoinsOutput = [];

  for (const [coinId, prices] of Object.entries(coinsPrices)) {
    const coinShare = coinsShares.find((coin) => coin.coinId === coinId);
    const share = coinShare?.share || 0;
    const monthlyInvestShare = (monthlyInvestment / 100) * share;

    const { purchasedCoins, totalInvested } = getInvestAndPurchased(monthlyInvestShare, prices);

    const lastPrice = prices.at(-1) || 0;
    const finalCapital = purchasedCoins * lastPrice;

    const percentOfInvestFromFinal = (totalInvested * 100) / finalCapital;
    const increaseIn = finalCapital / totalInvested;
    const growth = Number(((100 - percentOfInvestFromFinal) * increaseIn).toFixed(2));

    coinsData.push({
      coinId,
      lastPrice,
      totalInvested,
      finalCapital,
      growth,
      purchasedCoins,
      share,
    });
  }

  return coinsData;
};
