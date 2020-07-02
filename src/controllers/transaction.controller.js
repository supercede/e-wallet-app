import models from '../models';
import { ApplicationError, NotFoundError } from '../helpers/errors';
import utils from '../helpers/utils';
import transactionsService from '../services/transactions.service';

const {handleInsufficientBalance,
  handleSuccessfulTransaction,
  normalizeAmount,
} = transactionsService;

const { handleAuthSuccess } = utils;
const { Wallet } = models;

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
      throw new ApplicationError(
        400,
        'You cannot transfer to yourself',
      );
    }

    const checkRecipient = await Wallet.findOne({
      where: { walletNo: recipient },
    });

    if (!checkRecipient) throw new NotFoundError('User not found, please review your transaction');

    transaction.source = id;
    transaction.recipient = recipient;
    transaction.amount = amount;
    transaction.narration = narration;

    const verifyBalance = wallet.verifyAvailableBalance(amount);

    if (!verifyBalance) {
      return handleInsufficientBalance(res, transaction, wallet);
    }

    await handleSuccessfulTransaction(res, recipient, req.user, amount, transaction);

    return res.send(wallet);

    // await updateTransactions(res, recipient, req.user, amount, transaction);
  },
};
