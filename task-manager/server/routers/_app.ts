import { router, publicProcedure } from "../trpc";
import { taskRouter } from "./task";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: "ok" };
  }),
    task: taskRouter,
});

export type AppRouter = typeof appRouter;
