
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

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, MapPin, Clock, CheckCircle, XCircle, 
  Eye, FileSearch, Calendar, MessageSquare, ArrowRight 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import LoadingPage from './LoadingPage';

// Status timeline com ícones e cores
const statusConfig = {
  pending: {
    label: 'Enviada',
    icon: FileSearch,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    description: 'Sua candidatura foi enviada e está aguardando análise'
  },
  viewed: {
    label: 'Visualizada',
    icon: Eye,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    description: 'A empresa visualizou sua candidatura'
  },
  reviewing: {
    label: 'Em análise',
    icon: FileSearch,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    description: 'Sua candidatura está sendo analisada pela empresa'
  },
  interview: {
    label: 'Entrevista',
    icon: Calendar,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    description: 'Você foi selecionado para uma entrevista'
  },
  accepted: {
    label: 'Aprovada',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    description: 'Parabéns! Sua candidatura foi aprovada'
  },
  rejected: {
    label: 'Rejeitada',
    icon: XCircle,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    description: 'Infelizmente sua candidatura não foi selecionada'
  }
};

const Applications = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Só redirecionar se realmente não houver usuário após o loading terminar
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  // Mostrar loading apenas enquanto está verificando autenticação
  // Se o usuário existe mas o perfil não, ainda assim mostrar a página
  if (loading && !user) {
    return <LoadingPage />;
  }

  // Se não há usuário após loading, não renderizar nada (será redirecionado)
  if (!user) {
    return null;
  }

  // Buscar candidaturas do usuário
  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Mock data por enquanto - substituir por query real do Supabase quando tabela estiver criada
      const mockApplications = [
        {
          id: '1',
          job_id: '1',
          job: {
            title: 'Desenvolvedor Full Stack',
            company_name: 'TechSolutions',
            location: 'Manaus, AM'
          },
          status: 'reviewing',
          applied_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          job_id: '2',
          job: {
            title: 'Analista de Marketing Digital',
            company_name: 'Empresa Inovadora',
            location: 'Manaus, AM'
          },
          status: 'viewed',
          applied_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          job_id: '3',
          job: {
            title: 'Gerente de Vendas',
            company_name: 'VendaMais',
            location: 'Manaus, AM'
          },
          status: 'pending',
          applied_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          job_id: '4',
          job: {
            title: 'Assistente Administrativo',
            company_name: 'AdminPro',
            location: 'Manaus, AM'
          },
          status: 'rejected',
          applied_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      return mockApplications;
    },
    enabled: !!user?.id
  });

  if (loading || isLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return null;
  }

  // Agrupar candidaturas por status
  const groupedApplications = {
    all: applications || [],
    pending: applications?.filter(app => app.status === 'pending') || [],
    active: applications?.filter(app => ['viewed', 'reviewing', 'interview'].includes(app.status)) || [],
    completed: applications?.filter(app => ['accepted', 'rejected'].includes(app.status)) || []
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return `${diffDays - 1} dias atrás`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const ApplicationCard = ({ application }: { application: any }) => {
    const status = statusConfig[application.status as keyof typeof statusConfig];
    const StatusIcon = status.icon;
    const statusOrder = ['pending', 'viewed', 'reviewing', 'interview', 'accepted', 'rejected'];
    const currentIndex = statusOrder.indexOf(application.status);
    
    return (
      <Card className="mb-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {application.job?.title || 'Vaga'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    {application.job?.company_name || 'Empresa'}
                  </p>
                </div>
                <Badge className={`w-fit ${status.color}`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status.label}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{application.job?.location || 'Não informado'}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Candidatura enviada {formatDate(application.applied_at)}</span>
                </div>
              </div>

              {/* Timeline de Status */}
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                  Progresso da candidatura
                </p>
                <div className="relative">
                  <div className="flex items-center justify-between">
                    {statusOrder.map((statusKey, index) => {
                      const config = statusConfig[statusKey as keyof typeof statusConfig];
                      const Icon = config.icon;
                      const isCompleted = index <= currentIndex;
                      const isCurrent = index === currentIndex;
                      
                      return (
                        <div key={statusKey} className="flex flex-col items-center flex-1 relative">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                            isCompleted 
                              ? config.color 
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className={`text-xs text-center ${
                            isCurrent 
                              ? 'font-semibold text-gray-900 dark:text-white' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {config.label}
                          </span>
                          {index < statusOrder.length - 1 && (
                            <div className={`absolute top-4 left-1/2 w-full h-0.5 ${
                              index < currentIndex 
                                ? 'bg-brand-500' 
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`} style={{ width: 'calc(100% - 2rem)', marginLeft: '2rem' }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                {status.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:flex-col">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/jobs/${application.job_id}`)}
                className="w-full sm:w-auto"
              >
                Ver vaga
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/messages')}
                className="w-full sm:w-auto"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Mensagens
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow py-6 sm:py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Minhas Candidaturas
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Acompanhe o status de todas as suas candidaturas
            </p>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 sm:mb-8">
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {groupedApplications.all.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {groupedApplications.pending.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pendentes</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {groupedApplications.active.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Em andamento</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {groupedApplications.completed.filter(app => app.status === 'accepted').length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Aprovadas</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4 w-full mb-6">
              <TabsTrigger value="all" className="text-xs sm:text-sm">
                Todas ({groupedApplications.all.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs sm:text-sm">
                Pendentes ({groupedApplications.pending.length})
              </TabsTrigger>
              <TabsTrigger value="active" className="text-xs sm:text-sm">
                Em andamento ({groupedApplications.active.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs sm:text-sm">
                Finalizadas ({groupedApplications.completed.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {groupedApplications.all.length > 0 ? (
                groupedApplications.all.map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))
              ) : (
                <Card className="bg-white dark:bg-gray-800">
                  <CardContent className="p-12 text-center">
                    <Briefcase className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Nenhuma candidatura encontrada
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Você ainda não se candidatou a nenhuma vaga
                    </p>
                    <Button onClick={() => navigate('/jobs')}>
                      Buscar vagas
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="pending">
              {groupedApplications.pending.length > 0 ? (
                groupedApplications.pending.map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Nenhuma candidatura pendente
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="active">
              {groupedApplications.active.length > 0 ? (
                groupedApplications.active.map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Nenhuma candidatura em andamento
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {groupedApplications.completed.length > 0 ? (
                groupedApplications.completed.map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Nenhuma candidatura finalizada
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Applications;

