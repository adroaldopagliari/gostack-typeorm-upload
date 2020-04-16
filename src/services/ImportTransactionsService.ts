// import Transaction from '../models/Transaction';

interface Request {
  csvFile: string;
}

class ImportTransactionsService {
  async execute({ csvFile }: Request): Promise<void> {
    // Promise<Transaction[]> {
    // TODO
    console.log(csvFile);
  }
}

export default ImportTransactionsService;
