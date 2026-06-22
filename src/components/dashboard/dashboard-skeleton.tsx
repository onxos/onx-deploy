import { PageWrapper } from "@/components/layout/page-wrapper";
import { Skeleton } from "@/components/ui/skeleton";

const statSkeletons = ["articles", "gaps", "titans", "sech"];

export function DashboardSkeleton() {
  return (
    <PageWrapper
      title="Dashboard"
      description="Overview of ONX civilization activity."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statSkeletons.map((item) => (
          <Skeleton key={item} className="h-32" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-80 lg:col-span-2" />
        <Skeleton className="h-80" />
      </div>
    </PageWrapper>
  );
}
