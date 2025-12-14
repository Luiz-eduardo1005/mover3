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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, Plus, Users, Eye, FileText, TrendingUp, 
  Calendar, MapPin, DollarSign, CheckCircle, Clock, XCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import LoadingPage from './LoadingPage';
import ProtectedRoute from '@/components/ProtectedRoute';

const CompanyDashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Buscar vagas da empresa
  const { data: jobPostings, isLoading: loadingJobs } = useQuery({
    queryKey: ['companyJobs', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar vagas:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Buscar candidaturas recebidas
  const { data: applications, isLoading: loadingApplications } = useQuery({
    queryKey: ['companyApplications', user?.id],
    queryFn: async () => {
      if (!user?.id || !jobPostings) return [];
      
      const jobIds = jobPostings.map((job: any) => job.id);
      if (jobIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job_postings (id, title),
          profiles (id, full_name, email)
        `)
        .in('job_posting_id', jobIds)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar candidaturas:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user?.id && !!jobPostings,
  });

  // Calcular estatísticas
  const stats = {
    totalJobs: jobPostings?.length || 0,
    activeJobs: jobPostings?.filter((job: any) => job.status === 'active').length || 0,
    totalApplications: applications?.length || 0,
    pendingApplications: applications?.filter((app: any) => app.status === 'pending').length || 0,
    acceptedApplications: applications?.filter((app: any) => app.status === 'accepted').length || 0,
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <ProtectedRoute allowedUserTypes={['employer']}>
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Dashboard da Empresa
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gerencie suas vagas e candidaturas recebidas
              </p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vagas Ativas</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeJobs}</div>
                  <p className="text-xs text-muted-foreground">
                    de {stats.totalJobs} vagas no total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Candidaturas</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalApplications}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingApplications} aguardando análise
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.acceptedApplications}</div>
                  <p className="text-xs text-muted-foreground">
                    Candidaturas aceitas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">
                    Em breve
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Ações Rápidas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Suas Vagas</CardTitle>
                  <CardDescription>
                    Gerencie as vagas que você publicou
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingJobs ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Carregando vagas...</p>
                  ) : jobPostings && jobPostings.length > 0 ? (
                    <div className="space-y-4">
                      {jobPostings.slice(0, 5).map((job: any) => (
                        <div
                          key={job.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                          onClick={() => navigate(`/jobs/${job.id}`)}
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {job.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {job.location}
                                </span>
                              )}
                              {job.employment_type && (
                                <span>{job.employment_type}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                              {job.status === 'active' ? 'Ativa' : 'Inativa'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {jobPostings.length > 5 && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate('/company/jobs')}
                        >
                          Ver todas as vagas ({jobPostings.length})
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Você ainda não publicou nenhuma vaga
                      </p>
                      <Button onClick={() => navigate('/advertise')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Publicar primeira vaga
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => navigate('/advertise')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Vaga
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/company/applications')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Ver Candidaturas
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/company/jobs')}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Gerenciar Vagas
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/profile')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Candidaturas Recentes */}
            <Card>
              <CardHeader>
                <CardTitle>Candidaturas Recentes</CardTitle>
                <CardDescription>
                  Últimas candidaturas recebidas para suas vagas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingApplications ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Carregando candidaturas...</p>
                ) : applications && applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.slice(0, 5).map((app: any) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {app.profiles?.full_name || 'Candidato'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {app.job_postings?.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {new Date(app.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              app.status === 'accepted' ? 'default' :
                              app.status === 'rejected' ? 'destructive' :
                              'secondary'
                            }
                          >
                            {app.status === 'pending' ? 'Pendente' :
                             app.status === 'accepted' ? 'Aprovada' :
                             app.status === 'rejected' ? 'Rejeitada' :
                             app.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/company/applications/${app.id}`)}
                          >
                            Ver detalhes
                          </Button>
                        </div>
                      </div>
                    ))}
                    {applications.length > 5 && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate('/company/applications')}
                      >
                        Ver todas as candidaturas ({applications.length})
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Ainda não há candidaturas para suas vagas
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default CompanyDashboard;

