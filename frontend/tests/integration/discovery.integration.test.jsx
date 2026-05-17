// @vitest-environment jsdom

import React from "react";
import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import CampsiteDetailPage from "../../src/pages/campsite-detail-page.jsx";
import TrailsPage from "../../src/pages/trails-page.jsx";

function renderWithQueryClient(component) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);
}

describe("Discovery frontend flows", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders trail cards from API response", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          {
            _id: "trail-1",
            name: "Cedar Loop",
            location: { region: "North" },
            distanceKm: 6.5,
            elevationGainM: 220,
            difficulty: "easy",
          },
        ],
        meta: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 },
      }),
    });

    renderWithQueryClient(<TrailsPage />);

    expect(await screen.findByText("Cedar Loop")).toBeInTheDocument();
    expect(screen.getByText("Difficulty: easy")).toBeInTheDocument();
  });

  it("shows empty state when no trails are returned", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [],
        meta: { page: 1, pageSize: 20, totalItems: 0, totalPages: 1 },
      }),
    });

    renderWithQueryClient(<TrailsPage />);

    expect(await screen.findByText("No trails found")).toBeInTheDocument();
  });

  it("applies filters and requests filtered trails", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [],
        meta: { page: 1, pageSize: 20, totalItems: 0, totalPages: 1 },
      }),
    });

    renderWithQueryClient(<TrailsPage />);

    await screen.findByText("No trails found");

    const regionInput = screen.getByLabelText("Region");
    fireEvent.change(regionInput, { target: { value: "West" } });
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("region=West"));
    });
  });

  it("renders campsite detail page", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        _id: "camp-1",
        name: "Pine Hollow",
        location: { region: "North" },
        amenities: ["water", "parking"],
        description: "A shaded site near the river.",
        accessNotes: "Use forest road after mile 2.",
      }),
    });

    renderWithQueryClient(<CampsiteDetailPage campsiteId="camp-1" />);

    expect(await screen.findByText("Pine Hollow")).toBeInTheDocument();
    expect(screen.getByText("A shaded site near the river.")).toBeInTheDocument();
  });
});
