import { Router } from "express";

import { favoriteTrail, getTrailDetails, getTrails, unfavoriteTrail } from "../controllers/discovery.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getTrails);
router.get("/:id", getTrailDetails);
router.post("/:id/favorite", requireAuth, favoriteTrail);
router.delete("/:id/favorite", requireAuth, unfavoriteTrail);

export default router;
