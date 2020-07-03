import { check } from 'express-validator';

export default {
  fundWalletSchema: [
    check('amount')
      .not()
      .isEmpty()
      .withMessage('Transaction amount required')
      .isNumeric()
      .withMessage('Amount must be a number')
      .custom(value => {
        if (value <= 49) {
          throw new Error('Transaction amount must be at least 50 naira');
        }
        return value;
      }),
  ],
};
