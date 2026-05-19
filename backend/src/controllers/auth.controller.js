import { z } from "zod";

import { validateRequest } from "../middleware/validate-request.js";
import * as authService from "../services/auth.service.js";

const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format."),
    displayName: z.string().min(2).max(50),
    password: z.string().min(8, "Password must be at least 8 characters."),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format."),
    password: z.string().min(1, "Password is required."),
  }),
});

export const validateRegister = validateRequest(registerSchema);
export const validateLogin = validateRequest(loginSchema);

export async function register(request, response, next) {
  try {
    const { email, displayName, password } = request.validated.body;
    const result = await authService.register({ email, displayName, password });
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(request, response, next) {
  try {
    const { email, password } = request.validated.body;
    const result = await authService.login({ email, password });
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function logout(_request, response) {
  // Stateless JWT: client discards tokens; endpoint confirms success
  response.status(200).json({ message: "Logged out successfully." });
}

export async function getProfile(request, response, next) {
  try {
    const profile = await authService.getProfile(request.user.id);
    response.status(200).json(profile);
  } catch (error) {
    next(error);
  }
}

export async function getSavedTrails(request, response, next) {
  try {
    const trails = await authService.getSavedTrails(request.user.id);
    response.status(200).json(trails);
  } catch (error) {
    next(error);
  }
}
