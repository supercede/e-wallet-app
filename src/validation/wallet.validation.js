import { check } from 'express-validator';

export default {
  fundWalletSchema: [
    check('amount')
      .not()
      .isEmpty()
      .withMessage('Transaction amount required')
      .isNumeric()
      .withMessage('Amount must be a number')
      .matches(/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/)
      .withMessage('Amount should be limited to 2 decimal places')
      .custom(value => {
        if (value <= 49) {
          throw new Error('Transaction amount must be at least 50 naira');
        }
        return value;
      }),
  ],
};
