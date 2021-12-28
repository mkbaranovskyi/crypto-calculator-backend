import { Column, Entity, UpdateDateColumn } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class VerificationCodesEntity extends Base {
  @Column()
  userId!: string;

  @Column()
  code!: string;

  @UpdateDateColumn()
  expiresAt!: Date;
}
