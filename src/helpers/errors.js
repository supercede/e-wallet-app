/**
 * @class ApplicationError
 * @description base error class for applicatioin
 * @extends Error
 */
export class ApplicationError extends Error {
  /**
   * @description initializes the error class
   *
   * @param {number} statusCode status code of the request
   * @param {string} message error message
   * @param {array} errors an array containing errors
   */
  constructor(statusCode, message = 'an error occurred', errors) {
    super(message);
    this.statusCode = statusCode || 500;
    this.message = message;
    this.errors = errors;
  }
}

/**
 * @class NotFoundError
 * @description error class for resource not found
 * @extends ApplicationError
 */
export class NotFoundError extends ApplicationError {
  /**
   * @description initialize error class
   *
   * @param {string} message error message
   */
  constructor(message) {
    super(404, message || 'resource not found');
  }
}
