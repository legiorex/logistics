import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { ErrorState } from './error-state'

interface ErrorBoundaryInnerProps {
  children: ReactNode
  onReset: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
}

// Глобальный Error Boundary: перехватывает ошибки рендеринга.
// При сбросе вызывает onReset (инвалидация кэша) из родительского функционального компонента.
class ErrorBoundaryInner extends Component<ErrorBoundaryInnerProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  handleReset = () => {
    this.props.onReset()
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          message="Произошла непредвиденная ошибка"
          onRetry={this.handleReset}
          backLink
        />
      )
    }

    return this.props.children
  }
}

// Функциональная обёртка для доступа к queryClient через хук
function ErrorBoundary({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  return (
    <ErrorBoundaryInner onReset={() => void queryClient.invalidateQueries()}>
      {children}
    </ErrorBoundaryInner>
  )
}

export { ErrorBoundary }
