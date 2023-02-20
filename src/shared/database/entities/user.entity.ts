import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserStateEnum } from '../../enums';
import { Base } from './base.entity';
import { CryptoDataEntity } from './crypto-data.entity';
import { VerificationCodeEntity } from './verification-code.entity';

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

  @OneToOne(() => CryptoDataEntity, (cryptoData) => cryptoData.user)
  @JoinColumn()
  cryptoData!: CryptoDataEntity;

  @OneToOne(() => VerificationCodeEntity, (verificationCode) => verificationCode.user)
  @JoinColumn()
  verificationCode!: VerificationCodeEntity;
}
