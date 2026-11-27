import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error('GentleBubble ErrorBoundary caught:', error.message);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[var(--canvas)] text-[var(--ink)] space-y-4">
          <h1 className="font-serif text-2xl font-medium">GentleBubble by AR</h1>
          <p className="text-sm text-[var(--muted)] max-w-md">
            Something interrupted this view. Refresh the page to continue exploring the atelier.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[var(--accent)] text-white cursor-pointer"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
