import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { Base } from './base.entity';

@Entity('verificationCodes')
export class VerificationCodeEntity extends Base {
  @Column()
  userId!: string;

  @Column()
  code!: string;

  @Column()
  expiresAt!: Date;
}
