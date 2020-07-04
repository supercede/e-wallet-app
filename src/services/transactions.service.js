import models from '../models';

const { Transaction } = models;

export default {
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
    sourceWallet,
    recipientWallet,
  ) => {
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
    return mainTransaction;
  },

  handleInsufficientBalance: async (res, transaction, wallet) => {
    transaction.status = 'failed';
    transaction.walletId = wallet.id;
    transaction.type = 'debit';
    transaction.errMsg = 'Insufficient funds';
    transaction.walletBalance = wallet.balance;
    const failedTxn = await Transaction.create(transaction);
    // throw new ApplicationError(400, 'Insufficient funds');

    return failedTxn;
  },
};
