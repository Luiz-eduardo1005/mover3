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

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Briefcase, Building2, BookOpen, User, MessageSquare, FileText } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  showWhenLoggedIn?: boolean;
  showWhenLoggedOut?: boolean;
}

const QuickNavigation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, session, loading } = useAuth();
  const isAuthenticated = !loading && user && session;

  // Definir links baseado no estado de autenticação
  const navigationItems: NavigationItem[] = isAuthenticated
    ? [
        { id: 'home', label: 'Início', path: '/', icon: <Home className="w-4 h-4" />, showWhenLoggedIn: true },
        { id: 'jobs', label: 'Vagas', path: '/jobs', icon: <Briefcase className="w-4 h-4" />, showWhenLoggedIn: true },
        { id: 'companies', label: 'Empresas', path: '/companies', icon: <Building2 className="w-4 h-4" />, showWhenLoggedIn: true },
        { id: 'courses', label: 'Cursos', path: '/courses', icon: <BookOpen className="w-4 h-4" />, showWhenLoggedIn: true },
        { id: 'profile', label: 'Perfil', path: '/profile', icon: <User className="w-4 h-4" />, showWhenLoggedIn: true },
        { id: 'messages', label: 'Mensagens', path: '/messages', icon: <MessageSquare className="w-4 h-4" />, showWhenLoggedIn: true },
        { id: 'applications', label: 'Candidaturas', path: '/applications', icon: <FileText className="w-4 h-4" />, showWhenLoggedIn: true },
      ]
    : [
        { id: 'home', label: 'Início', path: '/', icon: <Home className="w-4 h-4" />, showWhenLoggedOut: true },
        { id: 'jobs', label: 'Vagas', path: '/jobs', icon: <Briefcase className="w-4 h-4" />, showWhenLoggedOut: true },
        { id: 'companies', label: 'Empresas', path: '/companies', icon: <Building2 className="w-4 h-4" />, showWhenLoggedOut: true },
        { id: 'courses', label: 'Cursos', path: '/courses', icon: <BookOpen className="w-4 h-4" />, showWhenLoggedOut: true },
      ];

  // Detectar scroll e mostrar/esconder componente
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      // Mostrar após 300px de scroll
      setIsVisible(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Atualizar tab ativa baseado na rota atual
  useEffect(() => {
    const currentPath = location.pathname;
    const items = isAuthenticated
      ? [
          { id: 'home', path: '/' },
          { id: 'jobs', path: '/jobs' },
          { id: 'companies', path: '/companies' },
          { id: 'courses', path: '/courses' },
          { id: 'profile', path: '/profile' },
          { id: 'messages', path: '/messages' },
          { id: 'applications', path: '/applications' },
        ]
      : [
          { id: 'home', path: '/' },
          { id: 'jobs', path: '/jobs' },
          { id: 'companies', path: '/companies' },
          { id: 'courses', path: '/courses' },
        ];
    
    // Ordenar por tamanho do path (maior primeiro) para evitar matches incorretos
    const sortedItems = [...items].sort((a, b) => b.path.length - a.path.length);
    
    const activeItem = sortedItems.find(item => {
      if (item.path === '/') {
        return currentPath === '/';
      }
      return currentPath.startsWith(item.path);
    });
    setActiveTab(activeItem?.id || '');
  }, [location.pathname, isAuthenticated]);

  // Calcular posição do glider baseado no tab ativo
  const getGliderPosition = () => {
    const activeIndex = navigationItems.findIndex(item => item.id === activeTab);
    return activeIndex >= 0 ? activeIndex * 100 : 0;
  };

  const handleTabClick = (item: NavigationItem) => {
    setActiveTab(item.id);
    navigate(item.path);
    // Scroll suave para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Não mostrar em páginas de autenticação
  const hideOnPaths = ['/login', '/register', '/auth/callback', '/loading'];
  if (hideOnPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <div className="relative flex bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 rounded-full px-1 sm:px-2 py-1.5 sm:py-2 border border-gray-200 dark:border-gray-700 max-w-[95vw] overflow-x-auto scrollbar-hide">
        {/* Glider */}
        <div
          className="absolute h-7 sm:h-8 bg-brand-100 dark:bg-brand-900/30 rounded-full transition-all duration-300 ease-out z-0"
          style={{
            width: `${100 / navigationItems.length}%`,
            transform: `translateX(${getGliderPosition()}%)`,
          }}
        />

        {/* Tabs */}
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item)}
              className={`
                relative z-10 flex flex-col items-center justify-center h-7 sm:h-8 px-2 sm:px-3 min-w-[50px] sm:min-w-[60px] 
                text-xs font-medium rounded-full transition-colors duration-200 flex-shrink-0
                ${
                  isActive
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
              aria-label={`Ir para ${item.label}`}
            >
              <span className="flex items-center justify-center mb-0.5">
                {item.icon}
              </span>
              <span className="text-[9px] sm:text-[10px] leading-tight whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickNavigation;

