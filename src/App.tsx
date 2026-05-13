import { useEffect, useState } from "react";

import { Trash2 } from "lucide-react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

import AddTask from "./components/need/addTask";
import EditTask from "./components/need/editTask";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Task Interface
export interface Task {
  _id: string;
  title: string;
  Description: string;
  tag: string[];
  priority: string;
}

export default function Tasker() {
  const [search, setSearch] = useState(""); 
  const [debouncedSearch, setDebouncedSearch] = useState(search); // debounce করা সার্চ

  // ✅ Debounce Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search); 
    }, 800);
    return () => clearTimeout(timer);
  }, [search]);

  
  const fetchTasks = async ({ queryKey }: any) => {
    const [_key, search] = queryKey;
    const res = await axios.get("http://localhost:5000/getAllTask", {
      params: { search },
    });

    return res.data;
  };

 
  const deleteTask = async (id: string) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
  };

  const queryClient = useQueryClient();

  const { mutate: handleDelete } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", debouncedSearch] });
    },
  });

  // ✅ useQuery for data fetch (with search key)
  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery<
    { data: any }, // query result type
    Error // error type
  >({
    queryKey: ["tasks", debouncedSearch],
    queryFn: fetchTasks,
  });

  if (isLoading) return <div className="text-white p-4">Loading...</div>;
  if (isError) return <div className="text-red-500 p-4">Error occurred</div>;

  const Data: Task[] = (tasks as unknown as Task[]).data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white px-6 py-12">
      {/* 🔶 Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-yellow-400 drop-shadow-lg">
          Tasker
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          Effortlessly Organize, Prioritize, and Conquer Tasks with Tasker —
          Your Personal Productivity Ally for Seamless Goal Achievement and
          Stress-Free Task Management.
        </p>
        <img
          src="/tasker-illustration.png"
          alt="Task Illustration"
          className="mx-auto w-48 md:w-64"
        />
      </div>

      {/* 🔶 Top Section */}
      <div className="max-w-6xl mx-auto mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <Input
            placeholder="Search Task"
            className="w-full md:w-1/2 text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-6">
            <AddTask />
            <Button className="bg-red-600 hover:bg-red-700 text-white px-6">
              Delete All
            </Button>
          </div>
        </div>

        {/* 🔶 Task List */}
        <Card className="bg-[#1a1a1a] border border-gray-700 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-white font-semibold">
              Your Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full table-auto text-left text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-600">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Tags</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4 text-right">Options</th>
                </tr>
              </thead>
              <tbody>
                {Data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center text-gray-400 py-6 text-sm"
                    >
                      No tasks found.
                    </td>
                  </tr>
                ) : (
                  Data.map((task: Task, index: number) => (
                    <tr
                      key={task._id}
                      className="border-b border-gray-700 hover:bg-gray-800 transition"
                    >
                      <td className="py-3 px-4 font-medium text-white">
                        {task.title}
                      </td>
                      <td className="py-3 px-4 text-gray-300 max-w-lg">
                        {task.Description}
                      </td>
                      <td className="py-3 px-4 text-white">
                        <h1 className="font-semibold">{task.tag}</h1>
                      </td>
                      <td className="py-3 px-4 text-red-400 font-semibold">
                        {task.priority}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="hover:bg-red-800"
                            onClick={() => handleDelete(task._id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                          <EditTask task={task} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
