import express from "express";
import cors from "cors";

import { initDb } from "./lib/mongodb";
import taskPostRouter from "./task-backend/task-router";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://taskbarclient.netlify.app",
     
    ],
    credentials: true,
  })
);

app.use("/", taskPostRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await initDb();

  console.log("✅ MongoDB Connected");
  console.log(`🚀 Server running on port ${PORT}`);
});