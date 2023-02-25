import { Column, Entity, Index } from 'typeorm';
import { Base } from './base.entity';

@Entity('coinList')
export class CoinListEntity extends Base {
  @Column({ unique: true })
  coinId!: string;

  @Index()
  @Column()
  name!: string;

  @Index()
  @Column()
  symbol!: string;

  @Column()
  image!: string;

  @Column()
  atl_date!: Date;
}
