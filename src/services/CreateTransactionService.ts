// import AppError from '../errors/AppError';

import { getRepository, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface TransactionProps {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute(
    transactionData: TransactionProps,
  ): Promise<Transaction> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const { title, type, value, category } = transactionData;

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && balance.total - value < 0) {
      throw new AppError('Not enough money', 400);
    }

    const categoryExists = await categoriesRepository.findOne({
      title: category,
    });

    if (!categoryExists) {
      const newCategory = categoriesRepository.create({ title: category });
      await categoriesRepository.save(newCategory);

      const transaction = transactionsRepository.create({
        title,
        type,
        value,
        category_id: newCategory.id,
      });

      await transactionsRepository.save(transaction);
      return transaction;
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: categoryExists.id,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
