"use client";

import { useState } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt?: string | null;
};

export default function TaskManager() {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  return (
    <>
      <TaskForm
        task={editingTask ?? undefined}
        onCancel={() => setEditingTask(null)}
      />

      <hr />

      <TaskList onEdit={task => setEditingTask(task)} />
    </>
  );
}
