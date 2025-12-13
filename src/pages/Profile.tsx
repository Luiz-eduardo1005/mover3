
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
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Briefcase, MapPin, Mail, Phone, 
  Edit, Plus, X, Download, Bookmark, BookmarkCheck, Clock, Trash2
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import LoadingPage from './LoadingPage';
import EmailPreferencesComponent from '@/components/notifications/EmailPreferences';

// Componente para exibir vagas salvas
const SavedJobsTab = ({ userId }: { userId?: string }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Buscar vagas salvas do Supabase
  const { data: savedJobs, isLoading } = useQuery({
    queryKey: ['savedJobs', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          id,
          created_at,
          job_posting_id,
          job_postings (
            id,
            title,
            company_name,
            location,
            employment_type,
            salary_range,
              created_at,
              status
          )
        `)
        .eq('candidate_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar vagas salvas:', error);
          // Se a tabela não existe ainda, retornar array vazio
          if (error.code === '42P01' || error.message?.includes('does not exist')) {
            console.warn('Tabela saved_jobs ainda não foi criada no Supabase');
            return [];
          }
          return [];
        }
        
        // Filtrar apenas vagas que ainda existem e estão ativas
        return (data || []).filter((item: any) => 
          item.job_postings && item.job_postings.status === 'active'
        );
      } catch (err) {
        console.error('Erro inesperado ao buscar vagas salvas:', err);
        return [];
      }
    },
    enabled: !!userId,
  });

  const handleRemoveSaved = async (savedJobId: string, jobPostingId: string) => {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('id', savedJobId);
      
      if (error) throw error;
      
      // Atualizar cache
      queryClient.invalidateQueries({ queryKey: ['savedJobs', userId] });
      queryClient.invalidateQueries({ queryKey: ['savedJob', userId, jobPostingId] });
      
      toast.success('Vaga removida das salvas');
    } catch (error: any) {
      console.error('Erro ao remover vaga salva:', error);
      toast.error('Erro ao remover vaga. Tente novamente.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semana(s) atrás`;
    return `${Math.floor(diffDays / 30)} mês(es) atrás`;
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Carregando vagas salvas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!savedJobs || savedJobs.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">Vagas salvas</CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            Gerencie as vagas que você salvou para se candidatar mais tarde
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="text-center py-8">
            <Bookmark className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Você ainda não salvou nenhuma vaga.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Explore as vagas disponíveis e salve as que mais interessam você.
            </p>
            <Button 
              className="mt-4 bg-brand-500 hover:bg-brand-600"
              onClick={() => navigate('/jobs')}
            >
              Explorar vagas
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">
          Vagas salvas ({savedJobs.length})
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
          Gerencie as vagas que você salvou para se candidatar mais tarde
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="space-y-4">
          {savedJobs.map((savedJob: any) => {
            const job = savedJob.job_postings;
            if (!job) return null;
            
            return (
              <div
                key={savedJob.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center flex-shrink-0">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/jobs/${job.id}`}>
                          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 mb-1">
                            {job.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {job.company_name}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{job.location}</span>
                            </div>
                          )}
                          {job.employment_type && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{job.employment_type}</span>
                            </div>
                          )}
                          {job.salary_range && (
                            <span>{job.salary_range}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                          Salva {formatDate(savedJob.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="text-xs sm:text-sm"
                    >
                      Ver detalhes
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSaved(savedJob.id, job.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      aria-label="Remover das salvas"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para exibir candidaturas
const ApplicationsTab = ({ userId }: { userId?: string }) => {
  const navigate = useNavigate();

  // Buscar candidaturas do Supabase
  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          id,
          status,
          cover_letter,
          created_at,
          updated_at,
          job_posting_id,
          job_postings (
            id,
            title,
            company_name,
            location,
            employment_type,
            salary_range
          )
        `)
        .eq('candidate_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar candidaturas:', error);
        return [];
      }
      
      return (data || []).map((app: any) => ({
        id: app.id,
        job_id: app.job_posting_id,
        job: app.job_postings ? {
          title: app.job_postings.title,
          company_name: app.job_postings.company_name,
          location: app.job_postings.location,
          employment_type: app.job_postings.employment_type,
          salary_range: app.job_postings.salary_range
        } : null,
        status: app.status,
        cover_letter: app.cover_letter,
        applied_at: app.created_at,
        updated_at: app.updated_at
      }));
    },
    enabled: !!userId,
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
      pending: { label: 'Pendente', variant: 'secondary', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      viewed: { label: 'Visualizada', variant: 'default', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      in_review: { label: 'Em análise', variant: 'default', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      interview: { label: 'Entrevista', variant: 'default', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
      accepted: { label: 'Aceita', variant: 'default', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      rejected: { label: 'Recusada', variant: 'destructive', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
      withdrawn: { label: 'Retirada', variant: 'outline', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' }
    };
    
    const statusInfo = statusMap[status] || statusMap.pending;
    return (
      <Badge className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semana(s) atrás`;
    return `${Math.floor(diffDays / 30)} mês(es) atrás`;
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Carregando candidaturas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">Candidaturas</CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            Acompanhe o status de todas as suas candidaturas
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="text-center py-8">
            <Briefcase className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Você ainda não se candidatou a nenhuma vaga.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Explore as vagas disponíveis e envie sua candidatura.
            </p>
            <Button 
              className="mt-4 bg-brand-500 hover:bg-brand-600"
              onClick={() => navigate('/jobs')}
            >
              Explorar vagas
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">
          Candidaturas ({applications.length})
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
          Acompanhe o status de todas as suas candidaturas
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="space-y-4">
          {applications.map((application: any) => {
            if (!application.job) return null;
            
            return (
              <div
                key={application.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center flex-shrink-0">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Link to={`/jobs/${application.job_id}`}>
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400">
                              {application.job.title}
                            </h3>
                          </Link>
                          {getStatusBadge(application.status)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {application.job.company_name}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {application.job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{application.job.location}</span>
                            </div>
                          )}
                          {application.job.employment_type && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{application.job.employment_type}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                          Candidatou-se {formatDate(application.applied_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/jobs/${application.job_id}`)}
                      className="text-xs sm:text-sm"
                    >
                      Ver vaga
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const Profile = () => {
  const { user, profile, session, loading } = useAuth();
  
  // Verificar se há sessão válida
  const isAuthenticated = !loading && user && session;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [profileProgress, setProfileProgress] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      const fields = [
        profile.full_name,
        profile.phone,
        profile.profession,
        profile.location,
        profile.bio,
        profile.skills && profile.skills.length > 0,
      ];
      const filledFields = fields.filter(Boolean).length;
      setProfileProgress(Math.round((filledFields / fields.length) * 100));
    } else {
      // Se não há perfil mas há usuário, resetar progresso
      setProfileProgress(0);
    }
  }, [profile]);

  // Mostrar loading apenas enquanto está verificando autenticação
  if (loading) {
    return <LoadingPage />;
  }

  // Se não há sessão válida após loading, não renderizar nada
  if (!isAuthenticated) {
    return null;
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Usuário';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (editing) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-50 py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Button variant="ghost" onClick={() => setEditing(false)} className="mb-4">
                ← Voltar
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Editar Perfil</h1>
              <p className="text-gray-600 mt-2">Complete suas informações para aumentar suas chances de encontrar oportunidades</p>
            </div>
            <ProfileEditForm 
              onSaved={() => {
                setEditing(false);
              }} 
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Profile Summary */}
            <div className="space-y-4 sm:space-y-6">
              {/* Profile Card */}
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6 flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                      <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                      <AvatarFallback className="text-xl sm:text-2xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">{initials}</AvatarFallback>
                    </Avatar>
                    <Button size="icon" variant="outline" className="absolute bottom-0 right-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                  
                  <h2 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{displayName}</h2>
                  {profile?.profession && (
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 mt-1">
                      <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" /> {profile.profession}
                    </p>
                  )}
                  {profile?.location && (
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" /> {profile.location}
                    </p>
                  )}
                  
                  <div className="mt-4 sm:mt-6 w-full">
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">Perfil completo</span>
                      <span className="text-gray-500 dark:text-gray-400">{profileProgress}%</span>
                    </div>
                    <Progress value={profileProgress} className="h-2" />
                  </div>
                  
                  <Button 
                    className="mt-4 sm:mt-6 w-full bg-brand-500 hover:bg-brand-600 text-sm sm:text-base"
                    onClick={() => setEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Editar perfil
                  </Button>

                  <Button variant="outline" className="mt-2 sm:mt-3 w-full text-sm sm:text-base">
                    <Download className="mr-2 h-4 w-4" /> Baixar currículo
                  </Button>
                </CardContent>
              </Card>
              
              {/* Contact Info */}
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-white">Informações de contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{user?.email || 'Não informado'}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{profile.phone}</span>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{profile.location}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Skills */}
              {profile?.skills && profile.skills.length > 0 && (
                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">Habilidades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Privacy Settings */}
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-white">Privacidade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="profile-public" className="flex-1 text-gray-900 dark:text-white">
                      Perfil visível para recrutadores
                    </Label>
                    <Switch id="profile-public" checked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="resume-searchable" className="flex-1 text-gray-900 dark:text-white">
                      Currículo pesquisável
                    </Label>
                    <Switch id="resume-searchable" checked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="job-alerts" className="flex-1 text-gray-900 dark:text-white">
                      Receber alertas de vagas
                    </Label>
                    <Switch id="job-alerts" checked />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Details */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="resume" className="w-full">
                <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full mb-4 sm:mb-6 h-auto gap-1 sm:gap-0 overflow-x-auto">
                  <TabsTrigger value="resume" className="text-[10px] xs:text-xs sm:text-sm py-2 px-1 sm:px-3">
                    <span className="hidden xs:inline">Currículo</span>
                    <span className="xs:hidden">CV</span>
                  </TabsTrigger>
                  <TabsTrigger value="saved" className="text-[10px] xs:text-xs sm:text-sm py-2 px-1 sm:px-3">
                    <span className="hidden xs:inline">Vagas salvas</span>
                    <span className="xs:hidden">Salvas</span>
                  </TabsTrigger>
                  <TabsTrigger value="applications" className="text-[10px] xs:text-xs sm:text-sm py-2 px-1 sm:px-3">
                    <span className="hidden xs:inline">Candidaturas</span>
                    <span className="xs:hidden">Candid.</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="text-[10px] xs:text-xs sm:text-sm py-2 px-1 sm:px-3">
                    <span className="hidden xs:inline">Configurações</span>
                    <span className="xs:hidden">Config</span>
                  </TabsTrigger>
                </TabsList>
                
                {/* Resume Tab */}
                <TabsContent value="resume">
                  <div className="space-y-4 sm:space-y-6">
                    {/* Summary */}
                    <Card className="bg-white dark:bg-gray-800">
                      <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
                        <CardTitle className="text-base sm:text-lg flex items-center justify-between text-gray-900 dark:text-white">
                          <span>Resumo profissional</span>
                          <Button size="icon" variant="ghost" className="h-7 w-7 sm:h-8 sm:w-8">
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                        {profile?.bio ? (
                          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                            {profile.bio}
                          </p>
                        ) : (
                          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 italic">
                            Nenhum resumo profissional adicionado ainda. Clique em editar para adicionar.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Experience */}
                    <Card className="bg-white dark:bg-gray-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between text-gray-900 dark:text-white">
                          <span>Experiência profissional</span>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          Nenhuma experiência profissional adicionada ainda. Clique em adicionar para incluir suas experiências.
                        </p>
                      </CardContent>
                    </Card>
                    
                    {/* Education */}
                    <Card className="bg-white dark:bg-gray-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between text-gray-900 dark:text-white">
                          <span>Educação</span>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          Nenhuma formação acadêmica adicionada ainda. Clique em adicionar para incluir sua educação.
                        </p>
                      </CardContent>
                    </Card>
                    
                    {/* Languages */}
                    <Card className="bg-white dark:bg-gray-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between text-gray-900 dark:text-white">
                          <span>Idiomas</span>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {profile?.languages && Array.isArray(profile.languages) && profile.languages.length > 0 ? (
                          <div className="space-y-3">
                            {profile.languages.map((lang: any, index: number) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {lang.language || lang.name || 'Idioma'}
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">
                                  {lang.level || lang.proficiency || 'Não especificado'}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Nenhum idioma adicionado ainda. Clique em adicionar para incluir seus idiomas.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Additional Documents */}
                    <Card className="bg-white dark:bg-gray-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-gray-900 dark:text-white">Documentos adicionais</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">
                          Nenhum documento adicionado ainda.
                        </p>
                        <Button variant="outline" className="w-full">
                          <Plus className="mr-2 h-4 w-4" /> Adicionar documento
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Saved Jobs Tab */}
                <TabsContent value="saved">
                  <SavedJobsTab userId={user?.id} />
                </TabsContent>
                
                {/* Applications Tab */}
                <TabsContent value="applications">
                  <ApplicationsTab userId={user?.id} />
                </TabsContent>
                
                {/* Settings Tab */}
                <TabsContent value="settings">
                  <div className="space-y-6">
                    <EmailPreferencesComponent />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
