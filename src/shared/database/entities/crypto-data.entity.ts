import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Base } from './base.entity';
import { UserEntity } from './user.entity';

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

  @OneToOne(() => UserEntity, (user) => user.cryptoData)
  user!: UserEntity;
}
