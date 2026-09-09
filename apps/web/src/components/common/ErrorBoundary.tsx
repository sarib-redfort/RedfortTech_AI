import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logger } from '../../lib/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render-time errors anywhere below it.
 *
 * Without this, a single thrown error unmounts the whole React tree and the
 * visitor is left on a blank white page with no way forward. React only
 * recovers via a class component, so this cannot be a hook.
 *
 * Note this does not catch errors inside event handlers or async callbacks —
 * those are handled where they occur.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logger.error('Unhandled render error:', error, info.componentStack);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="max-w-md text-center">
          <p className="text-sm font-semibold tracking-widest text-red-600 uppercase">
            Something went wrong
          </p>
          <h1 className="mt-4 text-3xl font-bold text-black">
            This page failed to load
          </h1>
          <p className="mt-4 text-gray-600">
            Sorry — an unexpected error stopped the page from rendering. Reloading
            usually fixes it.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Reload page
            </button>
            <a
              href="/"
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-gray-50"
            >
              Go home
            </a>
          </div>
        </div>
      </div>
    );
  }
}
