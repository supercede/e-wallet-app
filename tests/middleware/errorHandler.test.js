import { ApplicationError } from '../../src/helpers/errors';
import errorHandler from '../../src/middleware/errorHandler';

describe('Error handler middleware', () => {
  let request,
    response,
    next,
    nextCall = 0;
  const error = new Error('Error');

  beforeEach(() => {
    response = {
      status(code) {
        response.statusCode = code;
        return response;
      },
      json(data) {
        response.body = data;
      },
    };
    request = {};
    next = () => {
      nextCall += 1;
    };
  });

  it('should return 500 error statusCode for base error', async () => {
    errorHandler(error, request, response, next);

    expect(response.statusCode).toBe(500);
  });

  it('should not return error stack trace when in production env', async () => {
    process.env.NODE_ENV = 'production';
    error.statusCode = 403;

    errorHandler(error, request, response, next);
    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('error');
    expect(response.body.error.message).toBe('Error');
    expect(response.body.error).not.toHaveProperty('trace');
  });

  it('should return error stack trace when in development env', async () => {
    process.env.NODE_ENV = 'development';
    error.statusCode = 400;

    errorHandler(error, request, response, next);
    expect(response.body.status).toBe('error');
    expect(response.body.error.message).toBe('Error');
    expect(response.body.error).toHaveProperty('trace');
  });

  it('should call next() when response headers have been sent', async () => {
    response.headersSent = true;

    errorHandler(error, request, response, next);
    expect(nextCall).toBe(1);
    expect(response).not.toHaveProperty('body');
  });

  it('should have an errors field', async () => {
    const requestErr = new ApplicationError(404, 'invalid input', [
      'err response',
    ]);

    errorHandler(requestErr, request, response, next);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('error');
    expect(response.body.error.errors).not.toBe(null);
  });
});
