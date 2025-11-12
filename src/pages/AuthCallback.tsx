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

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import LoadingPage from './LoadingPage';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    let mounted = true;

    const handleAuthCallback = async () => {
      try {
        // Aguardar um pouco para garantir que o Supabase processe o hash
        await new Promise(resolve => setTimeout(resolve, 200));

        // Processar o hash da URL para obter a sessão
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Erro ao processar callback:', error);
          if (mounted) {
            setProcessing(false);
            navigate('/login?error=auth_failed');
          }
          return;
        }

        if (session?.user) {
          // Verificar se o perfil já existe
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // Se não existe perfil, criar um
          if (!profile && profileError?.code === 'PGRST116') {
            const profileData = {
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || 
                        session.user.user_metadata?.name || 
                        '',
              avatar_url: session.user.user_metadata?.avatar_url || 
                        session.user.user_metadata?.picture || 
                        '',
              user_type: 'candidate', // Padrão para login via Google
            };

            const { error: insertError } = await supabase
              .from('profiles')
              .insert(profileData);
            
            if (insertError) {
              console.error('Erro ao criar perfil:', insertError);
            }
          }

          // Limpar o hash da URL após processar
          if (window.location.hash) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          
          if (mounted) {
            setProcessing(false);
            navigate('/profile', { replace: true });
          }
        } else {
          // Se não há sessão, aguardar um pouco mais e verificar novamente
          setTimeout(async () => {
            if (!mounted) return;
            
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession?.user) {
              setProcessing(false);
              navigate('/profile', { replace: true });
            } else {
              setProcessing(false);
              navigate('/login?error=no_session', { replace: true });
            }
          }, 1000);
        }
      } catch (error) {
        console.error('Erro inesperado:', error);
        if (mounted) {
          setProcessing(false);
          navigate('/login?error=unexpected', { replace: true });
        }
      }
    };

    handleAuthCallback();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return <LoadingPage />;
};

export default AuthCallback;

