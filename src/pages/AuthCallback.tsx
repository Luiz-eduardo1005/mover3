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
        console.log('🔄 Processando callback de autenticação...');
        console.log('📍 URL atual:', window.location.href);
        
        // Verificar se há erro na URL (query params)
        const urlParams = new URLSearchParams(window.location.search);
        const urlError = urlParams.get('error');
        const errorCode = urlParams.get('error_code');
        const errorDescription = urlParams.get('error_description');
        
        if (urlError) {
          console.error('❌ Erro na URL do callback:');
          console.error('   - Error:', urlError);
          console.error('   - Code:', errorCode);
          console.error('   - Description:', errorDescription);
          
          if (mounted) {
            setProcessing(false);
            // Mostrar mensagem mais específica
            let errorMessage = 'auth_failed';
            if (urlError === 'server_error' || errorCode === 'unexpected_failure') {
              errorMessage = 'server_error';
            }
            navigate(`/login?error=${errorMessage}&details=${encodeURIComponent(errorDescription || '')}`);
          }
          return;
        }
        
        // Aguardar um pouco para garantir que o Supabase processe o hash
        await new Promise(resolve => setTimeout(resolve, 500));

        // Processar o hash da URL para obter a sessão
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('📦 Sessão recebida:', session ? 'Sim' : 'Não');
        if (session?.user) {
          console.log('👤 Usuário:', session.user.email);
        }

        if (error) {
          console.error('❌ Erro ao processar callback:', error);
          console.error('   - Message:', error.message);
          console.error('   - Status:', error.status);
          if (mounted) {
            setProcessing(false);
            navigate('/login?error=auth_failed');
          }
          return;
        }

        if (session?.user) {
          console.log('✅ Sessão recebida com sucesso!', session.user.email);
          
          // Limpar o hash da URL imediatamente
          if (window.location.hash) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          
          // Verificar se o perfil já existe (sem bloquear)
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data: profile, error: profileError }) => {
              // Se não existe perfil, criar um (em background, não bloqueia)
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
            .catch(() => {
              // Ignorar erros de perfil, não bloqueia o login
            });
          
          // Redirecionar imediatamente - não esperar
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

