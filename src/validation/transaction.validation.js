import { check } from 'express-validator';

export default {
  transferFundsSchema: [
    check('recipient')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Recipient ID is required'),

    check('amount')
      .not()
      .isEmpty()
      .withMessage('Transaction amount required')
      .isNumeric()
      .withMessage('Amount must be a number'),

    check('narration')
      .not()
      .isEmpty()
      .withMessage('Narration amount required'),
  ],
};
