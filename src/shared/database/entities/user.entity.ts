import { Column, Entity } from 'typeorm';
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
}
