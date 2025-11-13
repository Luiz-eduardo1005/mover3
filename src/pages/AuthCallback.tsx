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

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://dqsgxbheslqmqsvmmqfk.supabase.co';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    let mounted = true;

    const handleAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlError = urlParams.get('error');
        const errorCode = urlParams.get('error_code');
        const errorDescription = urlParams.get('error_description');
        
        if (urlError) {
          if (mounted) {
            setProcessing(false);
            let errorMessage = 'auth_failed';
            if (urlError === 'server_error' || errorCode === 'unexpected_failure') {
              errorMessage = 'server_error';
            }
            navigate(`/login?error=${errorMessage}&details=${encodeURIComponent(errorDescription || '')}`);
          }
          return;
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));

        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          if (mounted) {
            setProcessing(false);
            navigate('/login?error=auth_failed');
          }
          return;
        }

        if (session?.user) {
          if (window.location.hash) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data: profile, error: profileError }) => {
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
                  user_type: 'candidate',
                };

                supabase
                  .from('profiles')
                  .insert(profileData)
                  .catch(err => console.error('Erro ao criar perfil:', err));
              }
            })
            .catch(() => {});
          
          if (mounted) {
            setProcessing(false);
            navigate('/profile', { replace: true });
          }
        } else {
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

