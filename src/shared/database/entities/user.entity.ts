import { Column, Entity } from 'typeorm';
import { UserStateEnum } from '../../enums';
import { Base } from './base.entity';

@Entity('user')
export class UserEntity extends Base {
  @Column()
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  salt!: string;

  @Column()
  sessionKey!: string;

  @Column()
  state?: UserStateEnum = UserStateEnum.NOT_VERIFIED;
}
