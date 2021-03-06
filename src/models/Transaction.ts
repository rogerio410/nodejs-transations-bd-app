import { Column, Entity, Generated, ManyToOne } from 'typeorm'
import AuditBaseModel from './AuditBaseModel'
import Category from './Category'

@Entity({
  name: 'transactions',
})
class Transaction extends AuditBaseModel {
  @Column({
    primary: true,
    type: 'uuid',
  })
  @Generated('uuid')
  id: string

  @Column()
  title: string

  @Column('varchar')
  type: 'income' | 'outcome'

  @Column()
  value: number

  @ManyToOne(() => Category, category => category.transactions, {
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
    eager: true,
  })
  category: Category

  // unnecessary field only for rockeatseat test pass
  @Column()
  category_id: string
}

export default Transaction
