import { Column, Entity } from 'typeorm';
import { USER_STATE } from '../../enums';
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
  state?: USER_STATE = USER_STATE.NOT_VERIFIED;
}
