import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import models from '../../src/models';

const { User, Wallet, Transaction } = models;

export const user = {
  id: uuidv4(),
  name: 'John Thomas',
  email: 'me@mail.com',
  password: '1234567890',
  passwordConfirm: '1234567890',
};

export const userTwo = {
  id: uuidv4(),
  name: 'Akan Michael',
  email: 'me@othermail.io',
  password: '123456789',
  passwordConfirm: '1234567890',
};

export const userThree = {
  id: uuidv4(),
  name: 'Alan Shearr',
  email: 'alan@thebug.io',
  password: '123456789',
  passwordConfirm: '1234567890',
};

const userBuild = User.build(userTwo);
const userThreeBuild = User.build(userThree);

export const userThreeToken = userThreeBuild.generateAccessToken();
export const userTwoToken = userBuild.generateAccessToken();

export const incompleteUser = {
  name: 'Dan James',
  password: '273939939',
};

const walletThree = {
  id: uuidv4(),
  userId: userThree.id,
  balance: 0,
  walletNo: Math.round(Date.now() + Math.random() * 100),
};

export const walletTwo = {
  id: uuidv4(),
  userId: userTwo.id,
  balance: 900000,
  walletNo: Math.round(Date.now() + Math.random() * 100),
};

export const conflictPasswords = {
  name: 'Emenalo F',
  email: 'me@othermail.io',
  password: '123456789',
  passwordConfirm: '1234567899',
};

export const changePassword = {
  currentPassword: 'powermighty',
  password: 'floridamans',
  passwordConfirm: 'floridamans',
};

export const transaction = {
  amount: 350,
  recipient: walletTwo.walletNo,
  narration: 'Buy Bread',
};

export const payStackReturnData = {
  id: 732922450,
  domain: 'test',
  status: 'success',
  reference: 'u9jlg3knjg',
  amount: 200039,
  message: null,
  gateway_response: 'Successful',
  paid_at: '2020-07-04T15:54:55.000Z',
  created_at: '2020-07-04T15:52:04.000Z',
  channel: 'card',
  currency: 'NGN',
  ip_address: '197.210.47.190',
};

export const setupDB = async () => {
  await Transaction.destroy({
    where: {},
  });
  await Wallet.destroy({
    where: {},
  });
  await User.destroy({
    where: {},
  });
  await userBuild.save();
  await userThreeBuild.save();
  await Wallet.create(walletThree);
  await Wallet.create(walletTwo);
};

export const tearDownDB = async () => {
  await Transaction.destroy({
    where: {},
  });
  await Wallet.destroy({
    where: {},
  });
  await User.destroy({
    where: {},
  });
  models.sequelize.close();
};
