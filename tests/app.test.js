/* eslint-disable no-undef */
import request from 'supertest';
import app from '../src/app';

describe('App Setup', () => {
  test('app should be a function', () => {
    expect(app).toEqual(expect.any(Function));
  });

  it('should return success on home route request', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
  });

  test('error if an invalid route is requested', async () => {
    const response = await request(app).get('/invalid');

    expect(response.status).toBe(404);
    expect(response.body.status).toBe('error');
    expect(response.body.error).toBe('resource not found on this server');
  });
});
