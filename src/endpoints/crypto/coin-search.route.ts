import { CoinListEntity, CryptoDataEntity } from '../../shared/database';
import { BadRequestException } from '../../shared/errors';
import { LocalStorage } from '../../shared/services';
import { RouteCustomOptions } from '../../shared/types';
import { CoinSearchSchema, ICoinSearchBodyInput } from './schemas';
import { AvialableCoinsType, selectKeys } from './types';

export const coinSearchRoute: RouteCustomOptions<{ Body: ICoinSearchBodyInput }> = {
  url: '/coin-search',
  method: 'POST',
  schema: CoinSearchSchema,
  handler: async (req, reply) => {
    const { searchText, limit } = req.body;

    const user = LocalStorage.getUser();

    const cryptoData = await CryptoDataEntity.findOneBy({ userId: String(user._id) });

    if (!cryptoData) {
      throw new BadRequestException('Missing internal data for request.');
    }

    const avialableCoins = await CoinListEntity.find({
      where: {
        name: { $regex: new RegExp(searchText, 'i') } as any,
        atl_date: { $lte: new Date(cryptoData.startDate) } as any,
      },
      select: selectKeys,
      take: limit,
    });

    return avialableCoins.map(({ _id, ...rest }: AvialableCoinsType) => ({ ...rest }));
  },
};
