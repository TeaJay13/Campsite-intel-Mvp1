import { Router } from "express";

import { getCampsiteDetails, getCampsites } from "../controllers/discovery.controller.js";

const router = Router();

router.get("/", getCampsites);
router.get("/:id", getCampsiteDetails);

export default router;
