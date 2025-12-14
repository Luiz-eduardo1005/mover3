/**
 * MOVER - Error Boundary Component
 * 
 * Desenvolvido por Luis Roberto Lins de Almeida e equipe ADS FAMetro
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorPage from '@/pages/ErrorPage';
import { analytics } from '@/lib/analytics';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log do erro
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);

    // Rastrear erro no Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      analytics.error('react_error_boundary', error.message);
    }

    // Atualizar estado com informações do erro
    this.setState({
      error,
      errorInfo,
    });

    // Aqui você poderia enviar o erro para um serviço de monitoramento
    // como Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorPage
          statusCode={500}
          title="Algo deu errado"
          message="Ocorreu um erro inesperado. Nossa equipe foi notificada."
          showRetry
          onRetry={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

