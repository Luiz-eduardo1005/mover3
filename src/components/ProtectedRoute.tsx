/**
 * MOVER - Mobilidade e Oportunidades para Vagas com Empregabilidade e Respeito
 * 
 * Desenvolvido por Luis Roberto Lins de Almeida e equipe ADS FAMetro
 * Curso: Análise e Desenvolvimento de Sistemas (ADS)
 * Instituição: FAMETRO - Faculdade Metropolitana de Manaus
 * Período: 2º Período - 2025
 * 
 * Copyright (c) 2025 Luis Roberto Lins de Almeida e equipe ADS FAMetro
 */

import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import LoadingPage from '@/pages/LoadingPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: ('candidate' | 'employer')[];
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedUserTypes = ['candidate', 'employer'],
  requireAuth = true 
}) => {
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && requireAuth) {
      // Se não está autenticado
      if (!user) {
        toast({
          title: "Acesso restrito",
          description: "Você precisa fazer login para acessar esta página.",
          variant: "destructive",
        });
        return;
      }

      // Se não tem perfil carregado ainda, aguardar
      if (!profile) {
        return;
      }

      // Verificar se o tipo de usuário tem permissão
      if (profile.user_type && !allowedUserTypes.includes(profile.user_type)) {
        const userTypeName = profile.user_type === 'candidate' ? 'candidato' : 'empresa';
        const requiredTypeName = allowedUserTypes.length === 1 
          ? (allowedUserTypes[0] === 'candidate' ? 'candidato' : 'empresa')
          : 'tipo específico';
        
        toast({
          title: "Acesso negado",
          description: `Esta página é apenas para ${requiredTypeName}. Você está logado como ${userTypeName}.`,
          variant: "destructive",
        });
      }
    }
  }, [user, profile, loading, allowedUserTypes, requireAuth, toast]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return <LoadingPage />;
  }

  // Se requer autenticação e não está autenticado
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Se requer autenticação e tem perfil, verificar tipo de usuário
  if (requireAuth && profile) {
    if (profile.user_type && !allowedUserTypes.includes(profile.user_type)) {
      // Redirecionar baseado no tipo de usuário
      if (profile.user_type === 'candidate') {
        return <Navigate to="/profile" replace />;
      } else {
        return <Navigate to="/advertise" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;

