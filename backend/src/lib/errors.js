export class AppError extends Error {
  constructor(message, options = {}) {
    const { statusCode = 500, code = "INTERNAL_ERROR", details = null } = options;
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, {
      statusCode: 400,
      code: "VALIDATION_ERROR",
      details,
    });
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message) {
    super(message, {
      statusCode: 404,
      code: "NOT_FOUND",
    });
    this.name = "NotFoundError";
  }
}
