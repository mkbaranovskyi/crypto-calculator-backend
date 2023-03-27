import { Column, Entity } from 'typeorm';
import { ISessionKeyData } from '../../types';
import { Base } from './base.entity';

@Entity('user')
export class UserEntity extends Base {
  @Column()
  email!: string;

  @Column()
  sessionKeys!: ISessionKeyData[];
}
