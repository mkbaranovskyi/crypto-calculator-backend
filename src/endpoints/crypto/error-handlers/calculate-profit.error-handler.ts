import { MAX_NUMBER_OF_COINS_TO_INVEST } from '../../../shared/consts';
import { CoinListEntity, CryptoDataEntity } from '../../../shared/database';
import { BadRequestException, InternalServerError } from '../../../shared/errors';
import { LocalStorage } from '../../../shared/services';
import { CalculateProfitBodyInput } from '../schemas';
import { infoSelectedKeys } from '../types';

export const calculateProfitErrorHandler = async (selectedCoins: CalculateProfitBodyInput) => {
  if (selectedCoins.length === 0) {
    throw new BadRequestException('Must have at least 1 coin.');
  }

  if (selectedCoins.length > MAX_NUMBER_OF_COINS_TO_INVEST) {
    const errorMessage = `The maximum number of coins to invest is more than ${MAX_NUMBER_OF_COINS_TO_INVEST}.`;

    throw new BadRequestException(errorMessage);
  }

  const coinsId = selectedCoins.map(({ coinId }) => coinId);
  const coinsShares = selectedCoins.map(({ share }) => share);

  if (coinsId.length < selectedCoins.length || coinsShares.length < selectedCoins.length) {
    throw new BadRequestException('Invalid data format passed.');
  }

  const user = LocalStorage.getUser();
  const cryptoData = await CryptoDataEntity.findOneBy({ userId: String(user._id) });

  if (!cryptoData) {
    throw new InternalServerError('Missing data inside the server.');
  }

  const avialableCoins = await CoinListEntity.find({
    where: { atl_date: { $lte: new Date(cryptoData.startDate) } as any },
    select: infoSelectedKeys,
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

  const minDistributionOfShare = Number((100 / coinsShares.length).toFixed(1));
  const totalShare = coinsShares.reduce((prev, current) => prev + current, 0);
  const isIncorrectDistributionOfShares = coinsShares.some(
    (share) => share < minDistributionOfShare
  );

  if (totalShare < 99.8 || totalShare > 100.2 || isIncorrectDistributionOfShares) {
    throw new BadRequestException('Incorrect distribution of share.');
  }

  return { cryptoData, avialableCoins };
};
