"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title অবশ্যই কমপক্ষে ২ অক্ষরের হতে হবে।",
  }),
  Description: z.string().min(5, {
    message: "Description অবশ্যই কমপক্ষে ৫ অক্ষরের হতে হবে।",
  }),
  tag: z.string().min(1, {
    message: "একটি ট্যাগ নির্বাচন করুন।",
  }),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Priority নির্বাচন করুন।",
  }),
});

export default function AddTaskDialog() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      tag: "",
      priority: "",
    },
  });
  type FormValues = z.infer<typeof formSchema>;

  const submitFormData = async (formData: FormValues) => {
    const response = await axios.post(
      "https://task-bar-delta.vercel.app/tasksPost",
      formData
    );
    console.log("response", response);
    return response.data;
  };
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitFormData,
    mutationKey: ["tasks"],
    onSuccess: (data) => {
      console.log("Form submitted successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Form submission failed:", error);
    },
  });

  // onSubmit handler
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>নতুন টাস্ক যোগ করুন</DialogTitle>
          <DialogDescription>
            একটি নতুন টাস্ক তৈরি করুন নিচের ফর্ম দিয়ে।
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="Description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter task description"
                      {...field}
                      className="h-24"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tag" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Priority */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">Save Task</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
