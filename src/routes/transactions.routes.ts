import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import multerConfig from '../config/upload';
import Transaction from '../models/Transaction';

const transactionsRouter = Router();
const upload = multer(multerConfig);

transactionsRouter.get('/', async (request, response) => {
  // TODO
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();

  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  const { title, value, type, category } = request.body;

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

  const transactionsRepository = getCustomRepository(TransactionsRepository);

  await transactionsRepository.delete(id);

  // const deleteTransactionService = new DeleteTransactionService();

  // deleteTransactionService.execute(id);

  return response.status(201).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    // TODO
    const { filename } = request.file;
    const importTransactionService = new ImportTransactionsService();

    const transactions = await importTransactionService.execute({ filename });

    return response.json(transactions);
  },
);

export default transactionsRouter;
