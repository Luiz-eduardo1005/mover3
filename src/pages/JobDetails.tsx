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
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Briefcase, MapPin, Clock, DollarSign, Calendar, 
  ArrowLeft, Bookmark, BookmarkCheck, CheckCircle2,
  Building2, Send, Share2, X
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import LoadingPage from './LoadingPage';

// Dados completos das vagas com todas as informações
const jobDetailsData: Record<number, any> = {
  1: {
    id: 1,
    title: 'Desenvolvedor Full Stack',
    company: 'TechSolutions',
    location: 'Manaus, AM',
    type: 'Tempo Integral',
    salary: 'R$ 6.000 – R$ 8.000',
    posted: 'Publicada há 2 dias',
    description: 'A TechSolutions busca um Desenvolvedor Full Stack para atuar no desenvolvimento e manutenção de aplicações web escaláveis, utilizando tecnologias modernas e seguindo as melhores práticas de arquitetura de software.',
    responsibilities: [
      'Desenvolver novas funcionalidades para produtos web da empresa.',
      'Criar e manter APIs REST e integrações com serviços externos.',
      'Atuar no front-end e back-end garantindo alta performance.',
      'Participar de code reviews e decisões técnicas da equipe.',
      'Identificar e corrigir bugs e gargalos de performance.'
    ],
    requirements: [
      'Experiência com JavaScript, TypeScript ou Python.',
      'Conhecimento em frameworks como React, Vue ou Angular.',
      'Experiência com Node.js, Express ou Django.',
      'Versionamento com Git/GitHub.',
      'Noções de SQL e bancos de dados relacionais.'
    ],
    differentials: [
      'Experiência com DevOps (Docker, CI/CD).',
      'Conhecimento em cloud (AWS, Azure ou GCP).'
    ],
    benefits: [
      'Vale-transporte',
      'Vale-refeição ou alimentação',
      'Plano de saúde',
      'Horário flexível'
    ],
    featured: true
  },
  2: {
    id: 2,
    title: 'Analista de Marketing Digital',
    company: 'Empresa Inovadora',
    location: 'Manaus, AM',
    type: 'Tempo Integral',
    salary: 'R$ 4.500 – R$ 5.500',
    posted: 'Publicada há 3 dias',
    description: 'A Empresa Inovadora procura um Analista de Marketing Digital com perfil criativo e analítico para atuar no planejamento e execução de campanhas online, ampliando a presença digital da marca.',
    responsibilities: [
      'Criar campanhas de tráfego pago (Google Ads, Meta Ads).',
      'Gerenciar redes sociais e desenvolver conteúdos estratégicos.',
      'Monitorar métricas e gerar relatórios de desempenho.',
      'Otimizar SEO e experiência do usuário.',
      'Criar funis de vendas e automações.'
    ],
    requirements: [
      'Experiência comprovada em Marketing Digital.',
      'Conhecimento em Meta Ads e Google Ads.',
      'Excel básico/intermediário e ferramentas de análise.',
      'Excelente comunicação escrita.'
    ],
    differentials: [
      'Certificações em Marketing Digital.',
      'Conhecimento em ferramentas de design.'
    ],
    benefits: [
      'Vale-transporte',
      'Plano de saúde',
      'Ambiente colaborativo'
    ],
    featured: false
  },
  3: {
    id: 3,
    title: 'Gerente de Vendas',
    company: 'VendaMais',
    location: 'Manaus, AM',
    type: 'Tempo Integral',
    salary: 'R$ 7.000 – R$ 9.000',
    posted: 'Publicada há 1 dia',
    description: 'A VendaMais procura um Gerente de Vendas com foco em resultados e forte capacidade de liderança para atuar no gerenciamento de equipes e estratégias comerciais.',
    responsibilities: [
      'Liderar equipe de vendas e acompanhar metas.',
      'Criar estratégias comerciais e ações de mercado.',
      'Realizar reuniões, treinamentos e acompanhamento individual.',
      'Analisar KPIs e elaborar relatórios gerenciais.',
      'Garantir alta performance e satisfação dos clientes.'
    ],
    requirements: [
      'Experiência anterior como supervisor ou gerente de vendas.',
      'Boa comunicação e habilidade de negociação.',
      'Ensino superior em Administração, Marketing ou áreas afins.',
      'Gestão de pessoas e análise de métricas.'
    ],
    differentials: [
      'Experiência com CRM.',
      'Atuação em varejo ou setor comercial.'
    ],
    benefits: [
      'Vale-alimentação',
      'Plano de saúde',
      'Bônus por desempenho'
    ],
    featured: true
  },
  4: {
    id: 4,
    title: 'Assistente Administrativo',
    company: 'AdminPro',
    location: 'Manaus, AM',
    type: 'Meio Período',
    salary: 'R$ 2.000 – R$ 2.500',
    posted: 'Publicada há 1 semana',
    description: 'A AdminPro contrata Assistente Administrativo para dar suporte às rotinas internas da empresa, organização de documentos e atendimento ao público.',
    responsibilities: [
      'Organizar documentos, planilhas e arquivos internos.',
      'Apoiar o departamento financeiro e administrativo.',
      'Atender clientes e fornecedores.',
      'Elaborar relatórios e auxiliar em processos internos.'
    ],
    requirements: [
      'Ensino médio completo (superior é diferencial).',
      'Domínio básico de informática e pacote Office.',
      'Boa comunicação e organização.'
    ],
    differentials: [
      'Experiência em rotinas administrativas.',
      'Noções de faturamento.'
    ],
    benefits: [
      'Vale-transporte',
      'Possibilidade de efetivação'
    ],
    featured: false
  },
  5: {
    id: 5,
    title: 'Enfermeiro(a)',
    company: 'Hospital Central',
    location: 'Manaus, AM',
    type: 'Tempo Integral',
    salary: 'R$ 4.000 – R$ 5.000',
    posted: 'Publicada há 5 dias',
    description: 'O Hospital Central busca Enfermeiro(a) para atuar na assistência direta aos pacientes, garantindo qualidade e segurança nos atendimentos.',
    responsibilities: [
      'Prestar assistência de enfermagem aos pacientes.',
      'Administrar medicamentos conforme prescrição.',
      'Acompanhar evolução clínica e registrar informações.',
      'Auxiliar médicos e equipe multiprofissional.',
      'Implementar protocolos e boas práticas.'
    ],
    requirements: [
      'Graduação em Enfermagem.',
      'Registro ativo no COREN.',
      'Disponibilidade para trabalhar em escala.'
    ],
    differentials: [
      'Experiência em hospitais de grande porte.',
      'Especialização em áreas clínicas.'
    ],
    benefits: [
      'Plano de saúde',
      'Vale-alimentação',
      'Adicional de insalubridade'
    ],
    featured: false
  },
  6: {
    id: 6,
    title: 'Engenheiro Civil',
    company: 'Construtora Horizonte',
    location: 'Manaus, AM',
    type: 'Tempo Integral',
    salary: 'R$ 8.000 – R$ 10.000',
    posted: 'Publicada há 4 dias',
    description: 'A Construtora Horizonte está contratando Engenheiro Civil para atuar na gestão de obras, supervisionar equipes e garantir que os projetos sejam executados conforme padrão técnico.',
    responsibilities: [
      'Coordenar obras e fiscalizar execução conforme projeto.',
      'Gerenciar equipes e prazos.',
      'Elaborar relatórios técnicos e orçamentos.',
      'Garantir cumprimento de normas e segurança.',
      'Acompanhar fornecedores e materiais.'
    ],
    requirements: [
      'Graduação em Engenharia Civil.',
      'Registro no CREA.',
      'Experiência em obras e gestão de equipes.'
    ],
    differentials: [
      'Experiência com obras de grande porte.',
      'Conhecimento avançado em AutoCAD ou Revit.'
    ],
    benefits: [
      'Vale-alimentação',
      'Plano de saúde',
      'Auxílio transporte'
    ],
    featured: true
  }
};

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const jobId = id ? parseInt(id) : null;
  const job = jobId ? jobDetailsData[jobId] : null;
  const jobIdStr = jobId?.toString() || '';

  // Função para validar UUID (definir antes de usar)
  const isValidUUIDForQuery = (str: string): boolean => {
    if (!str || typeof str !== 'string') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  // Buscar se a vaga está salva (apenas se for UUID válido)
  const { data: isSaved = false } = useQuery({
    queryKey: ['savedJob', user?.id, jobIdStr],
    queryFn: async () => {
      if (!user?.id || !jobIdStr) return false;
      
      // Não tentar buscar se não for UUID válido
      if (!isValidUUIDForQuery(jobIdStr)) {
        return false;
      }
      
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('candidate_id', user.id)
        .eq('job_posting_id', jobIdStr)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar vaga salva:', error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!user?.id && !!jobIdStr && isValidUUIDForQuery(jobIdStr),
  });

  // Verificar se já se candidatou
  const { data: hasApplied = false } = useQuery({
    queryKey: ['hasApplied', user?.id, jobIdStr],
    queryFn: async () => {
      if (!user?.id || !jobIdStr) return false;
      
      // Não tentar buscar se não for UUID válido
      if (!isValidUUIDForQuery(jobIdStr)) {
        return false;
      }
      
      const { data, error } = await supabase
        .from('job_applications')
        .select('id')
        .eq('candidate_id', user.id)
        .eq('job_posting_id', jobIdStr)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar candidatura:', error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!user?.id && !!jobIdStr && isValidUUIDForQuery(jobIdStr),
  });

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => setLoading(false), 300);
  }, [id]);

  // Função para validar se é UUID
  const isValidUUID = (str: string): boolean => {
    if (!str || typeof str !== 'string') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  const handleSaveJob = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Faça login para salvar vagas');
      return;
    }

    if (!jobIdStr) return;

    // Validar se é UUID válido ANTES de qualquer operação
    // Vagas mockadas têm IDs numéricos (1, 2, 3...) que não são UUIDs
    if (!isValidUUID(jobIdStr)) {
      console.warn('Tentativa de salvar vaga mockada com ID:', jobIdStr);
      toast.error('Esta vaga é apenas uma demonstração. As vagas reais precisam ser criadas no Supabase para serem salvas.', {
        duration: 5000,
      });
      return; // IMPORTANTE: retornar aqui para não tentar salvar
    }

    try {
      if (isSaved) {
        // Remover do Supabase
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('candidate_id', user.id)
          .eq('job_posting_id', jobIdStr);
        
        if (error) throw error;
        
        // Atualizar cache
        queryClient.setQueryData(['savedJob', user.id, jobIdStr], false);
        queryClient.invalidateQueries({ queryKey: ['savedJobs', user.id] });
        
        toast.success('Vaga removida das salvas');
      } else {
        // Salvar no Supabase
        const { error } = await supabase
          .from('saved_jobs')
          .insert({
            candidate_id: user.id,
            job_posting_id: jobIdStr,
          });
        
        if (error) {
          if (error.code === '23505') {
            queryClient.setQueryData(['savedJob', user.id, jobIdStr], true);
            toast.success('Vaga já estava salva');
            return;
          }
          throw error;
        }
        
        // Atualizar cache
        queryClient.setQueryData(['savedJob', user.id, jobIdStr], true);
        queryClient.invalidateQueries({ queryKey: ['savedJobs', user.id] });
        
        toast.success('Vaga salva com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro ao salvar/remover vaga:', error);
      
      // Tratar especificamente erros de UUID inválido
      if (error.message && error.message.includes('invalid input syntax for type uuid')) {
        toast.error('Erro: Esta vaga não pode ser salva porque não é uma vaga real do banco de dados. As vagas de demonstração não podem ser salvas.', {
          duration: 6000,
        });
        return;
      }
      
      toast.error(error.message || 'Erro ao processar ação. Tente novamente.');
    }
  };

  const handleApply = () => {
    if (!user) {
      toast.error('Faça login para se candidatar');
      navigate('/login');
      return;
    }

    // Validar se é UUID válido (vagas mockadas não podem receber candidaturas)
    if (!isValidUUID(jobIdStr)) {
      toast.error('Esta vaga é apenas uma demonstração. As vagas reais precisam ser criadas no Supabase para receber candidaturas.', {
        duration: 5000,
      });
      return;
    }

    // Verificar se já se candidatou
    if (hasApplied) {
      toast.info('Você já se candidatou para esta vaga. Acompanhe o status no seu perfil.');
      return;
    }

    // Abrir dialog para carta de apresentação
    setShowApplyDialog(true);
  };

  const handleSubmitApplication = async () => {
    if (!user || !jobIdStr) return;

    // Validar UUID novamente
    if (!isValidUUID(jobIdStr)) {
      toast.error('Erro: ID da vaga inválido.');
      return;
    }

    setIsApplying(true);

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          candidate_id: user.id,
          job_posting_id: jobIdStr,
          cover_letter: coverLetter.trim() || null,
          status: 'pending',
        });

      if (error) {
        // Se já existe candidatura
        if (error.code === '23505') {
          toast.info('Você já se candidatou para esta vaga.');
          setShowApplyDialog(false);
          queryClient.invalidateQueries({ queryKey: ['hasApplied', user.id, jobIdStr] });
          queryClient.invalidateQueries({ queryKey: ['applications', user.id] });
          return;
        }
        throw error;
      }

      // Sucesso
    toast.success('Candidatura enviada com sucesso!');
      setShowApplyDialog(false);
      setCoverLetter('');
      
      // Atualizar cache
      queryClient.invalidateQueries({ queryKey: ['hasApplied', user.id, jobIdStr] });
      queryClient.invalidateQueries({ queryKey: ['applications', user.id] });
    } catch (error: any) {
      console.error('Erro ao enviar candidatura:', error);
      
      // Tratar especificamente erros de UUID inválido
      if (error.message && error.message.includes('invalid input syntax for type uuid')) {
        toast.error('Erro: Esta vaga não pode receber candidaturas porque não é uma vaga real do banco de dados.', {
          duration: 6000,
        });
        return;
      }
      
      toast.error(error.message || 'Erro ao enviar candidatura. Tente novamente.');
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (!job) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center p-8">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Vaga não encontrada
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                A vaga que você está procurando não existe ou foi removida.
              </p>
              <Button onClick={() => navigate('/jobs')} variant="default">
                Voltar para vagas
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main id="main-content" className="flex-grow py-6 sm:py-8" role="main" aria-label="Conteúdo principal">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Breadcrumb 
              items={[
                { label: 'Vagas', href: '/jobs' },
                { label: job.title || 'Detalhes da vaga' }
              ]} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Conteúdo Principal */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Header da Vaga */}
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white break-words">
                          {job.title}
                        </h1>
                        {job.featured && (
                          <Badge className="bg-brand-100 dark:bg-brand-900 text-brand-800 dark:text-brand-200 text-xs">
                            Destaque
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                        <Building2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        <span className="truncate">{job.company}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 sm:gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">{job.type}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">{job.posted}</span>
                        </div>
                      </div>
                    </div>
                    {user && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSaveJob}
                        className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                        aria-label={isSaved ? 'Remover das salvas' : 'Salvar vaga'}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 dark:text-brand-400" />
                        ) : (
                          <Bookmark className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        )}
                      </Button>
                    )}
                  </div>
                </CardHeader>
              </Card>

              {/* Descrição da Vaga */}
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white">
                    Descrição da vaga
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {job.description}
                  </p>
                </CardContent>
              </Card>

              {/* Responsabilidades */}
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white">
                    Responsabilidades
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <ul className="space-y-2 sm:space-y-3">
                    {job.responsibilities.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 sm:gap-3">
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Requisitos */}
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white">
                    Requisitos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <ul className="space-y-2 sm:space-y-3">
                    {job.requirements.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 sm:gap-3">
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Diferenciais */}
              {job.differentials && job.differentials.length > 0 && (
                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white">
                      Diferenciais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <ul className="space-y-2 sm:space-y-3">
                      {job.differentials.map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 sm:gap-3">
                          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Benefícios */}
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white">
                    Benefícios
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {job.benefits.map((benefit: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Ações */}
            <div className="lg:col-span-1">
              <Card className="bg-white dark:bg-gray-800 sticky top-20 sm:top-24">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">
                    Ações
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-2 sm:space-y-3">
                  {hasApplied ? (
                    <Button 
                      disabled
                      className="w-full bg-green-600 text-white text-sm sm:text-base py-2.5 sm:py-3 cursor-not-allowed"
                      size="lg"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Já candidatado
                    </Button>
                  ) : (
                  <Button 
                    onClick={handleApply}
                    className="w-full bg-brand-500 hover:bg-brand-600 text-white text-sm sm:text-base py-2.5 sm:py-3"
                    size="lg"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Candidatar-se
                  </Button>
                  )}
                  
                  {user && (
                    <Button
                      variant="outline"
                      onClick={handleSaveJob}
                      className="w-full text-sm sm:text-base py-2.5 sm:py-3"
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="h-4 w-4 mr-2" />
                          Remover das salvas
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4 mr-2" />
                          Salvar vaga
                        </>
                      )}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      navigator.share?.({
                        title: job.title,
                        text: `Confira esta vaga: ${job.title} na ${job.company}`,
                        url: window.location.href
                      }).catch(() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success('Link copiado para a área de transferência!');
                      });
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                      Informações da vaga
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{job.posted}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <Link to={`/company/${job.company.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Button variant="outline" className="w-full">
                      <Building2 className="h-4 w-4 mr-2" />
                      Ver perfil da empresa
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Dialog para candidatura */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Candidatar-se para a vaga</DialogTitle>
            <DialogDescription>
              {job?.title} - {job?.company}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="coverLetter" className="text-sm font-medium">
                Carta de Apresentação (Opcional)
              </Label>
              <Textarea
                id="coverLetter"
                placeholder="Conte-nos por que você é a pessoa ideal para esta vaga..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="mt-2 min-h-[150px]"
                maxLength={2000}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {coverLetter.length}/2000 caracteres
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Dica:</strong> Uma boa carta de apresentação pode aumentar suas chances de ser selecionado. 
                Destaque suas principais qualificações e o que te motiva a trabalhar nesta empresa.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowApplyDialog(false);
                setCoverLetter('');
              }}
              disabled={isApplying}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitApplication}
              disabled={isApplying}
              className="bg-brand-500 hover:bg-brand-600"
            >
              {isApplying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Candidatura
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetails;

