export type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt?: string | null;
};

const tasks: Task[] = [];

export const taskStore = {
  getAll(): Task[] {
    return tasks;
  },

  getById(id: string): Task {
    const task = tasks.find(t => t.id === id);
    if (!task) {
      throw new Error("Task not found");
    }
    return task;
  },

  create(title: string, description?: string): Task {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      createdAt: new Date(),
    };

    tasks.push(task);
    return task;
  },

  update(
    id: string,
    data: { title?: string; description?: string }
  ): Task {
    const task = tasks.find(t => t.id === id);

    if (!task) {
      throw new Error("Task not found");
    }

    if (data.title !== undefined) {
      task.title = data.title;
    }

    if (data.description !== undefined) {
      task.description = data.description;
    }

    task.updatedAt = new Date().toISOString();

    return task;
  },

  delete(id: string): void {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error("Task not found");
    }

    tasks.splice(index, 1);
  },
};
