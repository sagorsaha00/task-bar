import mongoose, { Schema, Document } from "mongoose";

export interface TaskManger extends Document {
  title: string;
  description: string;
  tag: string;
  priority: "low" | "medium" | "high";
  createdAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    Description: { type: String, required: true },
    tag: { type: String },
    priority: { type: String, default: "low" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// export default mongoose.models.Task ||
//   mongoose.model<TaskManger>("Task", TaskSchema);
const TaskModel =
  mongoose.models.Task || mongoose.model<TaskManger>("Task", TaskSchema);
export default TaskModel;
