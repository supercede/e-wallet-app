import models from '../models';
import utils from '../helpers/utils';

const { handleSuccess, handleError } = utils;

const { Transaction, Wallet } = models;

export default {
  normalizeAmount: amount => Math.round(amount * 100),
  /**
   * @description Handles transaction logic between the sender and reciever
   *
   * @param {Object} res - The response Object
   * @param {string} recipient - The transfer recipient (MongooseID)
   * @param {Object} source - The logged in user initiating the transfer
   * @param {Number} amount - Amount to be transferred
   * @param {Object} transaction - Object containing transaction details
   *
   * @returns {Object} res - The response Object
   */
  handleSuccessfulTransaction: async (
    res,
    recipient,
    source,
    amount,
    transaction,
  ) => {
    const sourceWallet = await Wallet.findOne({ where: { userId: source.id } });

    const recipientWallet = await Wallet.findOne({ where: { walletNo: recipient } });

    const sourceBalance = sourceWallet.balance - amount;
    const recipientBalance = recipientWallet.balance + amount;

    await sourceWallet.update({ balance: sourceBalance });
    await recipientWallet.update({ balance: recipientBalance });

    transaction.walletId = sourceWallet.id;
    transaction.type = 'debit';
    transaction.status = 'success';
    transaction.walletBalance = sourceWallet.balance;

    const mainTransaction = await Transaction.create(transaction);
    await sourceWallet.addTransaction(mainTransaction);

    const creditTransaction = await Transaction.create({
      ...transaction,
      type: 'credit',
      walletId: recipientWallet.id,
      walletBalance: recipientWallet.balance,
    });

    await recipientWallet.addTransaction(creditTransaction);

    res.status(200).json({
      status: 'success',
      data: {
        transaction: mainTransaction,
      },
    });
  },

  handleInsufficientBalance: async (res, transaction, wallet) => {
    transaction.status = 'failed';
    transaction.walletId = wallet.id;
    transaction.type = 'debit';
    // transaction.errMsg = 'Insufficient funds';
    transaction.walletBalance = wallet.balance;
    const failedTxn = await Transaction.create(transaction);
    // throw new ApplicationError(400, 'Insufficient funds');

    return res.status(400).json({
      status: 'error',
      message: 'Insufficient funds',
      data: {
        transaction: failedTxn,
      },
    });
  },
};
