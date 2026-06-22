import { cn } from "@/lib/utils";

interface PageWrapperProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageWrapper({
  title,
  description,
  children,
  actions,
  className,
}: PageWrapperProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl space-y-6", className)}>
      {(title || description || actions) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && (
              <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground md:text-base">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
