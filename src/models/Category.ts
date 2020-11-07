import { Column, Entity, Generated, Index, JoinColumn, OneToMany } from "typeorm";
import AuditBaseModel from "./AuditBaseModel";
import Transaction from "./Transaction";

@Entity({
  name: 'categories'
})
class Category extends AuditBaseModel {
  @Column({
    primary: true,
    type: 'uuid'
  })
  @Generated('uuid')
  id: string;

  @Column()
  @Index({ unique: true })
  title: string;

  @OneToMany(() => Transaction, transaction => transaction.category)
  transactions: Transaction[]

}

export default Category;
