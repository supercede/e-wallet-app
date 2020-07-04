import { ApplicationError, NotFoundError } from '../../src/helpers/errors';

describe('Errors helper class', () => {
  describe('Base Application Error', () => {
    test('should set status code as 500 if error code is not defined', async () => {
      const error = new ApplicationError();
      expect(error).toHaveProperty('statusCode');
      expect(error.statusCode).toBe(500);
    });

    test('should set statusCode to defined code', async () => {
      const error = new ApplicationError(404);
      expect(error).toHaveProperty('statusCode');
      expect(error.statusCode).toBe(404);
    });

    test('should set error message', async () => {
      const error = new ApplicationError(404, 'resource not found');

      expect(error).toHaveProperty('message');
      expect(error.message).toBe('resource not found');
    });
  });

  describe('NotFoundError class', () => {
    test('set statusCode as 404 when class is instatiated', async () => {
      const error = new NotFoundError();

      expect(error).toHaveProperty('statusCode');
      expect(error.statusCode).toBe(404);
    });
  });
});
