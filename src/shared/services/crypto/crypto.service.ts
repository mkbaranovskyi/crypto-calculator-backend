import { DateTime } from 'luxon';
import { ICoinsMarketChartRangeResponse } from '../../coin-gecko';
import { coinGeckoConfig } from '../../configs';
import { INVEST_DAY_OF_MONTH } from '../../consts';
import { AvialableCoinsType, ICoinsCapitals } from '../../types';
import { LoggerInstance } from '../logger';
import {
  GetTotalCapitalInput,
  IGetCoinPricesInput,
  IGetCoinsProfitInput,
  IGetMainCoinsDataInput,
  IGetMonthlyCapitalsInput,
} from './inputs';
import {
  GetCoinsPricesOutput,
  GetMainCoinsDataOutput,
  GetMonthlyCapitalsOutput,
  IGetCoinsProfitOutput,
} from './outputs';

export const getMainCoinsInfo = (coinData: AvialableCoinsType[]) =>
  coinData.map(({ _id, ...rest }) => rest);

const isSameMonthAndYear = (firstDate: DateTime, secondDate: DateTime) =>
  firstDate.month === secondDate.month && firstDate.year === secondDate.year;

export const isSameDate = (firstDate: DateTime, secondDate: DateTime) =>
  firstDate.day === secondDate.day && isSameMonthAndYear(firstDate, secondDate);

export const getInvestmentPeriod = (startDate: DateTime, endDate: DateTime) => {
  const { months } = startDate.diff(endDate, ['months', 'days']);
  const diffMonths = Math.abs(months);

  const specifiedNumberOfMonths = isSameMonthAndYear(startDate, endDate) ? 0 : 1;

  return specifiedNumberOfMonths + diffMonths;
};

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

  const data = (await res.json()) as ICoinsMarketChartRangeResponse;

  LoggerInstance.info(`${coinId} prices length: ${data.prices.length}.`);

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

    LoggerInstance.info(
      `${coinId}: share: ${coinShareData.share}; prices: ${coinPrices[coinId].length}.`
    );

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

export const getTotalCapital = (coinsProfit: GetTotalCapitalInput) =>
  coinsProfit.reduce((prev, { capital }) => prev + capital, 0);

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

const getCoinCapitals = (prices: number[], investment: number) => {
  const capitals: number[] = [];
  const purchasedTokens: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    const currentMonthTokens = investment / prices[i];

    purchasedTokens[i] = (purchasedTokens[i - 1] ?? 0) + currentMonthTokens;
    capitals[i] = purchasedTokens[i] * prices[i];
  }

  return capitals;
};

export const getCoinsProfit = ({
  monthlyInvestment,
  mainCoinsData,
}: IGetCoinsProfitInput): IGetCoinsProfitOutput => {
  const coinsCapitals: ICoinsCapitals = {};

  const coinsProfit = mainCoinsData.map(({ coinId, image, name, prices, share, symbol }) => {
    const monthlyInvestShare = (monthlyInvestment / 100) * share;

    coinsCapitals[name] = getCoinCapitals(prices, monthlyInvestShare);

    const { purchasedCoins, invested } = getInvestAndPurchased(monthlyInvestShare, prices);

    const averagePrice = prices.reduce((prev, price) => prev + price, 0) / prices.length;
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
      averagePrice: fixedPrice(averagePrice),
      lastPrice: fixedPrice(lastPrice),
      purchasedCoins: fixedCoinsNumber(lastPrice, purchasedCoins),
      growth,
    };
  });

  return {
    coinsCapitals,
    coinsProfit,
  };
};

export const getMonthlyCapitals = ({
  coinsCapitals,
  startDate,
  endDate,
}: IGetMonthlyCapitalsInput): GetMonthlyCapitalsOutput => {
  const totalCapitals: number[] = [];

  let prevDate: null | DateTime = null;

  for (const [coinName, capitals] of Object.entries(coinsCapitals)) {
    for (let i = 0; i < capitals.length; i++) {
      const capital = capitals[i];

      if (Boolean(totalCapitals[i])) {
        totalCapitals[i] += capital;
      } else {
        totalCapitals[i] = capital;
      }
    }
  }

  const firstCapital = totalCapitals.at(0)?.toFixed(0);
  const lastCapital = totalCapitals.at(-1)?.toFixed(0);

  LoggerInstance.info(`First and last capital: ${firstCapital} and ${lastCapital}`);

  return totalCapitals.map((capital, index, arr) => {
    let resultDate = 0;

    if (index === 0) {
      resultDate = startDate.toMillis();
    } else if (index === arr.length - 1) {
      resultDate = endDate.toMillis();
    } else {
      prevDate = (prevDate || startDate).plus({ month: 1 }).set({ day: INVEST_DAY_OF_MONTH });
      resultDate = prevDate.toMillis();
    }

    return { capital: fixedPrice(capital), date: resultDate };
  });
};
