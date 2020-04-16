import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    try {
      const rawDeleteResult = await transactionsRepository.delete(id);
      if (rawDeleteResult.affected === 0) {
        throw new AppError('Transaction ID not found');
      }
    } catch (err) {
      throw new AppError('Transaction ID invalid');
    }
  }
}

export default DeleteTransactionService;
