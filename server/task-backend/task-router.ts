import { asyncwrapper } from "./../lib/asyncwapper";
import expres from "express";
import { TaskController } from "./task-controller";

const router = expres.Router();

const taskController = new TaskController();

router.post("/tasksPost", taskController.create);
router.get("/getAllTask", taskController.getAllTask);
router.delete("/tasks/:id", asyncwrapper(taskController.deleteTask));
router.patch("/tasks/:id", asyncwrapper(taskController.updateTask));

export default router;
