import { initDb } from "./lib/mongodb";
// server/index.ts
import express from "express";
import cors from "cors";
import taskPostRouter from "./task-backend/task-router";

const app = express();

app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/", taskPostRouter);

app.listen(5000, () => {
  initDb();
  console.log("mongo Db connect");
  console.log("🚀 Server listening on http://localhost:5000");
});
