import models from '../models';
import { ApplicationError, NotFoundError } from '../helpers/errors';
import utils from '../helpers/utils';
import transactionsService from '../services/transactions.service';

const { handleSuccess } = utils;

const {
  handleInsufficientBalance,
  handleSuccessfulTransaction,
  normalizeAmount,
} = transactionsService;

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
    const { id } = req.user;

    amount = normalizeAmount(amount);
    const wallet = await req.user.getWallet();

    if (wallet.walletNo === recipient) {
      throw new ApplicationError(400, 'You cannot transfer to yourself');
    }

    const recipientWallet = await Wallet.findOne({
      where: { walletNo: recipient },
    });

    if (!recipientWallet)
      throw new NotFoundError('User not found, please review your transaction');

    transaction.source = wallet.walletNo;
    transaction.recipient = recipient;
    transaction.amount = amount;
    transaction.narration = narration;

    const verifyBalance = wallet.verifyBalance(amount);

    if (!verifyBalance) {
      return handleInsufficientBalance(res, transaction, wallet);
    }

    await handleSuccessfulTransaction(
      res,
      recipient,
      req.user,
      amount,
      transaction,
      wallet,
      recipientWallet,
    );
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
    const { page = 1, limit = 10, sort, type, status } = req.query;

    const wallet = await req.user.getWallet();

    const query = { where: { walletId: wallet.id }, order: [] };

    if (type) {
      query.where.type = type;
    }

    if (status) {
      query.where.status = status;
    }

    if (sort) {
      if (sort === 'date') {
        query.order.push(['createdAt', 'ASC']);
      }
      if (sort === 'amount') {
        query.order.push(['amount', 'ASC']);
      }
    }

    query.limit = +limit;
    query.offset = +((page - 1) * limit);

    const transactions = await Transaction.findAndCountAll(query);

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

    handleSuccess(req, res, 200, transaction);
  },
};
