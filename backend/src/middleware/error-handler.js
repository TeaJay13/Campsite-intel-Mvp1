import { AppError } from "../lib/errors.js";

export function errorHandler(error, _request, response, _next) {
  const normalizedError =
    error instanceof AppError
      ? error
      : new AppError("An unexpected error occurred.", {
          statusCode: 500,
          code: "INTERNAL_ERROR",
        });

  response.status(normalizedError.statusCode).json({
    error: normalizedError.code,
    message: normalizedError.message,
    details: normalizedError.details,
  });
}
