import { ZodError } from 'zod';

export class ServerError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 500;
    this.name = 'InternalServerError';
  }
}

export class BadRequestError extends ServerError {
  errorObject: {
    attribute: string;
    message: string;
  }[] | undefined;

  constructor(message: string, errorObject?: ZodError) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
    this.errorObject = errorObject?.errors.map(err => ({
      attribute: err.path.join('.'),
      message: err.message
    }));
  }
}

export class AuthenticationError extends ServerError {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

export class AuthorizationError extends ServerError {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = 403;
  }
}

export class NotFoundError extends ServerError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class ConflictError extends ServerError {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

export class DataBaseError extends ServerError {
  constructor(message: string) {
    super(message);
    this.name = 'DataBaseError';
    this.statusCode = 500;
  }
}

export class ExternalServiceError extends ServerError {
  constructor(message: string) {
    super(message);
    this.name = 'ExternalServiceError';
    this.statusCode = 502;
  }
}
