import { DataSource } from 'typeorm';
import { mongoConfig } from '../configs';
import { CoinListEntity, UserEntity, VerificationCodesEntity } from './entities';

export const connectToDB = () => {
  new DataSource({
    type: 'mongodb',
    url: mongoConfig.url,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    synchronize: true,
    authSource: 'admin',
    entities: [UserEntity, VerificationCodesEntity, CoinListEntity],
  }).initialize();
};
