"use client";

import { useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
};

export default function Home() {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  return (
    <main>
      <h1>Task Manager</h1>

      <TaskForm
        task={editingTask ?? undefined}
        onCancel={() => setEditingTask(null)}
      />

      <hr />

      <TaskList onEdit={task => setEditingTask(task)} />
    </main>
  );
}
