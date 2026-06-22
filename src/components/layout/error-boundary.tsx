"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryState = {
  hasError: boolean;
  message?: string;
};

export class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ONX shell error boundary caught an error", {
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-destructive">
          <h2 className="text-lg font-semibold">Interface recovery mode</h2>
          <p className="mt-2 text-sm">
            The shell caught a runtime error and kept the route contained.
          </p>
          {this.state.message && (
            <pre className="mt-4 overflow-auto rounded-md bg-background p-3 text-xs text-foreground">
              {this.state.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
