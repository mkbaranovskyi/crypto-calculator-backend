import { DataSource } from 'typeorm';
import { mongoConfig } from '../configs';
import { CoinListEntity, CryptoDataEntity, UserEntity, VerificationCodeEntity } from './entities';

export const connectToDB = async () => {
  await new DataSource({
    type: 'mongodb',
    url: mongoConfig.url,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    synchronize: false,
    authSource: 'admin',
    entities: [UserEntity, VerificationCodeEntity, CoinListEntity, CryptoDataEntity],
  }).initialize();
};
