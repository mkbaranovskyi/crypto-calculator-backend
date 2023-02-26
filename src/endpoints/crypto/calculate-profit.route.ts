import { DateTime } from 'luxon';
import { MAX_NUMBER_OF_COINS_TO_INVEST } from '../../shared/consts';
import { CoinListEntity, CryptoDataEntity } from '../../shared/database';
import { BadRequestException, InternalServerError } from '../../shared/errors';
import { CryptoService, LocalStorage } from '../../shared/services';
import { RouteCustomOptions } from '../../shared/types';
import { CalculateProfitBodyInput } from './schemas';

export const calculateProfitRoute: RouteCustomOptions<{ Body: CalculateProfitBodyInput }> = {
  url: '/calculate-profit',
  method: 'POST',
  handler: async (req, reply) => {
    const selectedCoins = req.body;

    if (selectedCoins.length === 0) {
      throw new BadRequestException('Must have at least 1 coin.');
    }

    if (selectedCoins.length > MAX_NUMBER_OF_COINS_TO_INVEST) {
      const errorMessage = `The maximum number of coins to invest is more than ${MAX_NUMBER_OF_COINS_TO_INVEST}.`;

      throw new BadRequestException(errorMessage);
    }

    const coinsId = selectedCoins.map(({ coinId }) => coinId);
    const coinsShared = selectedCoins.map(({ share }) => share);

    if (coinsId.length < selectedCoins.length || coinsShared.length < selectedCoins.length) {
      throw new BadRequestException('Invalid data format passed.');
    }

    const user = LocalStorage.getUser();
    const cryptoData = await CryptoDataEntity.findOneBy({ userId: String(user._id) });

    if (!cryptoData) {
      throw new InternalServerError('Missing data inside the server.');
    }

    const avialableCoins = await CoinListEntity.find({
      where: { atl_date: { $lte: new Date(cryptoData.startDate) } as any },
      select: ['coinId'],
    });

    const avialableCoinsId = avialableCoins.map(({ coinId }) => coinId);
    const userCoinsAvialable = coinsId.every((coinId) => avialableCoinsId.includes(coinId));

    if (!userCoinsAvialable) {
      throw new BadRequestException('Inaccessible coins indicated.');
    }

    const numberOExistingIds = await CoinListEntity.countBy({ coinId: { $in: coinsId } as any });

    if (coinsId.length > numberOExistingIds) {
      throw new BadRequestException('Non-existent coins indicated.');
    }

    const minDistributionOfShare = Number((100 / coinsShared.length).toFixed(1));
    const totalShare = coinsShared.reduce((prev, current) => prev + current, 0);
    const isIncorrectDistributionOfShares = coinsShared.some(
      (share) => share < minDistributionOfShare
    );

    if (totalShare < 99.8 || totalShare > 100.2 || isIncorrectDistributionOfShares) {
      console.log(totalShare);
      throw new BadRequestException('Incorrect distribution of share.');
    }

    const { startDate, endDate, monthlyInvestment } = cryptoData;

    const start = DateTime.fromJSDate(startDate);
    const end = DateTime.fromJSDate(endDate);

    const { months } = start.diff(end, ['months', 'days']);
    const diffMonths = Math.abs(months);

    const counfOfFirstAndLastMonths = 2;
    const investmentPeriod = diffMonths + counfOfFirstAndLastMonths;
    const totalInvested = investmentPeriod * monthlyInvestment;

    const test1 = await CryptoService.getCoinPrices({
      coinId: 'bitcoin',
      startDate: start,
      endDate: end,
    });

    return { totalInvested, investmentPeriod, test1 };
  },
};
