import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0b1326]">
          <div className="w-full max-w-md bg-[#161f35]/60 backdrop-blur-xl border border-white/[0.1] rounded-2xl overflow-hidden">
            <div className="text-center p-8">
              <AlertTriangle className="h-12 w-12 text-[#ffb4ab] mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
              <p className="text-sm text-white/40">
                We're sorry, but something unexpected happened. Please try again.
              </p>
            </div>
            <div className="px-8 pb-8 space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="p-3 bg-[#ffb4ab]/10 rounded-xl border border-[#ffb4ab]/20">
                  <p className="text-sm text-[#ffb4ab] font-mono break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#937dff] to-[#00a6e0] text-white font-semibold hover:brightness-110 active:scale-95 transition-all"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/70 font-semibold hover:bg-white/[0.08] active:scale-95 transition-all"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
