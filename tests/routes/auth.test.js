/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../src/app';
import models from '../../src/models';
import {
  user,
  userTwo,
  incompleteUser,
  conflictPasswords,
  changePassword,
  setupDB,
  tearDownDB,
  userTwoToken,
} from '../fixtures/mock';

beforeAll(async () => {
  await setupDB();
});

afterAll(async () => {
  await tearDownDB();
});

const { User, Wallet } = models;

describe('User Authentication', () => {
  describe('signup route', () => {
    test('should sign a user up', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(user);

      const newUser = await User.findByPk(response.body.data.user.id);
      expect(newUser).not.toBeNull();
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
    });

    test('Should not accept duplicate user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(user);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
    });

    test('Should not sign a user up if passwords do not match', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(conflictPasswords);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message', 'validation error');
    });

    test('Should not accept incomplete user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(incompleteUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message', 'validation error');
    });
  });

  describe('sign in route', () => {
    test('Should log a user in with email and password', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: user.email,
        password: user.password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
    });

    test('Should not log a user in with incorrect credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: user.email, password: 'somepasss1234' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty(
        'message',
        'email or password is incorrect',
      );
    });
  });

  describe('change password', () => {
    test('should not reset user password if unauthenticated', async () => {
      const response = await request(app)
        .patch('/api/v1/auth/change-password')
        .send(changePassword);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('should reset user password if right password is provided and user is authenticated', async () => {
      changePassword.currentPassword = userTwo.password;
      const response = await request(app)
        .patch('/api/v1/auth/change-password')
        .send(changePassword)
        .set('Authorization', `Bearer ${userTwoToken}`);

      expect(response.body.status).toBe('success');
      expect(response.body).toHaveProperty('token');
    });

    test('should not authenticate user in if old token is used after password change', async () => {
      changePassword.currentPassword = userTwo.password;
      const response = await request(app)
        .patch('/api/v1/auth/change-password')
        .send(changePassword)
        .set('Authorization', `Bearer ${userTwoToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
});
