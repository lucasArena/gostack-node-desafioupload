import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO

    const transactions = await this.find();

    const balance = transactions.reduce(
      (totalBalance, current): Balance => {
        return {
          income:
            current.type === 'income'
              ? totalBalance.income + current.value
              : totalBalance.income,
          outcome:
            current.type === 'outcome'
              ? totalBalance.outcome + current.value
              : totalBalance.outcome,
          total:
            current.type === 'income'
              ? totalBalance.total + current.value
              : totalBalance.total - current.value,
        };
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return balance;
  }
}

export default TransactionsRepository;
