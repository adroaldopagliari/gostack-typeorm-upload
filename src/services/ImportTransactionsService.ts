import path from 'path';
import csvtojson from 'csvtojson';
import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(csvFilename: string): Promise<Transaction[]> {
    const csvFilePath = path.join(uploadConfig.directory, csvFilename);

    const transactions = await csvtojson().fromFile(csvFilePath);

    const createTransaction = new CreateTransactionService();

    const createdTransactions = await Promise.all(
      transactions.map(async transaction => {
        const createdTransaction = await createTransaction.execute(transaction);
        return createdTransaction;
      }),
    );

    return createdTransactions;
  }
}

export default ImportTransactionsService;
