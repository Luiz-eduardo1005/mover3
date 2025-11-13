
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
import { Briefcase, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [userType, setUserType] = useState<'candidate' | 'employer'>('candidate');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    companyName: '',
    companySize: '',
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      toast({
        title: "Erro ao criar conta",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erro ao criar conta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const additionalData = userType === 'candidate' 
      ? {
          full_name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
        }
      : {
          company_name: formData.companyName,
          company_size: formData.companySize,
          phone: formData.phone,
        };

    const { error } = await signUp(formData.email, formData.password, userType, additionalData);

    if (error) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Não foi possível criar a conta. Tente novamente.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar sua conta.",
      });
      navigate('/login');
    }

    setLoading(false);
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Não precisa setar loading como false aqui porque o usuário será redirecionado
    } catch (error: any) {
      let errorMessage = "Não foi possível fazer registro com Google. Tente novamente.";
      
      if (error?.message?.includes('provider is not enabled')) {
        errorMessage = "O login com Google não está habilitado. Por favor, habilite no painel do Supabase.";
      } else if (error?.message?.includes('redirect_uri_mismatch')) {
        errorMessage = "Erro de configuração: URL de redirecionamento não corresponde. Verifique as configurações.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro ao fazer registro com Google",
        description: errorMessage,
        variant: "destructive",
      });
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-brand-50 flex flex-col items-center justify-center px-4 py-12">
      <Link to="/" className="flex items-center mb-8">
        <Briefcase className="h-10 w-10 text-brand-600" />
        <span className="ml-2 text-2xl font-bold text-gray-900">MOVER</span>
      </Link>
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crie sua conta</CardTitle>
          <CardDescription>
            Cadastre-se para acessar todas as funcionalidades
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="candidate" onValueChange={(value) => setUserType(value as 'candidate' | 'employer')} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 mx-4">
            <TabsTrigger value="candidate">Candidato</TabsTrigger>
            <TabsTrigger value="employer">Empresa</TabsTrigger>
          </TabsList>
          
          <TabsContent value="candidate">
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Nome</Label>
                      <Input 
                        id="first-name" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Sobrenome</Label>
                      <Input 
                        id="last-name" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="(XX) XXXXX-XXXX" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-confirm">Confirme a senha</Label>
                    <Input 
                      id="password-confirm" 
                      type="password" 
                      value={formData.passwordConfirm}
                      onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                      required 
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm">
                      Ao criar a conta, concordo com os{' '}
                      <Link to="/terms" className="text-brand-600 hover:underline">
                        Termos de Uso
                      </Link>{' '}
                      e{' '}
                      <Link to="/privacy" className="text-brand-600 hover:underline">
                        Política de Privacidade
                      </Link>
                    </Label>
                  </div>
                  
                  <Button type="submit" className="w-full bg-brand-500 hover:bg-brand-600" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      'Criar conta'
                    )}
                  </Button>
                </div>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Ou continue com</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleGoogleRegister}
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
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nome da empresa</Label>
                    <Input 
                      id="company-name" 
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email corporativo</Label>
                    <Input 
                      id="company-email" 
                      type="email" 
                      placeholder="contato@empresa.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Telefone</Label>
                    <Input 
                      id="company-phone" 
                      type="tel" 
                      placeholder="(XX) XXXX-XXXX" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-size">Tamanho da empresa</Label>
                    <select 
                      id="company-size" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.companySize}
                      onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                      required
                    >
                      <option value="">Selecione o tamanho</option>
                      <option value="1-10">1-10 funcionários</option>
                      <option value="11-50">11-50 funcionários</option>
                      <option value="51-200">51-200 funcionários</option>
                      <option value="201-500">201-500 funcionários</option>
                      <option value="501-1000">501-1000 funcionários</option>
                      <option value="1000+">1000+ funcionários</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-password">Senha</Label>
                    <Input 
                      id="company-password" 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-password-confirm">Confirme a senha</Label>
                    <Input 
                      id="company-password-confirm" 
                      type="password" 
                      value={formData.passwordConfirm}
                      onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                      required 
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="company-terms" required />
                    <Label htmlFor="company-terms" className="text-sm">
                      Ao criar a conta, concordo com os{' '}
                      <Link to="/terms" className="text-brand-600 hover:underline">
                        Termos de Uso
                      </Link>{' '}
                      e{' '}
                      <Link to="/privacy" className="text-brand-600 hover:underline">
                        Política de Privacidade
                      </Link>
                    </Label>
                  </div>
                  
                  <Button type="submit" className="w-full bg-brand-500 hover:bg-brand-600" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      'Registrar empresa'
                    )}
                  </Button>
                </div>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Ou continue com</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleGoogleRegister}
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
        
        <CardFooter className="flex justify-center border-t p-6">
          <span className="text-sm text-gray-600">
            Já tem conta?{' '}
            <Link to="/login" className="text-brand-600 hover:underline font-medium">
              Faça login
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
