import { createTRPCRouter } from "@/server/api/trpc";
import { adminRouter } from "./routers/admin";
import { analyticsRouter } from "./routers/analytics";
import { authRouter } from "./routers/auth";
import { civilizationRouter } from "./routers/civilization";
import { dreamRouter } from "./routers/dream";
import { gapRouter } from "./routers/gap";
import { goalRouter } from "./routers/goal";
import { judgmentRouter } from "./routers/judgment";
import { potentialRouter } from "./routers/potential";
import { sechRouter } from "./routers/sech";
import { taskRouter } from "./routers/task";
import { titanRouter } from "./routers/titan";
import { understandingRouter } from "./routers/understanding";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  civilization: civilizationRouter,
  titan: titanRouter,
  gap: gapRouter,
  sech: sechRouter,
  analytics: analyticsRouter,
  admin: adminRouter,
  user: userRouter,
  dream: dreamRouter,
  potential: potentialRouter,
  goal: goalRouter,
  understanding: understandingRouter,
  judgment: judgmentRouter,
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
