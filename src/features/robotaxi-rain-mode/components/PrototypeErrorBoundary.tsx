"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };

type State = { error: Error | null };

export class PrototypeErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[RobotaxiRainMode]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-[480px] flex-col items-center justify-center px-6 text-center">
          <p className="text-sm font-medium text-stone-700">Map prototype error</p>
          <p className="mt-2 max-w-[220px] text-[10px] leading-relaxed text-stone-500">
            {this.state.error.message}
          </p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-[var(--rain-teal,#00a8b5)] px-3 py-2 text-[12px] font-semibold text-white"
            onClick={() => this.setState({ error: null })}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
