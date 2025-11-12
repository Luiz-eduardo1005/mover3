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

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mcvkfxpgrmraqsjrcuxu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_3uZOs5Nia5bBt_p1EdGIYA_oVXZBX4T';

// Configuração de persistência de sessão
const storageKey = 'mover-auth-session';

// Verificar se o usuário aceitou cookies
const getStorageType = () => {
  const cookieConsent = localStorage.getItem('cookieConsent');
  // Se não aceitou cookies, usar apenas sessionStorage (temporário)
  if (cookieConsent === 'declined') {
    return 'sessionStorage';
  }
  // Se aceitou ou ainda não escolheu, usar localStorage (persistente)
  return 'localStorage';
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? {
      getItem: (key: string) => {
        const storageType = getStorageType();
        if (storageType === 'localStorage') {
          return localStorage.getItem(key);
        }
        return sessionStorage.getItem(key);
      },
      setItem: (key: string, value: string) => {
        const storageType = getStorageType();
        if (storageType === 'localStorage') {
          localStorage.setItem(key, value);
        } else {
          sessionStorage.setItem(key, value);
        }
      },
      removeItem: (key: string) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      },
    } : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

