
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
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, MapPin, Globe, Mail, Phone, 
  Briefcase, Users, Calendar, Star, ExternalLink,
  Linkedin, Facebook, Twitter, Instagram
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import LoadingPage from './LoadingPage';

// Mapeamento de logos e dados das empresas
const companyDataMap: Record<string, any> = {
  'techsolutions': {
    id: 'techsolutions',
    name: 'TechSolutions',
    description: 'Somos uma empresa de tecnologia focada em soluções inovadoras para o mercado brasileiro. Com mais de 10 anos de experiência, desenvolvemos softwares de alta qualidade e oferecemos oportunidades de crescimento profissional.',
    logo: '/logos/techsolutions.svg',
    website: 'https://techsolutions.com.br',
    email: 'contato@techsolutions.com.br',
    phone: '(92) 3234-5678',
    location: 'Manaus, AM',
    industry: 'Tecnologia',
    size: '50-200 funcionários',
    founded: '2014',
    rating: 4.5,
    totalReviews: 23,
    activeJobs: 5
  },
  'empresa-inovadora': {
    id: 'empresa-inovadora',
    name: 'Empresa Inovadora',
    description: 'Agência de marketing digital especializada em crescimento e inovação. Transformamos ideias em resultados através de estratégias criativas e eficazes.',
    logo: '/logos/empresa-inovadora.svg',
    website: 'https://empresainovadora.com.br',
    email: 'contato@empresainovadora.com.br',
    phone: '(92) 3234-5679',
    location: 'Manaus, AM',
    industry: 'Marketing',
    size: '11-50 funcionários',
    founded: '2018',
    rating: 4.3,
    totalReviews: 15,
    activeJobs: 3
  },
  'vendamais': {
    id: 'vendamais',
    name: 'VendaMais',
    description: 'Empresa líder em soluções de vendas e relacionamento. Desenvolvemos estratégias personalizadas para maximizar resultados e fortalecer parcerias.',
    logo: '/logos/vendamais.svg',
    website: 'https://vendamais.com.br',
    email: 'contato@vendamais.com.br',
    phone: '(92) 3234-5680',
    location: 'Manaus, AM',
    industry: 'Vendas',
    size: '51-200 funcionários',
    founded: '2015',
    rating: 4.7,
    totalReviews: 31,
    activeJobs: 8
  },
  'adminpro': {
    id: 'adminpro',
    name: 'AdminPro',
    description: 'Soluções administrativas e consultoria empresarial. Oferecemos serviços especializados para otimizar processos e aumentar a eficiência organizacional.',
    logo: '/logos/adminpro.svg',
    website: 'https://adminpro.com.br',
    email: 'contato@adminpro.com.br',
    phone: '(92) 3234-5681',
    location: 'Manaus, AM',
    industry: 'Administração',
    size: '1-10 funcionários',
    founded: '2020',
    rating: 4.2,
    totalReviews: 8,
    activeJobs: 2
  },
  'hospital-central': {
    id: 'hospital-central',
    name: 'Hospital Central',
    description: 'Hospital de referência em atendimento de qualidade. Comprometidos com a excelência em saúde e bem-estar da comunidade.',
    logo: '/logos/hospital-central.svg',
    website: 'https://hospitalcentral.com.br',
    email: 'contato@hospitalcentral.com.br',
    phone: '(92) 3234-5682',
    location: 'Manaus, AM',
    industry: 'Saúde',
    size: '201-500 funcionários',
    founded: '2010',
    rating: 4.6,
    totalReviews: 45,
    activeJobs: 12
  },
  'construtora-horizonte': {
    id: 'construtora-horizonte',
    name: 'Construtora Horizonte',
    description: 'Construtora especializada em obras de grande porte. Construímos o futuro com qualidade, segurança e inovação.',
    logo: '/logos/construtora-horizonte.svg',
    website: 'https://construtorahorizonte.com.br',
    email: 'contato@construtorahorizonte.com.br',
    phone: '(92) 3234-5683',
    location: 'Manaus, AM',
    industry: 'Construção',
    size: '51-200 funcionários',
    founded: '2012',
    rating: 4.4,
    totalReviews: 19,
    activeJobs: 6
  }
};

// Mock data padrão - substituir por dados reais do Supabase
const defaultCompany = {
  id: '1',
  name: 'TechSolutions',
  description: 'Somos uma empresa de tecnologia focada em soluções inovadoras para o mercado brasileiro. Com mais de 10 anos de experiência, desenvolvemos softwares de alta qualidade e oferecemos oportunidades de crescimento profissional.',
  logo: '/logos/techsolutions.svg',
  website: 'https://techsolutions.com.br',
  email: 'contato@techsolutions.com.br',
  phone: '(92) 3234-5678',
  location: 'Manaus, AM',
  industry: 'Tecnologia',
  size: '50-200 funcionários',
  founded: '2014',
  socialMedia: {
    linkedin: 'https://linkedin.com/company/techsolutions',
    facebook: 'https://facebook.com/techsolutions',
    twitter: 'https://twitter.com/techsolutions',
    instagram: 'https://instagram.com/techsolutions'
  },
  rating: 4.5,
  totalReviews: 23,
  activeJobs: 5,
  benefits: [
    'Vale refeição',
    'Vale transporte',
    'Plano de saúde',
    'Gympass',
    'Home office',
    'Auxílio educação'
  ],
  values: [
    'Inovação',
    'Transparência',
    'Diversidade',
    'Crescimento profissional'
  ]
};

