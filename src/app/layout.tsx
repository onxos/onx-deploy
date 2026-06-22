import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { DialogProvider } from "@/components/ui/dialog-provider";
import { ToastProvider } from "@/components/ui/toast-provider";
import { TRPCReactProvider } from "./_providers";
import "./globals.css";
import "@/styles/media-queries.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ONX Civilization Platform",
  description: "Digital civilization for veterinary medicine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full overflow-hidden">
        <TRPCReactProvider>
          <ThemeProvider>
            <DialogProvider>
              <ToastProvider>
                <AppShell>{children}</AppShell>
              </ToastProvider>
            </DialogProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
