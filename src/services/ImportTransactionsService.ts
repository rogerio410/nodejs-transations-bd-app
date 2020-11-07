import Transaction from '../models/Transaction';
import path from 'path'
import fs from 'fs'
import csvParse from 'csv-parse'
import uploadConfig from '../config/upload'
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(): Promise<Transaction[]> {

    const csvFilePath = path.resolve(uploadConfig.directory, 'transactions.csv')

    const lines = await loadCSV(csvFilePath)

    const createdTransactions: Array<Transaction> = []

    const createTransactionService = new CreateTransactionService()

    for (const line of lines) {
      const [title, type, value, category] = line
      const createdTransaction = await createTransactionService.execute({
        title, value, type, category
      })
      createdTransactions.push(createdTransaction)
    }

    // Erase file
    const transactionsFileExists = await fs.promises.stat(csvFilePath)

    if (transactionsFileExists) {
      await fs.promises.unlink(csvFilePath)
    }

    return createdTransactions
  }
}

async function loadCSV(csvFilePath: string): Promise<any[]> {

  const readCSVStream = fs.createReadStream(csvFilePath)

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true
  })

  const parseCSV = readCSVStream.pipe(parseStream)

  let lines: any[] = []

  parseCSV.on('data', async line => {
    lines.push(line)
  })

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return lines

}

export default ImportTransactionsService;
