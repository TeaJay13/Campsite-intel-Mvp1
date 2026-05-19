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

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required.") {
    super(message, {
      statusCode: 401,
      code: "UNAUTHORIZED",
    });
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action.") {
    super(message, {
      statusCode: 403,
      code: "FORBIDDEN",
    });
    this.name = "ForbiddenError";
  }
}

export class ConflictError extends AppError {
  constructor(message) {
    super(message, {
      statusCode: 409,
      code: "CONFLICT",
    });
    this.name = "ConflictError";
  }
}
