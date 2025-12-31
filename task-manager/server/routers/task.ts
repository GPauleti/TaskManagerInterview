import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { taskStore } from "../store/taskStore";

export const taskRouter = router({
  getAll: publicProcedure.query(() => {
    return taskStore.getAll();
  }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ input }) => {
      return taskStore.getById(input.id);
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      return taskStore.create(input.title, input.description);
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return taskStore.update(id, data);
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input }) => {
      taskStore.delete(input.id);
      return { success: true };
    }),

  getPaginated: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20),
        cursor: z.string().nullish(),
      })
    )
    .query(({ input }) => {
      const { limit, cursor } = input;

      const allTasks = taskStore.getAll();

      const startIndex = cursor
        ? allTasks.findIndex(t => t.id === cursor) + 1
        : 0;

      const items = allTasks.slice(startIndex, startIndex + limit);

      const nextCursor =
        startIndex + limit < allTasks.length
          ? items[items.length - 1]?.id
          : null;

      return {
        items,
        nextCursor,
      };
    }),
});
