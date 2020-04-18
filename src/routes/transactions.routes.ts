import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import UploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';

import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import AppError from '../errors/AppError';

const transactionsRouter = Router();
const upload = multer(UploadConfig);

transactionsRouter.get('/', async (request, response) => {
  // TODO
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactionsFields = await transactionsRepository.find({
    relations: ['category'],
    select: ['id', 'title', 'value', 'type'],
  });

  const transactions = transactionsFields.map(t => ({
    id: t.id,
    title: t.title,
    value: t.value,
    type: t.type,
    category: t.category.title,
  }));

  const balance = await transactionsRepository.getBalance();
  const transactionsSummary = { transactions, balance };

  return response.json(transactionsSummary);
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  const { title, value, type, category } = request.body;

  if (type === 'outcome') {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transactionsBalance = await transactionsRepository.getBalance();

    if (transactionsBalance.total < value) {
      throw new AppError('Outcome value exceeds the total cash');
    }
  }

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute({ id });

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    // TODO
    const importTransaction = new ImportTransactionsService();

    const transactions = await importTransaction.execute(request.file.filename);

    return response.json(transactions);
  },
);

export default transactionsRouter;
