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
 * Without this, a single thrown error unmounts the whole admin panel and the
 * editor is left on a blank page, potentially mid-edit. React only recovers
 * via a class component, so this cannot be a hook.
 *
 * Note this does not catch errors inside event handlers or async callbacks —
 * those surface as toasts where they occur.
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">
            The admin panel hit an error
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            An unexpected error stopped this screen from rendering. Reloading
            usually fixes it. Any unsaved changes on this screen will be lost.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-6 rounded-lg bg-primary-red px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-red-hover"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
