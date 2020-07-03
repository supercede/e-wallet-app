import { check } from 'express-validator';

export default {
  transferFundsSchema: [
    check('recipient')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Recipient wallet number is required'),

    check('amount')
      .not()
      .isEmpty()
      .withMessage('Transaction amount required')
      .isNumeric()
      .withMessage('Amount must be a number')
      .custom(value => {
        if (value <= 50) {
          throw new Error('Transaction amount must be at least 50 naira');
        }
        return value;
      }),

    check('narration')
      .not()
      .isEmpty()
      .withMessage('Narration required'),
  ],
};
