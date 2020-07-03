import { Router } from 'express';
import authRoutes from './auth.route';
import transactionsRoutes from './transaction.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/transactions', transactionsRoutes);

export default router;
