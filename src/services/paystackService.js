/* eslint-disable no-console, camelcase */
import { config } from 'dotenv';
import paystack from 'paystack-api';

config();

const paystackService = paystack(process.env.PAYSTACK_SECRET_KEY);

export default {
  /**
   * @description Initializes paystack transaction
   *
   * @param {String} email the payer's email
   * @param {Number} amount the amount to be paid
   * @returns {Object} authorization mail and reference
   */
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

  /**
   * @description handles charging of paystack transaction
   *
   * @param {String} email payer's email
   * @param {Number} amount amount to be paid
   * @param {String} authorization_code transaction auth code
   * @param {String} [reference=null] transaction reference
   * @returns {Object}
   */
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

  /**
   * @description verifies Paystack transaction
   *
   * @param {*} reference
   * @returns {Object} payment status and details
   */
  verifyTxn: async reference => {
    try {
      const response = await paystackService.transaction.verify({ reference });
      return response;
    } catch (error) {
      console.log('paystack transactionTxn error:', error);
    }
  },
};
