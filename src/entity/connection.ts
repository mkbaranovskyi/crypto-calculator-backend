import { createConnection } from 'typeorm';
import { ormCongif } from '../../ormconfig';

export const connection = async () => await createConnection(ormCongif);
