import { Router } from 'express';
import transactionController from '../controllers/transaction.controller';
import catchAsync from '../helpers/catchAsync';
import authentication from '../middleware/authentication';
import validator from '../middleware/validator';

const { authenticate } = authentication;
const { transferFund } = transactionController;

const transactionsRouter = Router();

transactionsRouter.use(authenticate);
transactionsRouter.post('/transfer', catchAsync(transferFund));

export default transactionsRouter;
