import { Router } from "express";

import campsitesRoutes from "./campsites.routes.js";
import healthRoutes from "./health.routes.js";
import trailsRoutes from "./trails.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/trails", trailsRoutes);
router.use("/campsites", campsitesRoutes);

export default router;
