import { createConnection } from 'typeorm';
import { mongoConfig } from '../configs';
import { UserEntity, VerificationCodes } from './entities';

export const connectToDB = async () => {
  await createConnection({
    type: 'mongodb',
    url: mongoConfig.url,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    entities: [UserEntity, VerificationCodes],
  });
};
