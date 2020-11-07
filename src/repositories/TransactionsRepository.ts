import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find()
    const income = transactions.reduce((total, currentValue) => (currentValue.type === 'income' ? total + currentValue.value : total + 0), 0)
    const outcome = transactions.reduce((total, currentValue) => (currentValue.type === 'outcome' ? total + currentValue.value : total + 0), 0)

    const result: Balance = {
      income,
      outcome,
      total: income - outcome
    }

    return result
  }
}

export default TransactionsRepository;
