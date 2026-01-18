import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('🔴 ERROR BOUNDARY CAUGHT:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🔴 Error details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0d1117',
          color: '#ff5555',
          padding: '20px',
          fontFamily: 'monospace'
        }}>
          <h1 style={{ color: '#ff5555', fontSize: '24px', marginBottom: '20px' }}>
            ⚠️ Page Crashed
          </h1>
          
          <div style={{
            background: '#161b22',
            border: '2px solid #ff5555',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: '#ff5555', fontSize: '18px', marginBottom: '10px' }}>Error:</h2>
            <pre style={{ 
              fontSize: '12px', 
              whiteSpace: 'pre-wrap', 
              wordBreak: 'break-word',
              color: '#c9d1d9'
            }}>
              {this.state.error?.toString()}
            </pre>
            <pre style={{ 
              fontSize: '10px', 
              marginTop: '10px',
              color: '#8b949e',
              whiteSpace: 'pre-wrap'
            }}>
              {this.state.error?.stack}
            </pre>
          </div>

          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#22c55e',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            🔄 Reload Page
          </button>

          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: '#161b22',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#8b949e'
          }}>
            <p><strong>Debug Info:</strong></p>
            <p>URL: {window.location.href}</p>
            <p>User Agent: {navigator.userAgent}</p>
            <p>Time: {new Date().toISOString()}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
