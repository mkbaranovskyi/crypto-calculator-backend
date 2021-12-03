import { BaseEntity, CreateDateColumn, Entity, ObjectID, ObjectIdColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Base extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn()
  _id!: ObjectID

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
