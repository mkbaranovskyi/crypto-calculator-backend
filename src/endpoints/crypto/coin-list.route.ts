import { DateTime } from 'luxon';
import { CoinListEntity, CryptoDataEntity } from '../../shared/database';
import { BadRequestException } from '../../shared/errors';
import { LocalStorage } from '../../shared/services';
import { RouteCustomOptions } from '../../shared/types';
import { CoinListSchema, ICoinListBodyInput } from './schemas';

interface IAvialableCoins {
  coinId: string;
  image: string;
  symbol: string;
}

export const coinListRoute: RouteCustomOptions<{ Body: ICoinListBodyInput }> = {
  url: '/coin-list',
  method: 'POST',
  schema: CoinListSchema,
  handler: async (req, reply) => {
    const { startDate, endDate, monthlyInvestment } = req.body;

    const minDate = DateTime.fromISO('2013-01-01').toMillis();
    const currentDate = DateTime.now().toMillis();

    if (startDate < minDate) {
      throw new BadRequestException('Start date cannot be less than 2013-01-01.');
    }

    if (endDate > currentDate) {
      throw new BadRequestException('Start date cannot be more than today.');
    }

    if (monthlyInvestment < 20) {
      throw new BadRequestException('Monthly investment cannot be less than 20$.');
    }

    const user = LocalStorage.getUser();

    const coins = await CoinListEntity.find();
    const avialableCoins: IAvialableCoins[] = [];

    for (const { coinId, atl_date, image, symbol } of coins) {
      const atlDate = DateTime.fromJSDate(atl_date).toMillis();

      if (atlDate <= endDate) {
        avialableCoins.push({ coinId, image, symbol });
      }
    }

    const isExistsCryptoData = await CryptoDataEntity.findOneBy({ userId: String(user._id) });

    if (isExistsCryptoData) {
      await CryptoDataEntity.update(user._id, {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        monthlyInvestment,
      });
    } else {
      await CryptoDataEntity.create({
        userId: String(user._id),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        monthlyInvestment,
      }).save();
    }

    return avialableCoins;
  },
};
