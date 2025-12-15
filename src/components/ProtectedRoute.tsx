/**
 * MOVER - Mobilidade e Oportunidades para Vagas com Empregabilidade e Respeito
 *
 * Rota protegida por autenticação e tipo de usuário (candidate | employer)
 */

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingPage from '@/pages/LoadingPage';
import { toast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  allowedUserTypes?: Array<'candidate' | 'employer'>;
  redirectPath?: string;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedUserTypes,
  redirectPath = '/login',
  children,
}) => {
  const { user, profile, loading } = useAuth();

  // Enquanto ainda está carregando sessão/perfil, mostra tela de loading
  if (loading) {
    return <LoadingPage />;
  }

  // Usuário não autenticado
  if (!user) {
    toast({
      title: 'Acesso restrito',
      description: 'Você precisa fazer login para acessar esta página.',
      variant: 'destructive',
    });
    return <Navigate to={redirectPath} replace />;
  }

  // Se houver restrição de tipo e já temos perfil carregado
  if (allowedUserTypes && profile && !allowedUserTypes.includes(profile.user_type)) {
    const isCandidateOnly = allowedUserTypes.includes('candidate') && !allowedUserTypes.includes('employer');
    toast({
      title: 'Acesso negado',
      description: `Esta página é apenas para ${isCandidateOnly ? 'candidatos' : 'empresas'}.`,
      variant: 'destructive',
    });

    // Redireciona para a área correta daquele usuário
    if (profile.user_type === 'employer') {
      return <Navigate to="/company/dashboard" replace />;
    }
    return <Navigate to="/profile" replace />;
  }

  // Se passou em todas as verificações, renderiza o conteúdo
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;


