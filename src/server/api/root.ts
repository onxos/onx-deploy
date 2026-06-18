import { createTRPCRouter } from "@/server/api/trpc";
import { analyticsRouter } from "./routers/analytics";
import { civilizationRouter } from "./routers/civilization";
import { gapRouter } from "./routers/gap";
import { sechRouter } from "./routers/sech";
import { titanRouter } from "./routers/titan";

export const appRouter = createTRPCRouter({
  civilization: civilizationRouter,
  titan: titanRouter,
  gap: gapRouter,
  sech: sechRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
