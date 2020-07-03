import { Router } from 'express';
import walletController from '../controllers/wallet.controller';
import catchAsync from '../helpers/catchAsync';
import authentication from '../middleware/authentication';
import validator from '../middleware/validator';
import walletValidation from '../validation/wallet.validation';

const { authenticate } = authentication;
const { fundWalletSchema } = walletValidation;

const walletRouter = Router();
const { fundWallet, verifyFunding } = walletController;

walletRouter.post(
  '/fund-wallet',
  authenticate,
  validator(fundWalletSchema),
  catchAsync(fundWallet),
);
walletRouter.get('/paystack/redirect', verifyFunding);

export default walletRouter;
