import { config } from 'dotenv';
import paystack from 'paystack-api';

config();

const paystackService = paystack(process.env.PAYSTACK_SECRET_KEY);

export default {
  initializeTxn: async (email, amount) => {
    try {
      const { data } = await paystackService.transaction.initialize({
        email,
        amount,
      });
      return data;
    } catch (error) {
      console.log('paystack initializeTxn error:', error);
    }
  },

  chargeTxn: async (email, amount, authorization_code, reference = null) => {
    try {
      const { data } = await paystackService.transaction.chargeAuth({
        email,
        amount,
        authorization_code,
        reference,
      });
      return data;
    } catch (error) {
      console.log('paystack chargeTxn error:', error);
    }
  },

  verifyTxn: async reference => {
    try {
      const response = await paystackService.transaction.verify({ reference });
      return response;
    } catch (error) {
      console.log('paystack transactionTxn error:', error);
    }
  },
};
