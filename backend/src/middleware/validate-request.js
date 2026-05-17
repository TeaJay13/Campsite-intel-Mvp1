import { ValidationError } from "../lib/errors.js";

export function validateRequest(schema) {
  return (request, _response, next) => {
    const result = schema.safeParse({
      body: request.body,
      query: request.query,
      params: request.params,
    });

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      next(new ValidationError("Request validation failed.", details));
      return;
    }

    request.validated = result.data;
    next();
  };
}
