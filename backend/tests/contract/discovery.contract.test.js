import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NotFoundError } from "../../src/lib/errors.js";

const listTrailsMock = vi.fn();
const getTrailByIdMock = vi.fn();
const listCampsitesMock = vi.fn();
const getCampsiteByIdMock = vi.fn();

vi.mock("../../src/services/trail.service.js", () => ({
  listTrails: (...args) => listTrailsMock(...args),
  getTrailById: (...args) => getTrailByIdMock(...args),
}));

vi.mock("../../src/services/campsite.service.js", () => ({
  listCampsites: (...args) => listCampsitesMock(...args),
  getCampsiteById: (...args) => getCampsiteByIdMock(...args),
}));

const { default: app } = await import("../../src/app.js");

describe("Discovery API contract", () => {
  beforeEach(() => {
    listTrailsMock.mockReset();
    getTrailByIdMock.mockReset();
    listCampsitesMock.mockReset();
    getCampsiteByIdMock.mockReset();
  });

  it("returns paginated trails with contract shape", async () => {
    listTrailsMock.mockResolvedValueOnce({
      items: [{ _id: "trail-1", name: "Cedar Ridge" }],
      meta: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 },
    });

    const response = await request(app).get("/api/trails").expect(200);

    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.meta).toMatchObject({
      page: expect.any(Number),
      pageSize: expect.any(Number),
      totalItems: expect.any(Number),
      totalPages: expect.any(Number),
    });
  });

  it("returns paginated campsites with contract shape", async () => {
    listCampsitesMock.mockResolvedValueOnce({
      items: [{ _id: "camp-1", name: "Pine Hollow" }],
      meta: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 },
    });

    const response = await request(app).get("/api/campsites").expect(200);

    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.meta).toMatchObject({
      page: expect.any(Number),
      pageSize: expect.any(Number),
      totalItems: expect.any(Number),
      totalPages: expect.any(Number),
    });
  });

  it("returns 404 error shape for missing trail detail", async () => {
    getTrailByIdMock.mockRejectedValueOnce(new NotFoundError("Trail not found."));

    const response = await request(app)
      .get("/api/trails/665f0f5f5f5f5f5f5f5f5f5f")
      .expect(404);

    expect(response.body).toMatchObject({
      error: "NOT_FOUND",
      message: "Trail not found.",
    });
  });
});
