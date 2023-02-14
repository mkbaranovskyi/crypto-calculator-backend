import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity('verificationCodes')
export class VerificationCodesEntity extends Base {
  @Column()
  userId!: string;

  @Column()
  code!: string;

  @Column()
  expiresAt!: Date;
}
