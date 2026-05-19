import { Router } from "express";

import {
  getProfile,
  login,
  logout,
  register,
  validateLogin,
  validateRegister,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.get("/me", requireAuth, getProfile);

export default router;
