import { PageWrapper } from "./page-wrapper";

export function ContentArea({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <PageWrapper>{children}</PageWrapper>
    </main>
  );
}
