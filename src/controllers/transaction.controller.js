import models from '../models';
import { ApplicationError, NotFoundError } from '../helpers/errors';
import transactionsService from '../services/transactions.service';
import utils from '../helpers/utils';

const {
  handleInsufficientBalance,
  handleSuccessfulTransaction,
} = transactionsService;

const { paginate, normalizeAmount } = utils;

const { Wallet, Transaction } = models;

export default {
  /**
   * @description Initiate a transfer
   *
   * @param {Object} req - The request Object
   * @param {Object} res - The response Object
   *
   * @returns {Object} res - The response Object
   */
  transferFund: async (req, res) => {
    const transaction = {};
    const { recipient, narration } = req.body;
    let { amount } = req.body;

    amount = normalizeAmount(amount);
    const wallet = await req.user.getWallet();

    if (wallet.walletNo === recipient) {
      throw new ApplicationError(400, 'You cannot transfer to yourself');
    }

    const recipientWallet = await Wallet.findOne({
      where: { walletNo: recipient },
    });

    if (!recipientWallet) {
      throw new NotFoundError('User not found, please review your transaction');
    }

    transaction.source = wallet.walletNo;
    transaction.recipient = recipient;
    transaction.amount = amount;
    transaction.narration = narration;

    const verifyBalance = wallet.verifyBalance(amount);

    if (!verifyBalance) {
      const failedTxn = handleInsufficientBalance(res, transaction, wallet);
      return res.status(400).json({
        status: 'error',
        message: 'Insufficient funds',
        data: {
          transaction: failedTxn,
        },
      });
    }

    const newTransaction = await handleSuccessfulTransaction(
      res,
      recipient,
      req.user,
      amount,
      transaction,
      wallet,
      recipientWallet,
    );

    res.status(200).json({
      status: 'success',
      data: {
        transaction: newTransaction,
      },
    });
  },

  /**
   * @description Get a user's transactions
   *
   * @param {Object} req - The request Object
   * @param {Object} res - The response Object
   *
   * @returns {Object} res - The response Object
   */
  getUserTransactions: async (req, res) => {
    const {
      page = 1,
      limit = 10,
      sort,
      type,
      status,
    } = req.query;

    const wallet = await req.user.getWallet();

    const query = { where: { walletId: wallet.id }, order: [] };

    const queryOptions = {
      type,
      status,
      sort,
      limit,
      page,
    };

    const transactions = await paginate(Transaction, query, queryOptions);

    return res.status(200).json({
      status: 'success',
      data: {
        transactions: transactions.rows,
      },
      count: transactions.count,
      page: +page,
      limit: +limit,
    });
  },

  /**
   * @description Get a single transaction
   *
   * @param {Object} req - The request Object
   * @param {Object} res - The response Object
   *
   * @returns {Object} res - The response Object
   */
  getOneTransaction: async (req, res) => {
    const { id } = req.params;

    const wallet = await req.user.getWallet();

    const transaction = await Transaction.findOne({
      where: {
        walletId: wallet.id,
        id,
      },
    });

    if (!transaction) throw new NotFoundError('Transaction not found');

    return res.status(200).json({
      status: 'success',
      data: {
        transaction,
      },
    });
  },
};
