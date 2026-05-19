// @vitest-environment jsdom

import React from "react";
import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "../../src/contexts/auth-context.jsx";
import LoginPage from "../../src/pages/login-page.jsx";
import RegisterPage from "../../src/pages/register-page.jsx";

function renderWithProviders(component) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{component}</AuthProvider>
    </QueryClientProvider>,
  );
}

describe("Auth frontend flows", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it("login form submits credentials and calls navigate on success", async () => {
    // Auth provider rehydration check (no stored token — resolves immediately)
    const navigateMock = vi.fn();

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { id: "u1", email: "user@example.com", displayName: "Test", role: "user" },
        accessToken: "tok",
        refreshToken: "ref",
      }),
    });

    renderWithProviders(<LoginPage onNavigate={navigateMock} />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "user@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith("/trails"));
  });

  it("login form shows error message on 401 response", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "UNAUTHORIZED", message: "Invalid email or password." }),
    });

    renderWithProviders(<LoginPage onNavigate={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "bad@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid email or password.");
  });

  it("register form submits and navigates on success", async () => {
    const navigateMock = vi.fn();

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { id: "u2", email: "new@example.com", displayName: "New User", role: "user" },
        accessToken: "tok2",
        refreshToken: "ref2",
      }),
    });

    renderWithProviders(<RegisterPage onNavigate={navigateMock} />);

    fireEvent.change(screen.getByLabelText("Display name"), { target: { value: "New User" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "new@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith("/trails"));
  });

  it("register form shows error when email is already taken", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ error: "CONFLICT", message: "An account with that email already exists." }),
    });

    renderWithProviders(<RegisterPage onNavigate={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Display name"), { target: { value: "Someone" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "taken@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("An account with that email already exists.");
  });
});
