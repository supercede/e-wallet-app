/* eslint-disable prefer-destructuring */
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import catchAsync from '../helpers/catchAsync';
import models from '../models';
import { ApplicationError } from '../helpers/errors';

const { User } = models;

export default {
  authenticate: catchAsync(async (req, res, next) => {
    let token;
    //  Check if token is in header
    if (
      req.headers.authorization
      && req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.w6099912302832) {
      // else check if it is in a cookie
      token = req.cookies.w6099912302832;
    }
    if (!token) {
      return next(
        new ApplicationError(401, 'You need to login to access this resource'),
      );
    }

    // Verify Token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user exists
    const currentUser = await User.findByPk(decoded.id);

    if (!currentUser) {
      return next(new ApplicationError(401, 'Invalid Token'));
    }

    // Check if user password is unchanged
    if (currentUser.checkLastPasswordChange(decoded.iat)) {
      return next(new ApplicationError(401, 'Please Log in Again'));
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  }),
};
