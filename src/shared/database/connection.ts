import { DataSource } from 'typeorm';
import { mongoConfig } from '../configs';
import { CoinListEntity, CryptoDataEntity, UserEntity, VerificationCodeEntity } from './entities';

export const MyDataSource = new DataSource({
  type: 'mongodb',
  username: mongoConfig.username,
  password: mongoConfig.pass,
  database: mongoConfig.database,
  authSource: 'admin',
  port: 27017,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  entities: [UserEntity, VerificationCodeEntity, CoinListEntity, CryptoDataEntity],
});

export const MongoManager = MyDataSource.mongoManager;
