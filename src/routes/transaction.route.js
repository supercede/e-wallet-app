import { Router } from 'express';
import transactionController from '../controllers/transaction.controller';
import catchAsync from '../helpers/catchAsync';
import authentication from '../middleware/authentication';
import validator from '../middleware/validator';
import transactionValidation from '../validation/transaction.validation';

const { authenticate } = authentication;
const { transferFund } = transactionController;
const { transferFundsSchema } = transactionValidation;

const transactionsRouter = Router();

transactionsRouter.use(authenticate);
transactionsRouter.post(
  '/transfer',
  validator(transferFundsSchema),
  catchAsync(transferFund),
);

export default transactionsRouter;
