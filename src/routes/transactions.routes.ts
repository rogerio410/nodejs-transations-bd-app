import { Router } from 'express'
import { getCustomRepository } from 'typeorm'

import multer from 'multer'
import TransactionsRepository from '../repositories/TransactionsRepository'
import CreateTransactionService from '../services/CreateTransactionService'
import DeleteTransactionService from '../services/DeleteTransactionService'
import ImportTransactionsService from '../services/ImportTransactionsService'

import uploadConfig from '../config/upload'

const transactionsRouter = Router()

const uploadMiddleware = multer(uploadConfig)

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepo = getCustomRepository(TransactionsRepository)

  const transactions = await transactionsRepo.find()

  const balance = await transactionsRepo.getBalance()
  return response.json({ transactions, balance })
})

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body
  const createTransactionService = new CreateTransactionService()
  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category,
  })

  return response.json(transaction)
})

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  const deleteTransactionService = new DeleteTransactionService()
  await deleteTransactionService.execute({ id })

  return response.status(204).send()
})

transactionsRouter.post(
  '/import',
  uploadMiddleware.single('file'),
  async (request, response) => {
    const importTransactionsService = new ImportTransactionsService()
    const createdCategories = await importTransactionsService.execute()

    return response.json(createdCategories)
  },
)

export default transactionsRouter
