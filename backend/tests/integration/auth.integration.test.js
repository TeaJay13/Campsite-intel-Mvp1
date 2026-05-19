import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConflictError, UnauthorizedError } from "../../src/lib/errors.js";

const registerMock = vi.fn();
const loginMock = vi.fn();
const getProfileMock = vi.fn();

vi.mock("../../src/services/auth.service.js", () => ({
  register: (...args) => registerMock(...args),
  login: (...args) => loginMock(...args),
  getProfile: (...args) => getProfileMock(...args),
  verifyToken: vi.fn(() => ({ sub: "user-1", role: "user" })),
}));

const { default: app } = await import("../../src/app.js");

const SAMPLE_AUTH_RESPONSE = {
  user: { id: "user-1", email: "user@example.com", displayName: "Test User", role: "user" },
  accessToken: "access.token.here",
  refreshToken: "refresh.token.here",
};

describe("Auth integration", () => {
  beforeEach(() => {
    registerMock.mockReset();
    loginMock.mockReset();
    getProfileMock.mockReset();
  });

  it("register passes credentials to auth service and returns result", async () => {
    registerMock.mockResolvedValueOnce(SAMPLE_AUTH_RESPONSE);

    await request(app)
      .post("/api/auth/register")
      .send({ email: "user@example.com", displayName: "Test User", password: "password123" })
      .expect(201);

    expect(registerMock).toHaveBeenCalledWith({
      email: "user@example.com",
      displayName: "Test User",
      password: "password123",
    });
  });

  it("register returns 409 when email is already taken", async () => {
    registerMock.mockRejectedValueOnce(
      new ConflictError("An account with that email already exists."),
    );

    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "taken@example.com", displayName: "Another User", password: "password123" })
      .expect(409);

    expect(response.body.error).toBe("CONFLICT");
  });

  it("login returns 401 on wrong credentials", async () => {
    loginMock.mockRejectedValueOnce(new UnauthorizedError("Invalid email or password."));

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@example.com", password: "wrongpassword" })
      .expect(401);

    expect(response.body.error).toBe("UNAUTHORIZED");
  });

  it("login calls auth service with correct credentials", async () => {
    loginMock.mockResolvedValueOnce(SAMPLE_AUTH_RESPONSE);

    await request(app)
      .post("/api/auth/login")
      .send({ email: "user@example.com", password: "password123" })
      .expect(200);

    expect(loginMock).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });
  });

  it("GET /api/auth/me returns profile when valid bearer token provided", async () => {
    getProfileMock.mockResolvedValueOnce({
      id: "user-1",
      email: "user@example.com",
      displayName: "Test User",
      role: "user",
    });

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer valid.token.here")
      .expect(200);

    expect(response.body).toMatchObject({ email: "user@example.com" });
  });
});
