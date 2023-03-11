import { CoinListEntity, CryptoDataEntity } from '../../shared/database';
import { BadRequestException } from '../../shared/errors';
import { CryptoService, LocalStorage } from '../../shared/services';
import { ControllerOptions } from '../../shared/types';
import { CoinSearchSchema, ICoinSearchBodyInput } from './schemas';
import { infoSelectedKeys } from './types';

export const coinSearchController: ControllerOptions<{ Body: ICoinSearchBodyInput }> = {
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
      select: infoSelectedKeys,
      take: limit,
    });

    return CryptoService.getMainCoinsInfo(avialableCoins);
  },
};
