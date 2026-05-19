import { Router } from "express";

import { favoriteCampsite, getCampsiteDetails, getCampsites, unfavoriteCampsite } from "../controllers/discovery.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getCampsites);
router.get("/:id", getCampsiteDetails);
router.post("/:id/favorite", requireAuth, favoriteCampsite);
router.delete("/:id/favorite", requireAuth, unfavoriteCampsite);

export default router;
