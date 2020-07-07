/* eslint-disable no-undef */

import request from 'supertest';
import { setupDB, tearDownDB, userTwoToken } from '../fixtures/mock';
import app from '../../src/app';

beforeAll(async () => {
  await setupDB();
});

afterAll(async () => {
  await tearDownDB;
  jest.clearAllMocks();
});

describe('wallet routes', () => {
  describe('fund wallet', () => {
    let reference;
    test('should fund wallet', async () => {
      const response = await request(app)
        .post('/api/v1/wallet/fund-wallet')
        .set('Authorization', `Bearer ${userTwoToken}`)
        .send({ amount: 2000.39 });

      reference = response.body.data.reference;

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('url');
    });

    test('should not fund wallet for unauthenticated request', async () => {
      const response = await request(app)
        .post('/api/v1/wallet/fund-wallet')
        .send({ amount: 2000.39 });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });

    test('should verify payment', async () => {
      const response = await request(app).get(
        `/api/v1/wallet/paystack/redirect?reference=${reference}`,
      );

      expect(response.status).toBe(302);
    });
  });

  describe('get user balance', () => {
    test('should get logged in user balance', async () => {
      const response = await request(app)
        .get('/api/v1/wallet')
        .set('Authorization', `Bearer ${userTwoToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('wallet');
    });

    test('should not attend to unauthenticated requests', async () => {
      const response = await request(app).get('/api/v1/wallet');

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });
  });
});
