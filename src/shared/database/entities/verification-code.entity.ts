import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { Base } from './base.entity';

@Entity('verificationCodes')
export class VerificationCodeEntity extends Base {
  @ObjectIdColumn()
  userId!: ObjectID;

  @Column()
  code!: string;

  @Column()
  expiresAt!: Date;
}
