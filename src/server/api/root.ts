import { createTRPCRouter } from "@/server/api/trpc";
import { adminRouter } from "./routers/admin";
import { analyticsRouter } from "./routers/analytics";
import { authRouter } from "./routers/auth";
import { civilizationRouter } from "./routers/civilization";
import { gapRouter } from "./routers/gap";
import { sechRouter } from "./routers/sech";
import { titanRouter } from "./routers/titan";
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
});

export type AppRouter = typeof appRouter;
