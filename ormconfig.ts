import { ConnectionOptions } from 'typeorm';
import { Users } from './src/entity/entity';

export const ormCongif: ConnectionOptions = {
  type: 'mongodb',
  url: process.env.URI,
  useNewUrlParser: true,
  synchronize: true,
  logging: true,
  entities: [Users],
};
