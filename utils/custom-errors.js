class HttpError extends Error {
  statusCode;

  constructor({ message, statusCode }) {
    super(message);
    this.statusCode = statusCode || 500;
  }
}

class BadRequestError extends HttpError {
  statusCode = 400;
}

class UnauthorizedError extends HttpError {
  statusCode = 401;
}

class ForbiddenError extends HttpError {
  statusCode = 403;
}

class NotFoundError extends HttpError {
  statusCode = 404;
}

class ValidationError extends HttpError {
  statusCode = 422;
  errors;

  constructor({ message = "Validation Failed", errors = [] }) {
    super({ message, statusCode: 422 });
    this.errors = errors;
  }
}

module.exports = {
  HttpError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
};
