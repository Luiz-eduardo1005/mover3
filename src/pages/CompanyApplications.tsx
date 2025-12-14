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
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, User, Calendar, MapPin, Mail, Phone,
  CheckCircle, XCircle, Clock, Eye, Download
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import LoadingPage from './LoadingPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const CompanyApplications = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Buscar vagas da empresa primeiro
  const { data: jobPostings } = useQuery({
    queryKey: ['companyJobs', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('job_postings')
        .select('id, title')
        .eq('employer_id', user.id);
      
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
          profiles (id, full_name, email, phone, location, profession)
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

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', applicationId);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['companyApplications', user?.id] });
      toast({
        title: "Status atualizado",
        description: `A candidatura foi marcada como ${newStatus === 'accepted' ? 'aprovada' : 'rejeitada'}.`,
      });
      setSelectedApplication(null);
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const filteredApplications = applications?.filter((app: any) => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  }) || [];

  const stats = {
    all: applications?.length || 0,
    pending: applications?.filter((app: any) => app.status === 'pending').length || 0,
    accepted: applications?.filter((app: any) => app.status === 'accepted').length || 0,
    rejected: applications?.filter((app: any) => app.status === 'rejected').length || 0,
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
                Candidaturas Recebidas
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gerencie todas as candidaturas para suas vagas
              </p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{stats.all}</div>
                  <p className="text-xs text-muted-foreground">Total</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <p className="text-xs text-muted-foreground">Pendentes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
                  <p className="text-xs text-muted-foreground">Aprovadas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                  <p className="text-xs text-muted-foreground">Rejeitadas</p>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Candidaturas */}
            <Tabs value={filterStatus} onValueChange={setFilterStatus}>
              <TabsList>
                <TabsTrigger value="all">Todas ({stats.all})</TabsTrigger>
                <TabsTrigger value="pending">Pendentes ({stats.pending})</TabsTrigger>
                <TabsTrigger value="accepted">Aprovadas ({stats.accepted})</TabsTrigger>
                <TabsTrigger value="rejected">Rejeitadas ({stats.rejected})</TabsTrigger>
              </TabsList>

              <TabsContent value={filterStatus} className="mt-6">
                {loadingApplications ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    Carregando candidaturas...
                  </p>
                ) : filteredApplications.length > 0 ? (
                  <div className="space-y-4">
                    {filteredApplications.map((app: any) => (
                      <Card key={app.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-xl text-gray-900 dark:text-white mb-2">
                                {app.profiles?.full_name || 'Candidato'}
                              </CardTitle>
                              <CardDescription className="space-y-1">
                                <p className="font-medium">{app.job_postings?.title}</p>
                                <div className="flex items-center gap-4 flex-wrap text-sm">
                                  {app.profiles?.email && (
                                    <span className="flex items-center gap-1">
                                      <Mail className="h-4 w-4" />
                                      {app.profiles.email}
                                    </span>
                                  )}
                                  {app.profiles?.phone && (
                                    <span className="flex items-center gap-1">
                                      <Phone className="h-4 w-4" />
                                      {app.profiles.phone}
                                    </span>
                                  )}
                                  {app.profiles?.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {app.profiles.location}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(app.created_at).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                              </CardDescription>
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
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {app.cover_letter && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                              {app.cover_letter}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedApplication(app)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalhes
                            </Button>
                            {app.status === 'pending' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUpdateStatus(app.id, 'accepted')}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Aprovar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Rejeitar
                                </Button>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Nenhuma candidatura encontrada
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {filterStatus === 'all' 
                          ? 'Ainda não há candidaturas para suas vagas'
                          : `Não há candidaturas com status "${filterStatus}"`
                        }
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />

        {/* Dialog de Detalhes */}
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedApplication?.profiles?.full_name || 'Candidato'}
              </DialogTitle>
              <DialogDescription>
                {selectedApplication?.job_postings?.title}
              </DialogDescription>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Informações do Candidato</h4>
                  <div className="space-y-2 text-sm">
                    {selectedApplication.profiles?.email && (
                      <p><strong>Email:</strong> {selectedApplication.profiles.email}</p>
                    )}
                    {selectedApplication.profiles?.phone && (
                      <p><strong>Telefone:</strong> {selectedApplication.profiles.phone}</p>
                    )}
                    {selectedApplication.profiles?.location && (
                      <p><strong>Localização:</strong> {selectedApplication.profiles.location}</p>
                    )}
                    {selectedApplication.profiles?.profession && (
                      <p><strong>Profissão:</strong> {selectedApplication.profiles.profession}</p>
                    )}
                  </div>
                </div>
                {selectedApplication.cover_letter && (
                  <div>
                    <h4 className="font-semibold mb-2">Carta de Apresentação</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {selectedApplication.cover_letter}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-4 border-t">
                  {selectedApplication.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleUpdateStatus(selectedApplication.id, 'accepted')}
                        className="flex-1"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Aprovar Candidatura
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleUpdateStatus(selectedApplication.id, 'rejected')}
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Rejeitar Candidatura
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
};

export default CompanyApplications;

