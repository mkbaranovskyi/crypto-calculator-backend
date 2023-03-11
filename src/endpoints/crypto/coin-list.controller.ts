import { MAX_NUMBER_OF_COINS_TO_INVEST } from '../../shared/consts';
import { CryptoDataEntity } from '../../shared/database';
import { LocalStorage } from '../../shared/services';
import { ControllerOptions } from '../../shared/types';
import { validateCoinListInput } from './error-handlers';
import { CoinListSchema, ICoinListBodyInput } from './schemas';

export const coinListController: ControllerOptions<{ Body: ICoinListBodyInput }> = {
  url: '/coin-list',
  method: 'POST',
  schema: CoinListSchema,
  handler: async (req, reply) => {
    const { startDate, endDate, monthlyInvestment } = req.body;

    validateCoinListInput({ startDate, endDate, monthlyInvestment });

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
