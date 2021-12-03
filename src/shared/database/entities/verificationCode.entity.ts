import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class VerificationCodesEntity extends Base {
  @ObjectIdColumn()
  userId!: ObjectID;

  @Column()
  code!: string;

  @Column()
  expiresAt!: Date;
}
