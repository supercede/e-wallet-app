import { Router } from 'express';
import authController from '../controllers/auth.controller';
import catchAsync from '../helpers/catchAsync';
import authentication from '../middleware/authentication';
import authValidation from '../validation/auth.validation';
import validator from '../middleware/validator';

const { authenticate } = authentication;
const { userLogInSchema, userSignUpSchema, changePasswordSchema } = authValidation;

const {
  signup,
  login,
  changePassword,
  logout,
} = authController;

const authRouter = Router();

authRouter.post('/signup', validator(userSignUpSchema), catchAsync(signup));
authRouter.post('/login', validator(userLogInSchema), catchAsync(login));
authRouter.patch('/change-password', authenticate, validator(changePasswordSchema), catchAsync(changePassword));
authRouter.post('/logout', catchAsync(logout));

export default authRouter;
