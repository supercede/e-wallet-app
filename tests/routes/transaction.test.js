/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../src/app';
import models from '../../src/models';
import {
  setupDB,
  tearDownDB,
  transaction,
  userTwoToken,
  userTwo,
  userThreeToken,
  userThree,
  walletTwo,
} from '../fixtures/mock';

const { Wallet } = models;

const userWallet = async () => Wallet.findOne({ where: { userId: userTwo.id } });

let transactionId;

beforeAll(async () => {
  await setupDB();
});

afterAll(async () => {
  await tearDownDB();
});

describe('transactions test', () => {
  describe('transfer money', () => {
    test('should not transfer funds if request is not authenticated', async () => {
      const wallet = await userWallet();
      transaction.recipient = wallet.walletNo;
      const response = await request(app)
        .post('/api/v1/transactions/transfer')
        .send(transaction);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('should not create transaction if recipient id is the same as logged in user', async () => {
      const response = await request(app)
        .post('/api/v1/transactions/transfer')
        .set('Authorization', `Bearer ${userTwoToken}`)
        .send(transaction);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message).toEqual(
        'You cannot transfer to yourself',
      );
    });

    test('should throw insufficient funds error if user balance is less than transaction amount', async () => {
      const response = await request(app)
        .post('/api/v1/transactions/transfer')
        .set('Authorization', `Bearer ${userThreeToken}`)
        .send(transaction);

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual('Insufficient funds');
      expect(response.body.data).toHaveProperty('transaction');
    });

    test('should transfer funds to another wallet if details match and user is signed in', async () => {
      const senderWallet = await Wallet.findOne({
        where: { userId: userTwo.id },
      });
      const receiverWallet = await Wallet.findOne({
        where: { userId: userThree.id },
      });

      transaction.recipient = receiverWallet.walletNo;
      const response = await request(app)
        .post('/api/v1/transactions/transfer')
        .set('Authorization', `Bearer ${userTwoToken}`)
        .send(transaction);

      const newSenderWallet = await Wallet.findOne({
        where: { userId: userTwo.id },
      });
      const newReceiverWallet = await Wallet.findOne({
        where: { userId: userThree.id },
      });

      transactionId = response.body.data.transaction.id;

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('transaction');
      expect(response.body.data.transaction.recipient).toEqual(
        transaction.recipient,
      );
      expect(newSenderWallet.balance).toEqual(senderWallet.balance - 35000);
      expect(newReceiverWallet.balance).toEqual(receiverWallet.balance + 35000);
    });
  });

  describe('get user transactions', () => {
    test('should not get transactions if a user is not logged in', async () => {
      const response = await request(app).get('/api/v1/transactions/history');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test("should get a user's transactions", async () => {
      const response = await request(app)
        .get('/api/v1/transactions/history')
        .set('Authorization', `Bearer ${userTwoToken}`);

      const userWalletId = response.body.data.transactions.every(
        txn => txn.walletId === walletTwo.id,
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('transactions');
      expect(userWalletId).toBe(true);
    });

    test("should get a user's successful transactions", async () => {
      const response = await request(app)
        .get('/api/v1/transactions/history?status=success')
        .set('Authorization', `Bearer ${userTwoToken}`);

      const successfulTransactions = response.body.data.transactions;

      const checkSuccess = successfulTransactions.every(
        entrant => entrant.status === 'success',
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('transactions');
      expect(checkSuccess).toBe(true);
    });

    test("should get a user's failed transactions", async () => {
      const response = await request(app)
        .get('/api/v1/transactions/history?status=failed')
        .set('Authorization', `Bearer ${userThreeToken}`);

      const failedTransactions = response.body.data.transactions;

      const checkfails = failedTransactions.every(
        entrant => entrant.status === 'failed',
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('transactions');
      expect(checkfails).toBe(true);
    });

    test('should get a transaction', async () => {
      const response = await request(app)
        .get(`/api/v1/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${userTwoToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('transaction');
      expect(response.body.data.transaction.id).toEqual(transactionId);
    });

    test('should throw an error if transaction is not foun', async () => {
      const response = await request(app)
        .get(`/api/v1/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${userThreeToken}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });
  });
});
