/**
 * MOVER - Error Handler Hook
 * 
 * Desenvolvido por Luis Roberto Lins de Almeida e equipe ADS FAMetro
 */

import { useCallback } from 'react';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  trackError?: boolean;
  fallbackMessage?: string;
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: unknown,
    context?: string,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logError = true,
      trackError = true,
      fallbackMessage = 'Ocorreu um erro inesperado. Tente novamente.',
    } = options;

    // Extrair mensagem de erro
    let errorMessage = fallbackMessage;
    let errorType = 'unknown_error';

    if (error instanceof Error) {
      errorMessage = error.message || fallbackMessage;
      errorType = error.name || 'Error';
    } else if (typeof error === 'string') {
      errorMessage = error;
      errorType = 'string_error';
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String((error as any).message) || fallbackMessage;
      errorType = (error as any).code || 'object_error';
    }

    // Log do erro
    if (logError) {
      console.error(`[${context || 'ErrorHandler'}]`, error);
    }

    // Rastrear erro no Analytics
    if (trackError && typeof window !== 'undefined' && window.gtag) {
      analytics.error(
        errorType,
        `${context ? `[${context}] ` : ''}${errorMessage}`
      );
    }

    // Mostrar toast
    if (showToast) {
      toast.error(errorMessage, {
        duration: 5000,
      });
    }

    return {
      message: errorMessage,
      type: errorType,
      originalError: error,
    };
  }, []);

  const handleAsyncError = useCallback(async <T,>(
    asyncFn: () => Promise<T>,
    context?: string,
    options?: ErrorHandlerOptions
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, context, options);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
  };
};

