import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { API_BASE_URL } from "../../lib/api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import type { Task } from "../../App";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function EditTask({ task }: { task: Task }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.Description);
  const [tags, setTags] = useState<string[] | undefined>(task.tag);
  const [priority, setPriority] = useState(task.priority || "");
  const queryClient = useQueryClient();
  const updateTask = async (task: Task) => {
    const { _id, ...rest } = task; // extract ID and keep the data
    const response = await axios.patch(
      `${API_BASE_URL}/tasks/${_id}`,
      rest
    );
    console.log("DataId", _id);
    return response.data;
  };
  const mutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      console.log("Task updated successfully");
      // optionally invalidate or refetch task list
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Task update failed:", error);
    },
  });

  const handleSave = () => {
    const updatedTask = {
      ...task,
      title,
      Description: description,
      tags,
      priority,
    };

    console.log("Updated Task:", updatedTask);
    mutation.mutate(updatedTask);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="hover:bg-blue-800">
          <Pencil className="h-4 w-4 text-blue-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>You can update task info here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label>Tags </Label>
            <Input
              value={tags}
              onChange={(e) => {
                const input = e.target.value;
                const tagArray = input
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag.length > 0);
                setTags(tagArray);
              }}
            />
          </div>
          <div>
            <Label>Priority</Label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
