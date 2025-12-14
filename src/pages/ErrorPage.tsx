/**
 * MOVER - Error Page Component
 * 
 * Desenvolvido por Luis Roberto Lins de Almeida e equipe ADS FAMetro
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from 'lucide-react';

interface ErrorPageProps {
  statusCode?: 404 | 500 | 403 | 503;
  title?: string;
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  statusCode = 404,
  title,
  message,
  showRetry = false,
  onRetry,
}) => {
  const navigate = useNavigate();

  const errorConfig = {
    404: {
      title: title || 'Página não encontrada',
      message: message || 'A página que você está procurando não existe ou foi movida.',
      icon: '🔍',
    },
    500: {
      title: title || 'Erro interno do servidor',
      message: message || 'Algo deu errado no nosso servidor. Nossa equipe foi notificada e está trabalhando para resolver.',
      icon: '⚠️',
    },
    403: {
      title: title || 'Acesso negado',
      message: message || 'Você não tem permissão para acessar esta página.',
      icon: '🔒',
    },
    503: {
      title: title || 'Serviço indisponível',
      message: message || 'O serviço está temporariamente indisponível. Tente novamente em alguns instantes.',
      icon: '🔧',
    },
  };

  const config = errorConfig[statusCode] || errorConfig[404];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-grow flex items-center justify-center p-4 sm:p-8" role="main" aria-label="Conteúdo principal">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            <CardTitle className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              {statusCode}
            </CardTitle>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              {config.title}
            </h2>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              {config.message}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="w-full sm:w-auto"
                aria-label="Voltar para página anterior"
              >
                <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                Voltar
              </Button>
              
              <Link to="/">
                <Button
                  className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600"
                  aria-label="Ir para página inicial"
                >
                  <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                  Página Inicial
                </Button>
              </Link>

              {showRetry && onRetry && (
                <Button
                  onClick={onRetry}
                  variant="outline"
                  className="w-full sm:w-auto"
                  aria-label="Tentar novamente"
                >
                  <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                  Tentar Novamente
                </Button>
              )}
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Se o problema persistir, entre em contato conosco através do{' '}
                <Link to="/about" className="text-brand-600 dark:text-brand-400 hover:underline">
                  formulário de contato
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ErrorPage;

