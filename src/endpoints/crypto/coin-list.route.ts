import { DateTime } from 'luxon';
import { MAX_NUMBER_OF_COINS_TO_INVEST, MIN_COIN_DATE } from '../../shared/consts';
import { CryptoDataEntity } from '../../shared/database';
import { BadRequestException } from '../../shared/errors';
import { LocalStorage } from '../../shared/services';
import { RouteCustomOptions } from '../../shared/types';
import { CoinListSchema, ICoinListBodyInput } from './schemas';

export const coinListRoute: RouteCustomOptions<{ Body: ICoinListBodyInput }> = {
  url: '/coin-list',
  method: 'POST',
  schema: CoinListSchema,
  handler: async (req, reply) => {
    const { startDate, endDate, monthlyInvestment } = req.body;

    const minDate = DateTime.fromISO(MIN_COIN_DATE).toMillis();
    const currentDate = DateTime.now().toMillis();

    if (startDate < minDate) {
      throw new BadRequestException(`Start date cannot be less than ${MIN_COIN_DATE}.`);
    }

    if (endDate > currentDate) {
      throw new BadRequestException('Start date cannot be more than today.');
    }

    if (startDate > endDate) {
      throw new BadRequestException('Start date cannot be less than end date.');
    }

    if (monthlyInvestment < 20) {
      throw new BadRequestException('Monthly investment cannot be less than 20$.');
    }

    const user = LocalStorage.getUser();

    let cryptoData = await CryptoDataEntity.findOneBy({ userId: String(user._id) });

    if (!cryptoData) {
      cryptoData = new CryptoDataEntity();
      cryptoData.userId = String(user._id);
    }

    cryptoData.startDate = new Date(startDate);
    cryptoData.endDate = new Date(endDate);
    cryptoData.monthlyInvestment = monthlyInvestment;

    await cryptoData.save();

    return { maxNumberOfCoinsToInvest: MAX_NUMBER_OF_COINS_TO_INVEST };
  },
};
