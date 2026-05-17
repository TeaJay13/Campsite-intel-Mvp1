import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

describe("Discovery integration", () => {
  beforeEach(() => {
    listTrailsMock.mockReset();
    getTrailByIdMock.mockReset();
    listCampsitesMock.mockReset();
    getCampsiteByIdMock.mockReset();
  });

  it("passes trail filters to trail service", async () => {
    listTrailsMock.mockResolvedValueOnce({
      items: [{ _id: "trail-1", name: "Granite Pass" }],
      meta: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 },
    });

    await request(app)
      .get("/api/trails")
      .query({ difficulty: "hard", region: "West", page: 2, pageSize: 10 })
      .expect(200);

    expect(listTrailsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        difficulty: "hard",
        region: "West",
        page: 2,
        pageSize: 10,
      }),
    );
  });

  it("returns detail payload from trail service", async () => {
    getTrailByIdMock.mockResolvedValueOnce({ _id: "trail-123", name: "Granite Pass" });

    const response = await request(app).get("/api/trails/trail-123").expect(200);

    expect(getTrailByIdMock).toHaveBeenCalledWith("trail-123");
    expect(response.body).toMatchObject({ _id: "trail-123", name: "Granite Pass" });
  });

  it("passes campsite filters and returns campsite detail", async () => {
    listCampsitesMock.mockResolvedValueOnce({
      items: [{ _id: "camp-1", name: "Sunset Meadow" }],
      meta: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 },
    });

    await request(app)
      .get("/api/campsites")
      .query({ amenity: "water", region: "West" })
      .expect(200);

    expect(listCampsitesMock).toHaveBeenCalledWith(
      expect.objectContaining({ amenity: "water", region: "West" }),
    );

    getCampsiteByIdMock.mockResolvedValueOnce({ _id: "camp-1", name: "Sunset Meadow" });
    const detailResponse = await request(app).get("/api/campsites/camp-1").expect(200);

    expect(getCampsiteByIdMock).toHaveBeenCalledWith("camp-1");
    expect(detailResponse.body).toMatchObject({ _id: "camp-1", name: "Sunset Meadow" });
  });
});
