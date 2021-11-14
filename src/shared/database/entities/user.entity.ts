import { Column, Entity } from 'typeorm'
import { Base } from './base.entity'

@Entity()
export class UserEntity extends Base {
  @Column()
  email!: string

  @Column()
  passwordHash!: string

  @Column()
  sessionKey!: string
}
