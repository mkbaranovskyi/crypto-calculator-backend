import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity('coinList')
export class CoinListEntity extends Base {
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
