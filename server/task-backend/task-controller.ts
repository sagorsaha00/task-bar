import { Request, Response } from "express";
import TaskModel from "./../../server/lib/taskSchema";
import mongoose from "mongoose";
export class TaskController {
  create = async (req: Request, res: Response) => {
    const { title, Description, tag, priority } = req.body;

    const Tasks = { title, Description, tag, priority };

    const createTask = await TaskModel.create(Tasks);
    console.log("Create Task", createTask);
    res.json({
      message: createTask,
    });
  };
  // getAllTask = async (req: Request, res: Response) => {
  //   try {
  //     const tasks = await TaskModel.find();
  //     res.status(200).json({ success: true, data: tasks });
  //   } catch (error) {
  //     console.error("Error fetching tasks:", error);
  //     res
  //       .status(500)
  //       .json({ success: false, message: "Internal Server Error" });
  //   }
  // };

  getAllTask = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    
    const skip = (page - 1) * limit;
    
    // Build search query
    const searchQuery = search 
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          
          ]
        }
      : {};
    
   
    const totalTasks = await TaskModel.countDocuments(searchQuery);
    
    // Get paginated tasks
    const tasks = await TaskModel.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first
    
    const totalPages = Math.ceil(totalTasks / limit);
    
    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        currentPage: page,
        totalPages,
        totalTasks,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};

  deleteTask = async (
    req: Request,
    res: Response
  ): Promise<string | undefined | any> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw Error(`${id} is Not found`);
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw Error("Invalid Task ID");
      }
      const deletedTask = await TaskModel.findByIdAndDelete(id);

      if (!deletedTask) {
        return res
          .status(404)
          .json({ success: false, message: "Task not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  };
  updateTask = async (
    req: Request,
    res: Response
  ): Promise<string | undefined | any> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw Error(`${id} is Not found`);
      }
      const updateData = req.body;

      const updatedTask = await TaskModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedTask) {
        return res
          .status(404)
          .json({ success: false, message: "Task not found" });
      }

      res.status(200).json({ success: true, data: updatedTask });
    } catch (error) {
      console.error("Error updating task:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  };
}
