import { DataSource } from 'typeorm';
import { mongoConfig } from '../configs';
import { CoinListEntity, CryptoDataEntity, UserEntity, VerificationCodesEntity } from './entities';

export const connectToDB = async () => {
  await new DataSource({
    type: 'mongodb',
    url: mongoConfig.url,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    synchronize: true,
    authSource: 'admin',
    entities: [UserEntity, VerificationCodesEntity, CoinListEntity, CryptoDataEntity],
  }).initialize();
};
