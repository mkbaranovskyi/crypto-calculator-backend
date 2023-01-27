import { DataSource } from 'typeorm';
import { mongoConfig } from '../configs';
import { UserEntity, VerificationCodesEntity } from './entities';

export const connectToDB = () => {
  new DataSource({
    type: 'mongodb',
    url: mongoConfig.url,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    authSource: 'admin',
    entities: [UserEntity, VerificationCodesEntity],
  }).initialize();
};
