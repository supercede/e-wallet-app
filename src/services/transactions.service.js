import models from '../models';

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
    const sourceWallet = await Wallet.increment('balance', {
      by: -Math.abs(amount),
      where: { userId: source.id },
    });
    // const sourceWallets = await Wallet.findOneAndUpdate(
    //   { user: source.id },
    //   { $inc: { totalBalance: -Math.abs(amount) } },
    //   { new: true },
    // );
    const recipientWallet = await Wallet.increment('balance', {
      by: amount,
      where: { walletNo: recipient },
    });
    // const recipientWallet = await Wallet.findOneAndUpdate(
    //   { user: recipient },

    //   { $inc: { totalBalance: amount } },
    //   { new: true },
    // );

    transaction.walletId = sourceWallet.id;
    transaction.type = 'debit';
    transaction.status = 'success';

    // const creditTransaction =

    const mainTransaction = await Transaction.create(transaction);
    await sourceWallet.addTransaction(mainTransaction);

    const creditTransaction = await Transaction.create({
      ...transaction,
      type: 'credit',
      walletId: recipientWallet.id,
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
    transaction.reason = 'Insufficient funds';
    await Transaction.create(transaction);
    // throw new ApplicationError(400, 'Insufficient funds');
    return res.status(400).json({
      status: 'error',
      data: {
        transaction,
      },
    });
  },
};
