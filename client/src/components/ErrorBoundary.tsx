import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component {
  declare props: ErrorBoundaryProps;
  declare state: ErrorBoundaryState;
  declare setState: (
    state:
      | Partial<ErrorBoundaryState>
      | ((prevState: ErrorBoundaryState) => Partial<ErrorBoundaryState>),
  ) => void;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-surface rounded-lg p-8 shadow-lg border-2 border-border">
            <h1 className="text-3xl font-bold text-text/90 mb-4">
              Something went wrong
            </h1>
            <p className="text-text/70 mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="mb-6">
                <summary className="cursor-pointer text-text/60 hover:text-text/80 mb-2">
                  Error details
                </summary>
                <pre className="bg-background/50 p-4 rounded text-sm text-text/80 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.error.stack && (
                    <>
                      {"\n\n"}
                      {this.state.error.stack}
                    </>
                  )}
                </pre>
              </details>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
              className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
