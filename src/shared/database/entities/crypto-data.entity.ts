import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity('cryptoData')
export class CryptoDataEntity extends Base {
  @Column()
  userId!: string;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;

  @Column()
  monthlyInvestment!: number;

  @Column()
  calculatedCoins!: {
    coinId: string;
    initialInvestment: number;
    finalCapital: number;
    growth: number;
  }[];

  @Column()
  totalProfit!: number;

  @Column()
  totalGrowth!: number;
}
