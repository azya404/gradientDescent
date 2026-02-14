import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#000',
            color: '#e4e4e7',
            padding: 24,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h1 style={{ color: '#ef4444', marginBottom: 16 }}>Something went wrong</h1>
          <pre
            style={{
              background: '#18181b',
              padding: 16,
              borderRadius: 8,
              overflow: 'auto',
              fontSize: 14,
            }}
          >
            {this.state.error.message}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
