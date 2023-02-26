import { DateTime } from 'luxon';
import fetch from 'node-fetch';
import { ICoinsMarketChartRangeResponse } from '../../coin-gecko';
import { coinGeckoConfig } from '../../configs';
import { INVEST_DAY_OF_MONTH } from '../../consts';
import { IGetCoinPricesInput } from './inputs';

const isSameMonthAndYear = (priceDate: DateTime, usersDate: DateTime) =>
  priceDate.month === usersDate.month && priceDate.year === usersDate.year;

const isSameDate = (priceDate: DateTime, usersDate: DateTime) =>
  priceDate.day === usersDate.day && isSameMonthAndYear(priceDate, usersDate);

export const getCoinPrices = async ({ coinId, startDate, endDate }: IGetCoinPricesInput) => {
  const correctStartDate = Math.floor(startDate.toMillis() / 1000);
  const correctEndDate = Math.floor(endDate.toMillis() / 1000);

  const res = await fetch(
    `${coinGeckoConfig.url}/coins/${coinId}/market_chart/range?vs_currency=usd&from=${correctStartDate}&to=${correctEndDate}`
  );

  const data: ICoinsMarketChartRangeResponse = await res.json();

  console.log(data);

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
