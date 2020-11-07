// import AppError from '../errors/AppError';

import { getCustomRepository } from "typeorm";
import AppError from "../errors/AppError";
import TransactionsRepository from "../repositories/TransactionsRepository";

interface Request {
  id: string
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepo = getCustomRepository(TransactionsRepository)

    const transactionFound = await transactionsRepo.findOne(id)

    if (!transactionFound) {
      throw new AppError('Category not found', 404)
    }

    await transactionsRepo.delete(id)

    return

  }
}

export default DeleteTransactionService;
