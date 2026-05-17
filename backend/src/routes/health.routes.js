import { Router } from "express";

const router = Router();

router.get("/", (_request, response) => {
  response.status(200).json({
    status: "ok",
    uptime: Math.round(process.uptime()),
  });
});

export default router;
