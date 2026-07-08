import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('AGENTIC LMS Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-dark flex items-center justify-center p-8">
          <div className="glass-panel p-8 rounded-3xl border border-red-500/20 max-w-lg w-full text-center space-y-4">
            <div className="text-5xl">⚠️</div>
            <h2 className="text-xl font-extrabold text-white">Something crashed</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="px-5 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/30 transition"
              >
                Clear Cache & Reload
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-5 py-2.5 rounded-xl bg-primary/20 border border-primary/30 text-primary text-xs font-bold hover:bg-primary/30 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
