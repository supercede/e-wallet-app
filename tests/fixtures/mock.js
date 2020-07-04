import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import models from '../../src/models';

const { User, Wallet } = models;

export const user = {
  id: uuidv4(),
  name: 'John Thomas',
  email: 'me@mail.com',
  password: '1234567890',
  passwordConfirm: '1234567890',
};

export const userTwo = {
  name: 'Akan Michael',
  email: 'me@othermail.io',
  password: '123456789',
  passwordConfirm: '1234567890',
};

const userBuild = User.build(userTwo);

export const userTwoToken = userBuild.generateAccessToken();

export const incompleteUser = {
  name: 'Dan James',
  password: '273939939',
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

export const setupDB = async () => {
  await Wallet.destroy({
    where: {},
  });
  await User.destroy({
    where: {},
  });
  await userBuild.save();
};

export const tearDownDB = async () => {
  await Wallet.destroy({
    where: {},
  });
  await User.destroy({
    where: {},
  });
};
