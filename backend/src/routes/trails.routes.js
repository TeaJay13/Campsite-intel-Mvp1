import { Router } from "express";

import { getTrailDetails, getTrails } from "../controllers/discovery.controller.js";

const router = Router();

router.get("/", getTrails);
router.get("/:id", getTrailDetails);

export default router;
