import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class Users {
  @ObjectIdColumn()
  id!: ObjectID;

  @Column()
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  sessionKey!: string;
}
