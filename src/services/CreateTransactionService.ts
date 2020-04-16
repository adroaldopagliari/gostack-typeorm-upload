import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

import CreateCategoryService from './CreateCategoryService';

import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    if (type === 'outcome') {
      const transactionsBalance = await transactionsRepository.getBalance();

      if (transactionsBalance.total < value) {
        throw new AppError('Outcome value exceeds the total cash');
      }
    }

    // verificação da categoria informada
    const createCategory = new CreateCategoryService();
    const { id: category_id } = await createCategory.execute({
      title: category,
    });

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
