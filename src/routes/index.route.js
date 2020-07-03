import { Router } from 'express';
import authRoutes from './auth.route';
import transactionsRoutes from './transaction.route';
import walletRoutes from './wallet.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/transactions', transactionsRoutes);
router.use('/wallet', walletRoutes);

export default router;
