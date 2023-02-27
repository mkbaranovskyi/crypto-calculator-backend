import { DateTime } from 'luxon';
import { CryptoService } from '../../shared/services';
import { RouteCustomOptions } from '../../shared/types';
import { calculateProfitErrorHandler } from './error-handlers';
import { CalculateProfitBodyInput, CalculateProfitSchema } from './schemas';

export const calculateProfitRoute: RouteCustomOptions<{ Body: CalculateProfitBodyInput }> = {
  url: '/calculate-profit',
  method: 'POST',
  schema: CalculateProfitSchema,
  handler: async (req, reply) => {
    const selectedCoins = req.body;

    const { cryptoData, avialableCoins } = await calculateProfitErrorHandler(selectedCoins);

    const { startDate, endDate, monthlyInvestment } = cryptoData;

    const start = DateTime.fromJSDate(startDate);
    const end = DateTime.fromJSDate(endDate);

    const { months } = start.diff(end, ['months', 'days']);
    const diffMonths = Math.abs(months);

    const counfOfFirstAndLastMonths = 2;
    const investmentPeriod = diffMonths + counfOfFirstAndLastMonths;
    const totalInvested = investmentPeriod * monthlyInvestment;

    const coinsPricesPromises = selectedCoins.map(({ coinId }) =>
      CryptoService.getCoinPrices({ coinId, startDate: start, endDate: end })
    );

    const coinsPrices = await Promise.all(coinsPricesPromises);

    const mainCoinsInfo = CryptoService.getMainCoinsInfo(avialableCoins);

    const mainCoinsData = CryptoService.getMainCoinsData({
      coinsPrices,
      coinsShares: selectedCoins,
      mainCoinsInfo: mainCoinsInfo,
    });

    const coinsProfit = CryptoService.getCoinsProfit({
      monthlyInvestment: cryptoData.monthlyInvestment,
      mainCoinsData,
    });

    const totalCapital = coinsProfit.reduce((prev, { capital }) => prev + capital, 0);
    const totalGrowth = CryptoService.getGrowth(totalInvested, totalCapital);

    return {
      totalInvested,
      investmentPeriod,
      totalCapital,
      totalGrowth,
      coins: coinsProfit,
    };
  },
};
