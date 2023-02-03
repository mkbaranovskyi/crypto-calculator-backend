import {
  BaseEntity,
  Column,
  Entity,
  ObjectID,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('coinList')
export class CoinListEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn()
  _id!: ObjectID;

  @Column({ unique: true })
  coinId!: string;

  @Column()
  name!: string;

  @Column()
  symbol!: string;

  @Column()
  image!: string;

  @Column()
  atl_date!: Date;
}
