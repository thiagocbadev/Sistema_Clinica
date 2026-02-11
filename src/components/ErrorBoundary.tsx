import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('Unhandled error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white dark:bg-black border border-red-200 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-red-600 mb-2">Ocorreu um erro</h2>
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{this.state.error?.message}</pre>
            <details className="mt-4 text-xs text-muted-foreground">
              <summary>Stack trace</summary>
              <pre className="whitespace-pre-wrap">{this.state.error?.stack}</pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
