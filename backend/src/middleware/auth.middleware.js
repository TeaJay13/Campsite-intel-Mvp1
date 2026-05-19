import { UnauthorizedError } from "../lib/errors.js";
import { verifyToken } from "../services/auth.service.js";

export function requireAuth(request, _response, next) {
  const authHeader = request.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authentication required."));
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyToken(token);
    request.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired token."));
  }
}
