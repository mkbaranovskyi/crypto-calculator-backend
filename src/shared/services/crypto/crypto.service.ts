import { DateTime } from 'luxon';
import fetch from 'node-fetch';
import { coinSearchRoute } from '../../../endpoints/crypto/coin-search.route';
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
  const unixStartDate = startDate.toUnixInteger();
  const unixEndDate = endDate.toUnixInteger();

  const res = await fetch(
    `${coinGeckoConfig.url}/coins/${coinId}/market_chart/range?vs_currency=usd&from=${unixStartDate}&to=${unixEndDate}`
  );

  const data: ICoinsMarketChartRangeResponse = await res.json();

  const resultPrices: number[] = [];

  if (isSameDate(startDate, endDate)) {
    const hasPrice = data.prices.at(-1);

    if (hasPrice) {
      const [timestamp, price] = hasPrice;
      resultPrices.push(price);
    }
  } else {
    const datePrices = new Set<string>();

    for (let index = 0; index < data.prices.length; index++) {
      const [timestamp, price] = data.prices[index];

      if (index === 0 || index === data.prices.length - 1) {
        resultPrices.push(price);
      } else {
        const priceDate = DateTime.fromMillis(timestamp);
        const priceDateString = priceDate.toLocaleString();

        const isMonthAndYearRange =
          isSameMonthAndYear(priceDate, startDate) || isSameMonthAndYear(priceDate, endDate);

        if (
          !isMonthAndYearRange &&
          priceDate.day === INVEST_DAY_OF_MONTH &&
          !datePrices.has(priceDateString)
        ) {
          datePrices.add(priceDateString);
          resultPrices.push(price);
        }
      }
    }
  }

  return { [coinId]: resultPrices };
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
  const result = { invested: 0, purchasedCoins: 0 };

  for (const price of prices) {
    result.invested += inputInvest;
    result.purchasedCoins += inputInvest / price;
  }

  return result;
};

export const getGrowth = (invested: number, capital: number) => {
  const percentOfInvestFromFinal = (invested * 100) / capital;
  const increaseIn = capital / invested;
  const growth = Number(((100 - percentOfInvestFromFinal) * increaseIn).toFixed(2));

  return growth;
};

const fixedPrice = (inputPrice: number) => {
  let resultPrice = NaN;

  const price = String(inputPrice);
  const symbolsBeforeDot = price.split('.')[0];
  const beforeDotLength = Number(symbolsBeforeDot) === 0 ? 0 : symbolsBeforeDot.length;

  if (beforeDotLength >= 1) {
    resultPrice = Number(inputPrice.toFixed(2));
  } else {
    const fixedNumbers = 4;
    const firstTwoSymbols = 2;

    for (let index = 0; index < price.length; index++) {
      const symbol = price[index];

      if (Number(symbol) > 0) {
        resultPrice = Number(inputPrice.toFixed(fixedNumbers + index - firstTwoSymbols));
        break;
      }
    }
  }

  return resultPrice;
};

const fixedCoinsNumber = (price: number, inputCoinsNumber: number) => {
  let resultCoinsNumber = NaN;

  const minQuantityBuy = String(1 / price);
  const symbolsBeforeDot = minQuantityBuy.split('.')[0];
  const beforeDotLength = Number(symbolsBeforeDot) === 0 ? 0 : symbolsBeforeDot.length;

  if (beforeDotLength >= 1) {
    resultCoinsNumber = Number(inputCoinsNumber.toFixed(1));
  } else {
    const firstTwoSymbols = 2;

    for (let index = 0; index < minQuantityBuy.length; index++) {
      const symbol = minQuantityBuy[index];

      if (Number(symbol) > 0) {
        const symbolPos = index + 1;
        resultCoinsNumber = Number(inputCoinsNumber.toFixed(symbolPos - firstTwoSymbols));
        break;
      }
    }
  }

  return resultCoinsNumber;
};

export const getCoinsProfit = ({
  monthlyInvestment,
  mainCoinsData,
}: IGetCoinsProfitInput): GetCoinsProfitOutput =>
  mainCoinsData.map(({ coinId, image, name, prices, share, symbol }) => {
    const monthlyInvestShare = (monthlyInvestment / 100) * share;

    const { purchasedCoins, invested } = getInvestAndPurchased(monthlyInvestShare, prices);

    const startingPrice = prices.at(0) || 0;
    const lastPrice = prices.at(-1) || 0;
    const capital = Number((purchasedCoins * lastPrice).toFixed(2));
    const growth = getGrowth(invested, capital);

    return {
      coinId,
      image,
      name,
      symbol,
      share,
      invested: Number(invested.toFixed(2)),
      capital,
      startingPrice: fixedPrice(startingPrice),
      lastPrice: fixedPrice(lastPrice),
      purchasedCoins: fixedCoinsNumber(lastPrice, purchasedCoins),
      growth,
    };
  });
