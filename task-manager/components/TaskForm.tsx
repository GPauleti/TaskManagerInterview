"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";
import type { InfiniteData } from "@tanstack/react-query";
import DOMPurify from "dompurify";

type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt?: string | null;
};

type PaginatedPage = {
  items: Task[];
  nextCursor: string | null;
};

export default function TaskForm({
  task,
  onCancel,
}: {
  task?: Task;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setError(null);
  };

  const createTask = trpc.task.create.useMutation({
    onMutate: async newTask => {
      await utils.task.getPaginated.cancel();

      const previousData =
        utils.task.getPaginated.getData({ limit: 5 });

      utils.task.getPaginated.setData(
        { limit: 5 },
        (old: InfiniteData<PaginatedPage> | undefined) => {
          if (!old) return old;

          const optimisticTask: Task = {
            id: crypto.randomUUID(),
            title: newTask.title,
            description: newTask.description,
          };

          return {
            ...old,
            pages: [
              {
                ...old.pages[0],
                items: [optimisticTask, ...old.pages[0].items],
              },
              ...old.pages.slice(1),
            ],
          };
        }
      );

      return { previousData };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previousData) {
        utils.task.getPaginated.setData(
          { limit: 5 },
          ctx.previousData
        );
      }
    },

    onSuccess: () => {
      resetForm();
      setSuccess("Task created successfully");
      setTimeout(() => setSuccess(null), 3000);
    },

    onSettled: () => {
      utils.task.getPaginated.invalidate();
    },
  });

  const updateTask = trpc.task.update.useMutation({
    onMutate: async updatedTask => {
      await utils.task.getPaginated.cancel({ limit: 5 });

      const previousData =
        utils.task.getPaginated.getData({ limit: 5 });

      utils.task.getPaginated.setData(
        { limit: 5 },
        (old: InfiniteData<PaginatedPage> | undefined) => {
          if (!old) return old;

          const now = new Date().toISOString();

          return {
            ...old,
            pages: old.pages.map(page => ({
              ...page,
              items: page.items.map(task =>
                task.id === updatedTask.id
                  ? {
                    ...task,
                    ...updatedTask,
                    updatedAt: now,
                  }
                  : task
              ),
            })),
          };
        }
      );

      return { previousData };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previousData) {
        utils.task.getPaginated.setData(
          { limit: 5 },
          ctx.previousData
        );
      }
    },

    onSuccess: () => {
      resetForm();
      setSuccess("Task updated successfully");
      setTimeout(() => setSuccess(null), 3000);
      onCancel();
    },

    onSettled: () => {
      utils.task.getPaginated.invalidate({ limit: 5 });
    },
  });


  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
    } else {
      resetForm();
    }
  }, [task]);


  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanTitle = DOMPurify.sanitize(title, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    const cleanDescription = DOMPurify.sanitize(description, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

    setError(null);
    setSuccess(null);

    if (!cleanTitle.trim()) {
      setError("Invalid input");
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (task) {
      updateTask.mutate({
        id: task.id,
        title: cleanTitle,
        description: cleanDescription,
      });
    } else {
      createTask.mutate({
        title: cleanTitle,
        description: cleanDescription,
      });
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>{task ? "Edit Task" : "Create Task"}</h2>

      <input
        placeholder="Title - Max 70 Characters"
        value={title}
        maxLength={70}
        onChange={e => setTitle(e.target.value)}
      />

      <br />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <br />

      <button
        type="submit"
        disabled={createTask.isLoading || updateTask.isLoading}
      >
        {task ? "Update Task" : "Add Task"}
      </button>

      {task && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}

      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}

      {(createTask.error || updateTask.error) && (
        <p>
          {createTask.error?.message ||
            updateTask.error?.message}
        </p>
      )}
    </form>
  );
}
