import { Router } from 'express';
import authController from '../controllers/auth.controller';
import catchAsync from '../helpers/catchAsync';
import { validationResult } from 'express-validator';
import authentication from '../middleware/authentication';
import authValidation from '../validation/auth.validation';
import validator from '../middleware/validator';

const { authenticate } = authentication;
const { userLogInSchema, userSignUpSchema } = authValidation;

const { signup, login } = authController;

const authRouter = Router();

authRouter.post('/signup', validator(userSignUpSchema), catchAsync(signup));
authRouter.post('/login', validator(userLogInSchema), catchAsync(login));

export default authRouter;
