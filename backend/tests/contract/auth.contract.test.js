import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

describe("Auth API contract", () => {
  beforeEach(() => {
    registerMock.mockReset();
    loginMock.mockReset();
    getProfileMock.mockReset();
  });

  it("POST /api/auth/register returns 201 with user and tokens", async () => {
    registerMock.mockResolvedValueOnce(SAMPLE_AUTH_RESPONSE);

    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "user@example.com", displayName: "Test User", password: "password123" })
      .expect(201);

    expect(response.body).toMatchObject({
      user: expect.objectContaining({ email: "user@example.com" }),
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it("POST /api/auth/register returns 400 when body is invalid", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "not-an-email", password: "123" })
      .expect(400);

    expect(response.body.error).toBe("VALIDATION_ERROR");
  });

  it("POST /api/auth/login returns 200 with user and tokens", async () => {
    loginMock.mockResolvedValueOnce(SAMPLE_AUTH_RESPONSE);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@example.com", password: "password123" })
      .expect(200);

    expect(response.body).toMatchObject({
      user: expect.objectContaining({ email: "user@example.com" }),
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it("POST /api/auth/logout returns 200 with success message", async () => {
    const response = await request(app).post("/api/auth/logout").expect(200);
    expect(response.body.message).toBe("Logged out successfully.");
  });

  it("GET /api/auth/me returns 401 without token", async () => {
    const response = await request(app).get("/api/auth/me").expect(401);
    expect(response.body.error).toBe("UNAUTHORIZED");
  });
});
