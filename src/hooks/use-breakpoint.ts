"use client";

import { useEffect, useState } from "react";
import { type BreakpointName, getBreakpointName } from "@/lib/breakpoints";

export function useBreakpoint(): BreakpointName {
  const [breakpoint, setBreakpoint] = useState<BreakpointName>("lg");

  useEffect(() => {
    const update = () => setBreakpoint(getBreakpointName(window.innerWidth));

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return breakpoint;
}
