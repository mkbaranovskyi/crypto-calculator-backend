import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class UserEntity extends Base {
  @Column()
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  sessionKey!: string;
}

@Entity()
export class VerificationCodes extends Base {
  @ObjectIdColumn()
  userId!: ObjectID;

  @Column()
  code!: string;

  @Column()
  expiresAt!: Date;
}
