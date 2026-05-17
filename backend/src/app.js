import cors from "cors";
import express from "express";

import { errorHandler } from "./middleware/error-handler.js";
import apiRoutes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

app.get("/", (_request, response) => {
  response.status(200).json({
    name: "Trail & Campsite Intelligence Platform API",
    status: "running",
  });
});

app.use(errorHandler);

export default app;
