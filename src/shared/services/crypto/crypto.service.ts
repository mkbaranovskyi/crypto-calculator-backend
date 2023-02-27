import { DateTime } from 'luxon';
import fetch from 'node-fetch';
import { ICoinsMarketChartRangeResponse } from '../../coin-gecko';
import { coinGeckoConfig } from '../../configs';
import { INVEST_DAY_OF_MONTH } from '../../consts';
import { AvialableCoinsType } from '../../types';
import { IGetCoinPricesInput, IGetMainCoinsDataInput, IGetCoinsProfitInput } from './inputs';
import { GetCoinsPricesOutput, GetMainCoinsDataOutput, GetCoinsProfitOutput } from './outputs';

export const getMainCoinsInfo = (coinData: AvialableCoinsType[]) =>
  coinData.map(({ _id, ...rest }) => ({ ...rest }));

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

export const getMainCoinsData = ({
  coinsPrices,
  coinsShares,
  mainCoinsInfo,
}: IGetMainCoinsDataInput): GetMainCoinsDataOutput =>
  coinsPrices.map((coinPrices) => {
    const coinId = Object.keys(coinPrices).at(0)!;

    const mainCoinData = mainCoinsInfo.find(({ coinId: mainCoinId }) => mainCoinId === coinId)!;
    const coinShareData = coinsShares.find(({ coinId: coinShareId }) => coinShareId === coinId)!;

    return { ...mainCoinData, prices: coinPrices[coinId], share: coinShareData.share };
  });

const getInvestAndPurchased = (inputInvest: number, prices: number[]) => {
  const result = { totalInvested: 0, purchasedCoins: 0 };

  for (const price of prices) {
    result.totalInvested += inputInvest;
    result.purchasedCoins += inputInvest / price;
  }

  return result;
};

export const getCoinsProfit = ({
  monthlyInvestment,
  mainCoinsData,
}: IGetCoinsProfitInput): GetCoinsProfitOutput =>
  mainCoinsData.map(({ coinId, image, name, prices, share, symbol }) => {
    const monthlyInvestShare = (monthlyInvestment / 100) * share;

    const { purchasedCoins, totalInvested } = getInvestAndPurchased(monthlyInvestShare, prices);

    const lastPrice = prices.at(-1) || 0;
    const finalCapital = Number((purchasedCoins * lastPrice).toFixed(2));

    const percentOfInvestFromFinal = (totalInvested * 100) / finalCapital;
    const increaseIn = finalCapital / totalInvested;
    const growth = Number(((100 - percentOfInvestFromFinal) * increaseIn).toFixed(2));

    return {
      coinId,
      image,
      name,
      symbol,
      share,
      totalInvested,
      finalCapital,
      lastPrice,
      purchasedCoins,
      growth,
    };
  });