const mockJobs = [
  {
    id: '1',
    title: 'Desenvolvedor Full Stack',
    type: 'Tempo integral',
    location: 'Manaus, AM',
    salary: 'R$ 6.000 - R$ 8.000',
    posted: '2 dias atrás'
  },
  {
    id: '2',
    title: 'Desenvolvedor Frontend',
    type: 'Tempo integral',
    location: 'Manaus, AM',
    salary: 'R$ 5.000 - R$ 7.000',
    posted: '5 dias atrás'
  },
  {
    id: '3',
    title: 'Product Manager',
    type: 'Tempo integral',
    location: 'Manaus, AM',
    salary: 'R$ 8.000 - R$ 10.000',
    posted: '1 semana atrás'
  }
];

const CompanyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // TODO: Buscar dados reais do Supabase
  const { data: company, isLoading } = useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Buscar dados da empresa baseado no ID
      if (id && companyDataMap[id]) {
        return {
          ...defaultCompany,
          ...companyDataMap[id],
          socialMedia: defaultCompany.socialMedia,
          benefits: defaultCompany.benefits,
          values: defaultCompany.values
        };
      }
      
      return defaultCompany;
    }
  });

  const { data: jobs } = useQuery({
    queryKey: ['company-jobs', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockJobs;
    }
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!company) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-grow flex items-center justify-center py-20">
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Empresa não encontrada
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                A empresa que você está procurando não existe ou foi removida.
              </p>
              <Button onClick={() => navigate('/jobs')}>
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
      
      <main className="flex-grow py-6 sm:py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header da empresa */}
          <Card className="mb-4 sm:mb-6 md:mb-8 bg-white dark:bg-gray-800">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 flex-shrink-0">
                  <AvatarImage src={company.logo || undefined} />
                  <AvatarFallback className="bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 text-lg sm:text-xl md:text-2xl">
                    <Building2 className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0">
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 break-words">
                        {company.name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{company.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{company.industry}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{company.size}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-yellow-500" />
                          <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                            {company.rating}
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          {company.totalReviews} avaliações
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Redes sociais */}
                  <div className="flex flex-wrap items-center gap-3">
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        <Globe className="h-4 w-4 mr-1" />
                        Website
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    )}
                    {company.socialMedia?.linkedin && (
                      <a
                        href={company.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {company.socialMedia?.facebook && (
                      <a
                        href={company.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {company.socialMedia?.twitter && (
                      <a
                        href={company.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {company.socialMedia?.instagram && (
                      <a
                        href={company.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conteúdo principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sobre */}
              <Card>
                <CardHeader>
                  <CardTitle>Sobre a empresa</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {company.description}
                  </p>
                  
                  {company.founded && (
                    <div className="mt-6 pt-6 border-t dark:border-gray-800">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Fundada em {company.founded}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Valores */}
              {company.values && company.values.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nossos valores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {company.values.map((value, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Vagas ativas */}
              <Card>
                <CardHeader>
                  <CardTitle>Vagas em aberto ({jobs?.length || 0})</CardTitle>
                  <CardDescription>
                    Confira as oportunidades disponíveis nesta empresa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {jobs && jobs.length > 0 ? (
                    <div className="space-y-4">
                      {jobs.map((job) => (
                        <div
                          key={job.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                          onClick={() => navigate(`/jobs/${job.id}`)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {job.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span>{job.location}</span>
                                <span>•</span>
                                <span>{job.type}</span>
                                <span>•</span>
                                <span>{job.salary}</span>
                              </div>
                            </div>
                            <Badge variant="outline" className="w-fit">
                              {job.posted}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      Nenhuma vaga disponível no momento
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Informações de contato */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações de contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {company.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <a
                        href={`mailto:${company.email}`}
                        className="text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        {company.email}
                      </a>
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <a
                        href={`tel:${company.phone}`}
                        className="text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        {company.phone}
                      </a>
                    </div>
                  )}
                  {company.location && (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {company.location}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Benefícios */}
              {company.benefits && company.benefits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Benefícios oferecidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {company.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                          <div className="h-1.5 w-1.5 rounded-full bg-brand-500 mr-2" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Ações */}
              <Card>
                <CardContent className="p-6">
                  <Button
                    className="w-full mb-3 bg-brand-500 hover:bg-brand-600"
                    onClick={() => navigate(`/jobs?company=${company.id}`)}
                  >
                    Ver todas as vagas
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/messages')}
                  >
                    Enviar mensagem
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CompanyProfile;

