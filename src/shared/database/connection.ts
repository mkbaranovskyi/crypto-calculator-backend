import { DataSource } from 'typeorm';
import { CoinListEntity, CryptoDataEntity, UserEntity, VerificationCodeEntity } from './entities';

export const MyDataSource = new DataSource({
  type: 'mongodb',
  username: 'root',
  password: 'pass',
  database: 'crypto-calculator',
  authSource: 'admin',
  port: 27017,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  synchronize: false,
  entities: [UserEntity, VerificationCodeEntity, CoinListEntity, CryptoDataEntity],
});

export const MongoManager = MyDataSource.mongoManager;
