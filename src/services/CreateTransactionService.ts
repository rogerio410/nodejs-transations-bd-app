// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string
  value: number
  type: 'income' | 'outcome'
  category: string
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    const categoriesRepo = getRepository(Category)

    let categoryFound: Category

    try {
      categoryFound = await categoriesRepo.findOneOrFail({ title: category })
    } catch {
      categoryFound = categoriesRepo.create({ title: category })
      await categoriesRepo.save(categoryFound)
    }
    const transactionsRepo = getCustomRepository(TransactionsRepository)

    const balance = await transactionsRepo.getBalance()
    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Insufficient Balance', 400)
    }

    const transaction = transactionsRepo.create({ title, type, value, category: categoryFound, category_id: categoryFound.id })

    await transactionsRepo.save(transaction)

    return transaction
  }
}

export default CreateTransactionService;
