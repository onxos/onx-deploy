import { ResponsiveGrid } from "@/components/layout/responsive-grid";

export function WidgetGrid({ children }: { children: React.ReactNode }) {
  return <ResponsiveGrid>{children}</ResponsiveGrid>;
}
