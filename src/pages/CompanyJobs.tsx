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

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, Plus, Eye, Edit, Trash2, MapPin, 
  Calendar, Users, DollarSign, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import LoadingPage from './LoadingPage';
import ProtectedRoute from '@/components/ProtectedRoute';

const CompanyJobs = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta vaga?')) return;

    try {
      const { error } = await supabase
        .from('job_postings')
        .delete()
        .eq('id', jobId);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['companyJobs', user?.id] });
      toast({
        title: "Vaga excluída",
        description: "A vaga foi excluída com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao excluir vaga:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a vaga. Tente novamente.",
        variant: "destructive",
      });
    }
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
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Minhas Vagas
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Gerencie todas as vagas que você publicou
                </p>
              </div>
              <Button onClick={() => navigate('/advertise')}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Vaga
              </Button>
            </div>

            {/* Lista de Vagas */}
            {loadingJobs ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Carregando vagas...
              </p>
            ) : jobPostings && jobPostings.length > 0 ? (
              <div className="space-y-4">
                {jobPostings.map((job: any) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-gray-900 dark:text-white mb-2">
                            {job.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 flex-wrap">
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </span>
                            )}
                            {job.employment_type && (
                              <span>{job.employment_type}</span>
                            )}
                            {job.salary_range && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {job.salary_range}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(job.created_at).toLocaleDateString('pt-BR')}
                            </span>
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                            {job.status === 'active' ? 'Ativa' : 'Inativa'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            Visualizações: -
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Candidaturas: -
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/jobs/${job.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/advertise?edit=${job.id}`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteJob(job.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Briefcase className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Nenhuma vaga publicada
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Comece a publicar vagas para encontrar os melhores candidatos
                  </p>
                  <Button onClick={() => navigate('/advertise')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Publicar primeira vaga
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default CompanyJobs;

