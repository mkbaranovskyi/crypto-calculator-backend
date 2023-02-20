import { Column, Entity, OneToOne } from 'typeorm';
import { Base } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('verificationCodes')
export class VerificationCodeEntity extends Base {
  @Column()
  code!: string;

  @Column()
  expiresAt!: Date;

  @OneToOne(() => UserEntity, (user) => user.verificationCode)
  user!: UserEntity;
}
