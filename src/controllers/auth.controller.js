import utils from '../helpers/utils';
import models from '../models';

const { handleAuthSuccess } = utils;
const { User, Wallet } = models;

const createCookieAndToken = (user, statusCode, req, res) => {
  const token = user.generateAccessToken();

  const cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  const data = {};
  data.user = user;

  res.cookie('authjwt', token, cookieOptions);

  handleAuthSuccess(req, res, statusCode, token, data);
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

    const user = new User({
      name,
      password,
      email,
    });

    const walletNo = Math.floor(Date.now() + Math.random() * 4);
    const Wallet = new Wallet({
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
    let user = await User.getExistingUser(email);

    if (!user) {
      throw new ApplicationError(401, 'email or password is incorrect');
    }

    user = user.getSafeDataValues();

    createCookieAndToken(user, 200, req, res);
  },
};
