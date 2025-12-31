"use client";

import { useEffect, useRef, useState } from "react";
import { trpc } from "@/utils/trpc";
import Image from "next/image";

type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt?: string | null;
};

export default function TaskList({
  onEdit,
}: {
  onEdit: (task: Task) => void;
}) {
  const utils = trpc.useUtils();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = trpc.task.getPaginated.useInfiniteQuery(
    { limit: 5 },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
    }
  );

  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: () => {
      utils.task.getPaginated.reset();
      setSuccessMessage("Task deleted successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    },
  });

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    deleteTask.mutate({ id });
  };

  const tasks = Array.from(
    new Map(
      data?.pages
        .flatMap(page => page.items)
        .map(task => [task.id, task])
    ).values()
  );

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.5,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <>
      {successMessage && (
        <p className="success">{successMessage}</p>
      )}
      <ul>
        {tasks.map(task => (
          <li key={task.id} className="task-card">
            <div className="task-header">
              <strong>{task.title}</strong>
              <div className="icon-actions">
                <div className="tooltip">
                  <button
                    onClick={() => onEdit(task)}
                    aria-label="Edit task"
                    className="icon-button"
                  >
                    <Image src="/edit.png" alt="Edit" width={20} height={20} />
                  </button>
                  <span className="tooltip-text">Edit task</span>
                </div>

                <div className="tooltip">
                  <button
                    onClick={() => handleDelete(task.id)}
                    aria-label="Delete task"
                    className="icon-button"
                  >
                    <Image src="/delete.png" alt="Delete" width={20} height={20} />
                  </button>
                  <span className="tooltip-text">Delete task</span>
                </div>
              </div>
            </div>

            {task.description ? (
              <p>{task.description}</p>
            ) : (
              <small>No description provided</small>
            )}

            <div className="task-footer">
              <small className="muted">
                Created: {new Date(task.createdAt).toLocaleString()}
              </small>

              {task.updatedAt && (
                <small className="muted">
                  Last updated: {new Date(task.updatedAt).toLocaleString()}
                </small>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div ref={loadMoreRef} style={{ height: 1 }} />

      {isFetchingNextPage && (
        <p style={{ textAlign: "center", marginTop: 16 }}>
          Loading more tasks...
        </p>
      )}

      {!hasNextPage && tasks.length > 0 && (
        <p style={{ textAlign: "center", marginTop: 16 }}>
          No more tasks
        </p>
      )}
    </>
  );
}
