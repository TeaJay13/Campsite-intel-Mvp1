import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { ConflictError, UnauthorizedError } from "../lib/errors.js";
import { User } from "../models/user.model.js";

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export async function register({ email, displayName, password }) {
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    throw new ConflictError("An account with that email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await User.create({ email, displayName, passwordHash });

  const payload = { sub: user._id.toString(), role: user.role };

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    },
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export async function login({ email, password }) {
  const user = await User.findOne({
    email: email.toLowerCase().trim(),
    accountStatus: "active",
  });

  if (!user) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const payload = { sub: user._id.toString(), role: user.role };

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    },
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export async function getProfile(userId) {
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new UnauthorizedError("User not found.");
  }

  return {
    id: user._id.toString(),
    email: user.email,
    displayName: user.displayName,
    role: user.role,
  };
}
