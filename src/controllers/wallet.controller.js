import paystackService from '../services/paystack';
import { ApplicationError, NotFoundError } from '../helpers/errors';
import models from '../models';
import transactionsService from '../services/transactions.service';

const { normalizeAmount } = transactionsService;

const { User, Wallet, Transaction } = models;

export default {
  fundWallet: async (req, res) => {
    const { email } = req.user;
    let { amount } = req.body;

    const wallet = await req.user.getWallet();

    amount = normalizeAmount(amount);

    const transaction = {
      amount,
      walletId: wallet.id,
      status: 'pending',
      type: 'credit',
      narration: 'Fund Wallet',
      recipient: wallet.walletNo,
      walletBalance: wallet.balance,
    };

    const {
      authorization_url,
      reference,
    } = await paystackService.initializeTxn(email, amount);

    transaction.txnReference = reference;

    await Transaction.create(transaction);

    return res.status(200).json({
      url: authorization_url,
    });
  },

  verifyFunding: async (req, res) => {
    const { reference } = req.query;

    const transaction = await Transaction.findOne({
      where: { txnReference: reference },
    });

    if (!transaction) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid transaction Reference.',
      });
    }

    const result = await paystackService.verifyTxn(reference);

    if (result.data.status === 'failed' || !result.status) {
      transaction.paymentStatus = 'failed';
      transaction.status = 'canceled';

      let errorMsg;

      if (result.data) {
        errorMsg = result.data.gateway_response;
      } else {
        errorMsg = result.message;
      }

      return res.status(400).json({
        status: 'error',
        message: errorMsg,
      });
    }

    const wallet = await Wallet.findByPk(transaction.walletId);

    wallet.balance += result.data.amount;

    transaction.status = 'success';
    transaction.walletBalance = wallet.balance;

    await transaction.save();
    await wallet.save();

    return res.status(200).json({
      status: 'success',
      message: 'payment successful',
      data: {
        transaction,
        // result,
      },
    });
  },
};
