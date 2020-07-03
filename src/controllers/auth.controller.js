import utils from '../helpers/utils';
import models from '../models';
import { ApplicationError } from '../helpers/errors';

const { handleAuthSuccess } = utils;
const { User, Wallet } = models;

/**
 * @function createCookieAndToken
 * @description Creates token and cookie after user has been authenticated
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 *
 * @returns {Object} - The response object
 */
const createCookieAndToken = (user, statusCode, req, res) => {
  const token = user.generateAccessToken();

  const cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  const data = {};
  data.user = user;

  res.cookie('w6099912302832', token, cookieOptions);

  handleAuthSuccess(res, statusCode, token, data);
};

export default {
  /**
   * @function signup
   * @description handles user signup
   *
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   *
   * @returns {Function} creates a cookie from the response
   */
  signup: async (req, res) => {
    const { name, password, email } = req.body;

    const checkUser = await User.getExistingUser(email);

    if (checkUser) {
      throw new ApplicationError(409, 'Email exists, please try another');
    }

    const user = await User.create({
      name,
      password,
      email,
    });

    const walletNo = Math.floor(Date.now() + Math.random() * 4);

    const wallet = await Wallet.create({
      walletNo,
    });

    await user.setWallet(wallet);

    createCookieAndToken(user, 201, req, res);
  },

  /**
   * @function login
   * @description handles user login
   *
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   *
   * @returns {Function} creates a cookie from the response
   */
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({
      include: [
        {
          model: Wallet,
        },
      ],
      where: { email },
    });

    if (!user) {
      throw new ApplicationError(401, 'email or password is incorrect');
    }

    const checkPassword = user.validatePassword(password);
    if (!checkPassword) {
      throw new ApplicationError(401, 'email or password is incorrect');
    }

    createCookieAndToken(user, 200, req, res);
  },

  /**
   * @function changePassword
   * @description handles logged in user password update
   *
   * @param {Object} req - the request object
   * @param {Object} resp - the response object
   *
   * @returns {Function} creates a cookie from the response
   */

  changePassword: async (req, res, next) => {
    const { id } = req.user;
    const { currentPassword, password } = req.body;

    const user = await User.findByPk(id);

    const checkPassword = user.validatePassword(currentPassword);

    if (!checkPassword) {
      throw new ApplicationError(401, 'Incorrect Password');
    }

    const checkNewPassword = user.validatePassword(password);

    if (checkNewPassword) {
      throw new ApplicationError(
        400,
        'New Password cannot be the same as the old one',
      );
    }

    await user.update({ password });

    // Log user in, send JWT
    createCookieAndToken(user, 200, req, res);
  },
};
