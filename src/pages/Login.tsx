
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

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
  const [resendingEmail, setResendingEmail] = useState(false);
  const { signIn, signInWithGoogle, resendConfirmationEmail, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Verificar erros na URL ao carregar a página
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const details = urlParams.get('details');
    
    if (error) {
      let errorMessage = "Não foi possível fazer login. Tente novamente.";
      
      if (error === 'server_error') {
        errorMessage = "Erro no servidor de autenticação. Verifique se as credenciais do Google OAuth estão configuradas corretamente no Supabase.";
      } else if (error === 'auth_failed') {
        errorMessage = "Falha na autenticação. Tente novamente.";
      } else if (error === 'no_session') {
        errorMessage = "Não foi possível criar a sessão. Tente fazer login novamente.";
      }
      
      if (details) {
        errorMessage += ` Detalhes: ${decodeURIComponent(details)}`;
      }
      
      toast({
        title: "Erro ao fazer login",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Limpar a URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent, userType: 'candidate' | 'employer') => {
    e.preventDefault();
    setLoading(true);

    const sanitizedEmail = email.trim();
    const { error } = await signIn(sanitizedEmail, password);

    if (error) {
      const normalizedMessage = error.message?.toLowerCase() || '';
      const requiresConfirmation =
        normalizedMessage.includes('confirm') ||
        normalizedMessage.includes('verification') ||
        normalizedMessage.includes('not confirmed');

      if (requiresConfirmation) {
        setPendingVerificationEmail(sanitizedEmail);
      } else {
        setPendingVerificationEmail(null);
      }

      toast({
        title: "Erro ao fazer login",
        description: error.message || "Credenciais inválidas. Verifique seu email e senha.",
        variant: "destructive",
      });
    } else {
      setPendingVerificationEmail(null);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });

      try {
        // Dar um tempo para o Supabase propagar a sessão
        await new Promise(resolve => setTimeout(resolve, 500));
        await refreshProfile();
        await new Promise(resolve => setTimeout(resolve, 300));

        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', currentUser.id)
            .single();

          if (profileData?.user_type === 'employer') {
            navigate('/company/dashboard', { replace: true });
          } else {
            navigate('/profile', { replace: true });
          }
        } else {
          navigate('/profile', { replace: true });
        }
      } catch (err) {
        console.error('Erro ao redirecionar após login:', err);
        navigate('/profile', { replace: true });
      }
    }

    setLoading(false);
  };

  const handleResendConfirmation = async () => {
    if (!pendingVerificationEmail) return;
    setResendingEmail(true);
    const { error } = await resendConfirmationEmail(pendingVerificationEmail);

    if (error) {
      toast({
        title: "Erro ao reenviar confirmação",
        description: error.message || "Não foi possível reenviar o email. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email reenviado",
        description: "Verifique sua caixa de entrada e confirme seu cadastro.",
      });
    }

    setResendingEmail(false);
  };

  const renderVerificationAlert = () => {
    if (!pendingVerificationEmail) return null;
    return (
      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Confirme seu email</p>
            <p className="mt-1 text-sm opacity-90">
              Enviamos um link de confirmação para <span className="font-medium">{pendingVerificationEmail}</span>.
              Confirme o endereço para ativar sua conta.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 border-amber-400 text-amber-700 hover:bg-amber-100 dark:border-amber-400/60 dark:text-amber-200 dark:hover:bg-amber-500/20"
              onClick={handleResendConfirmation}
              disabled={resendingEmail}
            >
              {resendingEmail ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Reenviando...
                </>
              ) : (
                'Reenviar email de confirmação'
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Não precisa setar loading como false aqui porque o usuário será redirecionado
    } catch (error: any) {
      let errorMessage = "Não foi possível fazer login com Google. Tente novamente.";
      
      if (error?.message?.includes('provider is not enabled')) {
        errorMessage = "O login com Google não está habilitado. Por favor, habilite no painel do Supabase.";
      } else if (error?.message?.includes('redirect_uri_mismatch')) {
        errorMessage = "Erro de configuração: URL de redirecionamento não corresponde. Verifique as configurações.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro ao fazer login com Google",
        description: errorMessage,
        variant: "destructive",
      });
      setGoogleLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-brand-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4 py-6 sm:py-12">
      <Link to="/" className="flex items-center mb-6 sm:mb-8" aria-label="MOVER - Voltar para página inicial">
        <Briefcase className="h-8 w-8 sm:h-10 sm:w-10 text-brand-600 dark:text-brand-400" aria-hidden="true" />
        <span className="ml-2 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-heading">MOVER</span>
      </Link>
      
      <Card className="w-full max-w-md shadow-lg bg-white dark:bg-gray-800">
        <CardHeader className="text-center p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-heading text-gray-900 dark:text-white">Entrar na sua conta</CardTitle>
          <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Digite suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="candidate" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 mx-4">
            <TabsTrigger value="candidate">Candidato</TabsTrigger>
            <TabsTrigger value="employer">Empresa</TabsTrigger>
          </TabsList>
          
          <TabsContent value="candidate">
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, 'candidate')}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      <Link to="/forgot-password" className="text-sm text-brand-600 hover:underline">
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm">Lembrar de mim</Label>
                  </div>
                  
                  <Button type="submit" className="w-full bg-brand-500 hover:bg-brand-600" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </div>
              </form>
              
              {renderVerificationAlert()}
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">Ou continue com</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                  >
                    {googleLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="employer">
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, 'employer')}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employer-email">Email corporativo</Label>
                    <Input 
                      id="employer-email" 
                      type="email" 
                      placeholder="empresa@exemplo.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="employer-password">Senha</Label>
                      <Link to="/forgot-password" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <Input 
                      id="employer-password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="employer-remember" />
                    <Label htmlFor="employer-remember" className="text-sm">Lembrar de mim</Label>
                  </div>
                  
                  <Button type="submit" className="w-full bg-brand-500 hover:bg-brand-600" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar como Empresa'
                    )}
                  </Button>
                </div>
              </form>
              
              {renderVerificationAlert()}

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">Ou continue com</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                  >
                    {googleLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex justify-center border-t dark:border-gray-700 p-6">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Não tem conta?{' '}
            <Link to="/register" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">
              Registre-se
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
