import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="text-center p-8 max-w-md w-full">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              عذراً، حدث خطأ غير متوقع
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              يرجى إعادة تحميل الصفحة أو المحاولة مرة أخرى لاحقاً
            </p>
            
            {/* Error Details for Development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left bg-red-50 dark:bg-red-900/20 p-4 rounded border text-sm">
                <summary className="cursor-pointer font-medium text-red-800 dark:text-red-200 mb-2">
                  تفاصيل الخطأ (للمطورين)
                </summary>
                <pre className="text-red-700 dark:text-red-300 whitespace-pre-wrap overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <button
                onClick={() => window.location.reload()}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                إعادة تحميل الصفحة
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                المحاولة مرة أخرى
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
