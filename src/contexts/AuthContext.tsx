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

import React, { createContext, useContext, useEffect, useState } from 'react';
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

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }

      return data as Profile | null;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
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
    // Verificar sessão atual
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      }
      
      setLoading(false);
    });

    // Ouvir mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
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
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    // Limpar localStorage relacionado à sessão
    localStorage.removeItem('sb-dqsgxbheslqmqsvmmqfk-auth-token');
    sessionStorage.removeItem('sb-dqsgxbheslqmqsvmmqfk-auth-token');
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

