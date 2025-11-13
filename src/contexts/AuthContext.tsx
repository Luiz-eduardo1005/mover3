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

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  user_type: 'candidate' | 'employer';
  profession: string | null;
  location: string | null;
  bio: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  skills: string[] | null;
  languages: any;
  company_name: string | null;
  company_size: string | null;
  company_description: string | null;
  profile_visible: boolean;
  resume_searchable: boolean;
  job_alerts_enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, userType: 'candidate' | 'employer', additionalData?: any) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Função auxiliar para tentar restaurar sessão do localStorage (memoizada com useCallback)
  const tryRestoreSessionFromStorage = useCallback(async () => {
    try {
      // Buscar todas as chaves relacionadas ao Supabase
      const sessionKeys = Object.keys(localStorage).filter(key => 
        key.includes('auth-token') || 
        key.includes('supabase.auth') ||
        (key.includes('sb-') && key.includes('auth'))
      );
      
      if (sessionKeys.length === 0) {
        return null;
      }
      
      console.log('🔍 Tentando restaurar sessão do localStorage...');
      
      // Tentar usar getUser() que pode funcionar mesmo com clock skew
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (user && !userError) {
        console.log('✅ Usuário restaurado do localStorage:', user.email);
        
        // Tentar obter a sessão novamente
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (session && !sessionError) {
          return session;
        }
        
        // Se não conseguiu a sessão mas tem usuário, tentar refresh
        if (user) {
          console.log('🔄 Tentando atualizar token...');
          const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshedSession && !refreshError) {
            console.log('✅ Sessão atualizada com sucesso!');
            return refreshedSession;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('❌ Erro ao tentar restaurar sessão:', error);
      return null;
    }
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Se o perfil não existe (PGRST116 = not found), criar um perfil básico
      if (error && error.code === 'PGRST116') {
        console.log('📝 Perfil não encontrado, criando perfil básico...');
        
        // Buscar dados do usuário para criar o perfil
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const profileData = {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || 
                      user.user_metadata?.name || 
                      user.email?.split('@')[0] || 
                      '',
            avatar_url: user.user_metadata?.avatar_url || 
                      user.user_metadata?.picture || 
                      null,
            user_type: user.user_metadata?.user_type || 'candidate',
            profile_visible: true,
            resume_searchable: false,
            job_alerts_enabled: true,
          };

          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert(profileData)
            .select()
            .single();

          if (insertError) {
            console.error('❌ Erro ao criar perfil:', insertError);
            return null;
          }

          console.log('✅ Perfil criado com sucesso');
          return newProfile as Profile;
        }
        
        return null;
      }

      if (error) {
        console.error('❌ Erro ao buscar perfil:', error);
        return null;
      }

      return data as Profile | null;
    } catch (error) {
      console.error('❌ Erro ao buscar perfil:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    let mounted = true;
    const loadingTimeoutRef = { current: null as NodeJS.Timeout | null };
    
    // Timeout de segurança para garantir que loading sempre termine
    loadingTimeoutRef.current = setTimeout(() => {
      if (mounted) {
        console.warn('⚠️ Timeout na verificação de sessão, finalizando loading...');
        setLoading(false);
      }
    }, 10000); // 10 segundos máximo

    // Verificar sessão atual ao carregar
    const initializeAuth = async () => {
      try {
        // Primeira tentativa: getSession padrão
        let { data: { session }, error } = await supabase.auth.getSession();
        
        // Se não encontrou sessão ou houve erro, tentar restaurar do localStorage
        if (!session || error) {
          console.log('⚠️ Sessão não encontrada ou erro, tentando restaurar...');
          const restoredSession = await tryRestoreSessionFromStorage();
          if (restoredSession) {
            session = restoredSession;
            error = null;
          }
        }
        
        if (!mounted) return;
        
        // Limpar timeout se a verificação completar
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        
        // Se ainda há erro e não há sessão, limpar tudo
        if (error && !session) {
          console.error('❌ Erro ao obter sessão:', error);
          // Não limpar imediatamente - tentar getUser como última tentativa
          const { data: { user: lastUser } } = await supabase.auth.getUser();
          if (!lastUser) {
            setSession(null);
            setUser(null);
            setProfile(null);
            setLoading(false);
            return;
          }
        }
        
        if (session?.user) {
          console.log('✅ Sessão encontrada, restaurando usuário...', session.user.email);
          
          // Garantir que a sessão está salva
          const sessionKeys = Object.keys(localStorage).filter(key => 
            key.includes('auth-token') || key.includes('supabase.auth')
          );
          
          if (sessionKeys.length === 0) {
            console.warn('⚠️ Sessão não encontrada no localStorage, forçando salvamento...');
            // Forçar salvamento da sessão
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
            });
            
            if (setSessionError) {
              console.error('❌ Erro ao salvar sessão na inicialização:', setSessionError);
            } else {
              console.log('✅ Sessão salva com sucesso na inicialização!');
            }
          } else {
            console.log('✅ Sessão confirmada no localStorage na inicialização');
          }
          
          setSession(session);
          setUser(session.user);
          
          // Buscar perfil
          try {
            const profileData = await fetchProfile(session.user.id);
            if (mounted) {
              setProfile(profileData);
              console.log('✅ Perfil carregado:', profileData ? 'Sim' : 'Não encontrado');
            }
          } catch (error) {
            console.error('❌ Erro ao buscar perfil na inicialização:', error);
            if (mounted) {
              setProfile(null);
            }
          }
        } else {
          // Última tentativa: verificar se há usuário mesmo sem sessão válida
          const { data: { user: fallbackUser } } = await supabase.auth.getUser();
          if (fallbackUser) {
            console.log('⚠️ Usuário encontrado mas sem sessão válida, tentando refresh...');
            const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
            if (refreshedSession) {
              setSession(refreshedSession);
              setUser(refreshedSession.user);
              console.log('✅ Sessão restaurada após refresh!');
              
              // Buscar perfil
              try {
                const profileData = await fetchProfile(refreshedSession.user.id);
                if (mounted) {
                  setProfile(profileData);
                }
              } catch (error) {
                console.error('❌ Erro ao buscar perfil:', error);
              }
            } else {
              console.log('ℹ️ Nenhuma sessão encontrada após todas as tentativas');
              setSession(null);
              setUser(null);
              setProfile(null);
            }
          } else {
            console.log('ℹ️ Nenhuma sessão encontrada');
            setSession(null);
            setUser(null);
            setProfile(null);
          }
        }
      } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        // Última tentativa antes de limpar tudo
        const { data: { user: lastUser } } = await supabase.auth.getUser();
        if (lastUser) {
          const { data: { session: lastSession } } = await supabase.auth.getSession();
          if (lastSession) {
            setSession(lastSession);
            setUser(lastSession.user);
            console.log('✅ Sessão recuperada após erro!');
          } else {
            if (mounted) {
              setSession(null);
              setUser(null);
              setProfile(null);
            }
          }
        } else {
          if (mounted) {
            setSession(null);
            setUser(null);
            setProfile(null);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Ouvir mudanças de autenticação (login, logout, etc)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Mudança de estado de autenticação:', event);
      
      if (!mounted) return;
      
      // Limpar timeout se houver mudança de estado
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      // Se há uma sessão, garantir que está salva
      if (session) {
        console.log('💾 Verificando persistência da sessão...');
        // Verificar se a sessão foi salva no localStorage
        const sessionKeys = Object.keys(localStorage).filter(key => 
          key.includes('auth-token') || key.includes('supabase.auth')
        );
        
        if (sessionKeys.length === 0) {
          console.warn('⚠️ Sessão não encontrada no localStorage, forçando salvamento...');
          // Forçar salvamento da sessão
          const { error: setSessionError } = await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          });
          
          if (setSessionError) {
            console.error('❌ Erro ao salvar sessão:', setSessionError);
            // Tentar novamente após um pequeno delay
            setTimeout(async () => {
              const { error: retryError } = await supabase.auth.setSession({
                access_token: session.access_token,
                refresh_token: session.refresh_token,
              });
              if (!retryError) {
                console.log('✅ Sessão salva após retry!');
              }
            }, 500);
          } else {
            console.log('✅ Sessão salva com sucesso!');
          }
        } else {
          console.log('✅ Sessão confirmada no localStorage');
        }
      } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        // Se foi deslogado ou token foi atualizado, verificar se ainda há sessão
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession) {
          console.log('✅ Sessão encontrada após evento:', event);
          setSession(currentSession);
          setUser(currentSession.user);
        }
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('✅ Usuário autenticado:', session.user.email);
        try {
          const profileData = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(profileData);
            console.log('✅ Perfil atualizado:', profileData ? 'Sim' : 'Não encontrado');
          }
        } catch (error) {
          console.error('❌ Erro ao buscar perfil na mudança de estado:', error);
          if (mounted) {
            setProfile(null);
          }
        }
      } else {
        console.log('ℹ️ Usuário deslogado');
        if (mounted) {
          setProfile(null);
        }
      }
      
      if (mounted) {
        setLoading(false);
      }
    });

    // Listener para salvar sessão antes de fechar a página
    const handleBeforeUnload = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Forçar salvamento da sessão antes de fechar
          await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          });
          console.log('💾 Sessão salva antes de fechar a página');
        }
      } catch (error) {
        console.error('❌ Erro ao salvar sessão antes de fechar:', error);
      }
    };

    // Adicionar listener para beforeunload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    // Listener para visibility change (quando a aba volta ao foco)
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        try {
          // Verificar e restaurar sessão quando a aba volta ao foco
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setSession(session);
            setUser(session.user);
            console.log('✅ Sessão restaurada ao voltar à aba');
          } else {
            // Tentar restaurar do localStorage
            const restoredSession = await tryRestoreSessionFromStorage();
            if (restoredSession) {
              setSession(restoredSession);
              setUser(restoredSession.user);
              console.log('✅ Sessão restaurada do localStorage ao voltar à aba');
            }
          }
        } catch (error) {
          console.error('❌ Erro ao restaurar sessão:', error);
        }
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      mounted = false;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      subscription.unsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  }, [tryRestoreSessionFromStorage]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Garantir que a sessão foi salva
    if (data?.session) {
      console.log('✅ Login realizado, sessão salva automaticamente');
      // Verificar se foi salva no localStorage
      const sessionKey = Object.keys(localStorage).find(key => key.includes('auth-token'));
      if (sessionKey) {
        console.log('✅ Sessão confirmada no localStorage');
      } else {
        console.warn('⚠️ Sessão não encontrada, forçando salvamento...');
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }
    }
    
    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    userType: 'candidate' | 'employer',
    additionalData?: any
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType,
          ...additionalData,
        },
      },
    });

    if (!error && data.user) {
      // Criar perfil na tabela de perfis
      const profileData = {
        id: data.user.id,
        email: data.user.email,
        user_type: userType,
        ...additionalData,
      };

      await supabase.from('profiles').insert(profileData);
    }

    return { error };
  };

  const signInWithGoogle = async () => {
    try {
      // Garantir que estamos usando a URL atual correta (com porta)
      const currentOrigin = window.location.origin;
      const redirectUrl = `${currentOrigin}/auth/callback`;
      
      console.log('🔐 Iniciando login com Google...');
      console.log('📍 URL de redirecionamento:', redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('❌ Erro ao fazer login com Google:', error);
        throw error;
      }
      
      // Se não houver erro, o usuário será redirecionado automaticamente
      console.log('✅ Redirecionando para Google...');
    } catch (error: any) {
      console.error('❌ Erro ao fazer login com Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const userId = user?.id;
      
      // Fazer signOut no Supabase PRIMEIRO (importante para OAuth)
      await supabase.auth.signOut();
      
      // Limpar todas as chaves relacionadas ao Supabase
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('supabase') || 
          key.includes('sb-') || 
          key.includes('auth-token') ||
          key.includes('auth') ||
          key.startsWith('supabase.')
        )) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Limpar sessionStorage também
      const sessionKeysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (
          key.includes('supabase') || 
          key.includes('sb-') || 
          key.includes('auth-token') ||
          key.includes('auth') ||
          key.startsWith('supabase.')
        )) {
          sessionKeysToRemove.push(key);
        }
      }
      sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));

      // Limpar vagas salvas do usuário
      if (userId) {
        localStorage.removeItem(`saved_jobs_${userId}`);
      }

      // Limpar cookies relacionados ao OAuth (se houver)
      document.cookie.split(";").forEach((c) => {
        const cookieName = c.trim().split("=")[0];
        if (cookieName.includes('auth') || cookieName.includes('session')) {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
      
      // Limpar estados
      setUser(null);
      setSession(null);
      setProfile(null);
      setLoading(false);
      
      // Forçar reload da página para garantir limpeza completa (especialmente para OAuth)
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, limpar estados locais e redirecionar
      setUser(null);
      setSession(null);
      setProfile(null);
      setLoading(false);
      window.location.href = '/login';
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

