import { DateTime } from 'luxon';
import { CryptoService } from '../../shared/services';
import { ControllerOptions } from '../../shared/types';
import { validateCalculateProfitInput } from './error-handlers';
import { CalculateProfitBodyInput, CalculateProfitSchema } from './schemas';

export const calculateProfitController: ControllerOptions<{ Body: CalculateProfitBodyInput }> = {
  url: '/calculate-profit',
  method: 'POST',
  schema: CalculateProfitSchema,
  handler: async (req, reply) => {
    const selectedCoins = req.body;

    const { cryptoData, avialableCoins } = await validateCalculateProfitInput(selectedCoins);

    const { startDate, endDate, monthlyInvestment } = cryptoData;

    const start = DateTime.fromJSDate(startDate);
    const end = DateTime.fromJSDate(endDate);

    const investmentPeriod = CryptoService.getInvestmentPeriod(start, end);
    const totalInvested = Number((investmentPeriod * monthlyInvestment).toFixed(2));

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

    const totalCapital = CryptoService.getTotalCapital(coinsProfit);
    const totalGrowth = CryptoService.getGrowth(totalInvested, totalCapital);

    return {
      totalInvested,
      investmentPeriod,
      totalCapital: Number(totalCapital.toFixed(2)),
      totalGrowth,
      coins: coinsProfit,
    };
  },
};
