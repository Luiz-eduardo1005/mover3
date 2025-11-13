
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
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, User, Briefcase, List, FileText, BookOpen, AlertCircle, LogOut, Settings, Menu, X, Moon, Sun, MessageSquare } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Garantir que o tema seja aplicado corretamente
  useEffect(() => {
    // Se não houver tema salvo, usar o tema do sistema
    if (!theme) {
      setTheme('system');
    }
  }, [theme, setTheme]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
    setMobileMenuOpen(false);
  };
  return (
    <>
      {/* Beta Banner */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-center py-1.5 sm:py-2 px-2 sm:px-4 flex items-center justify-center gap-1 sm:gap-2 sticky top-0 z-50">
        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse flex-shrink-0" aria-hidden="true" />
        <span className="text-xs sm:text-sm font-semibold">
          ⚠️ PROJETO EM DESENVOLVIMENTO - VERSÃO BETA
        </span>
        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse flex-shrink-0" aria-hidden="true" />
      </div>
      
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center" aria-label="MOVER - Página inicial">
              <Briefcase className="h-8 w-8 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white font-heading">MOVER</span>
            </Link>
            <nav className="hidden md:ml-8 md:flex md:space-x-8" role="navigation" aria-label="Menu principal">
              <Link to="/" className="text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-2 text-sm font-medium" aria-label="Ir para página inicial">Início</Link>
              <Link to="/jobs" className="text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-2 text-sm font-medium" aria-label="Ver vagas disponíveis">Vagas</Link>
              <Link to="/companies" className="text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-2 text-sm font-medium" aria-label="Ver empresas">Empresas</Link>
              <Link to="/advertise" className="text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-2 text-sm font-medium" aria-label="Anunciar vaga">Anuncie</Link>
              <Link to="/courses" className="text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-2 text-sm font-medium" aria-label="Ver cursos disponíveis">Cursos</Link>
              <Link to="/curriculum" className="text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-2 text-sm font-medium" aria-label="Cadastrar meu currículo">Cadastrar Currículo</Link>
              <Link to="/about" className="text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-2 text-sm font-medium" aria-label="Sobre a plataforma MOVER">Sobre</Link>
            </nav>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                // Ciclo: system -> light -> dark -> system
                if (theme === 'system' || !theme) {
                  setTheme('light');
                } else if (theme === 'light') {
                  setTheme('dark');
                } else {
                  setTheme('system');
                }
              }}
              className="h-9 w-9 relative"
              aria-label={
                theme === 'dark' || resolvedTheme === 'dark' 
                  ? 'Ativar modo claro' 
                  : theme === 'light' || resolvedTheme === 'light'
                  ? 'Ativar modo escuro'
                  : 'Alternar tema manual'
              }
              title={
                theme === 'system' || !theme
                  ? 'Tema: Automático (clique para manual)'
                  : theme === 'light'
                  ? 'Tema: Claro (clique para escuro)'
                  : 'Tema: Escuro (clique para automático)'
              }
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Alternar tema</span>
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || user.email || 'Usuário'} />
                      <AvatarFallback>
                        {profile?.full_name 
                          ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                          : user.email?.charAt(0).toUpperCase() || 'U'
                        }
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.full_name || 'Usuário'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onSelect={() => navigate('/profile')}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={() => navigate('/applications')}
                    className="cursor-pointer"
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>Minhas Candidaturas</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={() => navigate('/messages')}
                    className="cursor-pointer"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Mensagens</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={() => navigate('/profile')}
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onSelect={handleSignOut}
                    className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="flex items-center" aria-label="Fazer login na plataforma">
                    <User className="h-4 w-4 mr-2" aria-hidden="true" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="flex items-center bg-brand-500 hover:bg-brand-600" aria-label="Cadastrar-se na plataforma MOVER">
                    Cadastre-se
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="flex md:hidden items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        // Ciclo: system -> light -> dark -> system
                        if (theme === 'system' || !theme) {
                          setTheme('light');
                        } else if (theme === 'light') {
                          setTheme('dark');
                        } else {
                          setTheme('system');
                        }
                      }}
                      className="h-9 w-9 relative"
                      aria-label={
                        theme === 'dark' || resolvedTheme === 'dark' 
                          ? 'Ativar modo claro' 
                          : theme === 'light' || resolvedTheme === 'light'
                          ? 'Ativar modo escuro'
                          : 'Alternar tema manual'
                      }
                      title={
                        theme === 'system' || !theme
                          ? 'Tema: Automático (clique para manual)'
                          : theme === 'light'
                          ? 'Tema: Claro (clique para escuro)'
                          : 'Tema: Escuro (clique para automático)'
                      }
                    >
                      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Alternar tema</span>
                    </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || user.email || 'Usuário'} />
                      <AvatarFallback>
                        {profile?.full_name 
                          ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                          : user.email?.charAt(0).toUpperCase() || 'U'
                        }
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.full_name || 'Usuário'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onSelect={() => {
                      navigate('/profile');
                      setMobileMenuOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={() => {
                      navigate('/applications');
                      setMobileMenuOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>Minhas Candidaturas</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={() => {
                      navigate('/messages');
                      setMobileMenuOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Mensagens</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={() => {
                      navigate('/profile');
                      setMobileMenuOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onSelect={handleSignOut}
                    className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="h-9 px-3">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="h-9 px-3 bg-brand-500 hover:bg-brand-600">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-9 w-9"
                  aria-label="Abrir menu de navegação"
                >
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Briefcase className="h-6 w-6 text-brand-600" />
                    <span>MOVER</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col space-y-4">
                  <Link 
                    to="/" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 py-2 border-b border-gray-100 dark:border-gray-800"
                  >
                    Início
                  </Link>
                  <Link 
                    to="/jobs" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 py-2 border-b border-gray-100 dark:border-gray-800"
                  >
                    Vagas
                  </Link>
                  <Link 
                    to="/companies" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 py-2 border-b border-gray-100 dark:border-gray-800"
                  >
                    Empresas
                  </Link>
                  <Link 
                    to="/advertise" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 py-2 border-b border-gray-100 dark:border-gray-800"
                  >
                    Anuncie
                  </Link>
                  <Link 
                    to="/courses" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 py-2 border-b border-gray-100 dark:border-gray-800"
                  >
                    Cursos
                  </Link>
                  <Link 
                    to="/curriculum" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 py-2 border-b border-gray-100 dark:border-gray-800"
                  >
                    Cadastrar Currículo
                  </Link>
                  <Link 
                    to="/about" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 py-2 border-b border-gray-100 dark:border-gray-800"
                  >
                    Sobre
                  </Link>
                  {!user && (
                    <div className="pt-4 space-y-3 border-t border-gray-200 mt-4">
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          <User className="mr-2 h-4 w-4" />
                          Login
                        </Button>
                      </Link>
                      <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full justify-start bg-brand-500 hover:bg-brand-600">
                          Cadastre-se
                        </Button>
                      </Link>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
