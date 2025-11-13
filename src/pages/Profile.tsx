
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Briefcase, User, MapPin, Mail, Phone, Calendar, 
  Edit, Plus, X, ArrowUp, Download, FileText, Bookmark, Loader2
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import LoadingPage from './LoadingPage';
import EmailPreferencesComponent from '@/components/notifications/EmailPreferences';

const Profile = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
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
  // Se o usuário existe mas o perfil não, ainda assim mostrar a página
  if (loading && !user) {
    return <LoadingPage />;
  }

  if (!user) {
    return null;
  }
  
  const skills = [
    "React", "JavaScript", "TypeScript", "HTML", "CSS", 
    "Node.js", "Git", "SQL", "Python", "UI/UX"
  ];
  
  const education = [
    {
      degree: "Bacharelado em Ciência da Computação",
      institution: "Universidade Estadual de Campinas",
      period: "2018 - 2022"
    },
    {
      degree: "Técnico em Desenvolvimento de Software",
      institution: "ETEC Campinas",
      period: "2016 - 2017"
    }
  ];
  
  const experience = [
    {
      role: "Desenvolvedor Full Stack",
      company: "TechSolutions",
      period: "Jan 2022 - Presente",
      description: "Desenvolvimento e manutenção de aplicações web utilizando React, Node.js e SQL. Implementação de novas funcionalidades e correção de bugs."
    },
    {
      role: "Desenvolvedor Front-end",
      company: "WebCreative",
      period: "Mar 2020 - Dez 2021",
      description: "Desenvolvimento de interfaces de usuário responsivas e otimização de desempenho em aplicações web."
    }
  ];
  
  const savedJobs = [
    {
      id: 1,
      title: "Desenvolvedor Full Stack",
      company: "TechSolutions",
      location: "Manaus, AM",
      date: "Salvo há 2 dias"
    },
    {
      id: 2,
      title: "Desenvolvedor Front-end Senior",
      company: "InnovaTech",
      location: "Remoto",
      date: "Salvo há 1 semana"
    },
    {
      id: 3,
      title: "Engenheiro de Software",
      company: "SoftExpert",
      location: "Manaus, AM",
      date: "Salvo há 3 dias"
    }
  ];

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
                <TabsList className="grid grid-cols-4 w-full mb-4 sm:mb-6 h-auto">
                  <TabsTrigger value="resume" className="text-xs sm:text-sm py-2 sm:py-3">Currículo</TabsTrigger>
                  <TabsTrigger value="saved" className="text-xs sm:text-sm py-2 sm:py-3">Vagas salvas</TabsTrigger>
                  <TabsTrigger value="applications" className="text-xs sm:text-sm py-2 sm:py-3">Candidaturas</TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs sm:text-sm py-2 sm:py-3">Configurações</TabsTrigger>
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
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                          Desenvolvedora Full Stack com mais de 3 anos de experiência em desenvolvimento de aplicações web.
                          Especialista em React, Node.js e bancos de dados SQL. Apaixonada por criar interfaces intuitivas
                          e desenvolver soluções eficientes. Comprometida com aprendizado contínuo e melhoria de habilidades técnicas.
                        </p>
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
                      <CardContent className="space-y-6">
                        {experience.map((job, index) => (
                          <div key={index} className="relative">
                            <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{job.role}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
                            <p className="text-gray-500 dark:text-gray-500 text-sm mb-2">{job.period}</p>
                            <p className="text-gray-700 dark:text-gray-300">{job.description}</p>
                            {index < experience.length - 1 && <Separator className="mt-4" />}
                          </div>
                        ))}
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
                      <CardContent className="space-y-6">
                        {education.map((edu, index) => (
                          <div key={index} className="relative">
                            <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{edu.degree}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>
                            <p className="text-gray-500 dark:text-gray-500 text-sm">{edu.period}</p>
                            {index < education.length - 1 && <Separator className="mt-4" />}
                          </div>
                        ))}
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
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-white">Português</span>
                            <span className="text-gray-600 dark:text-gray-400">Nativo</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-white">Inglês</span>
                            <span className="text-gray-600 dark:text-gray-400">Fluente</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-white">Espanhol</span>
                            <span className="text-gray-600 dark:text-gray-400">Intermediário</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Additional Documents */}
                    <Card className="bg-white dark:bg-gray-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-gray-900 dark:text-white">Documentos adicionais</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-md mb-3 bg-gray-50 dark:bg-gray-700/50">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Currículo_MariaC.pdf</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Adicionado em 12/04/2023</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Button variant="outline" className="w-full">
                          <Plus className="mr-2 h-4 w-4" /> Adicionar documento
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Saved Jobs Tab */}
                <TabsContent value="saved">
                  <Card className="bg-white dark:bg-gray-800">
                    <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
                      <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">Vagas salvas</CardTitle>
                      <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Gerencie as vagas que você salvou para se candidatar mais tarde
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                      <div className="space-y-3 sm:space-y-4">
                        {savedJobs.map(job => (
                          <div key={job.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 border dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors bg-white dark:bg-gray-800">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-base sm:text-lg text-gray-900 dark:text-white">{job.title}</h3>
                              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{job.company}</p>
                              <div className="flex flex-wrap items-center gap-1 sm:gap-0 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <div className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span>{job.location}</span>
                                </div>
                                <span className="hidden sm:inline mx-2 text-gray-400 dark:text-gray-600">•</span>
                                <span>{job.date}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <Link to={`/jobs/${job.id}`} className="flex-1 sm:flex-initial">
                                <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                                  Ver vaga
                                </Button>
                              </Link>
                              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 text-red-500">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Applications Tab */}
                <TabsContent value="applications">
                  <Card className="bg-white dark:bg-gray-800">
                    <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
                      <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">Candidaturas</CardTitle>
                      <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Acompanhe o status de todas as suas candidaturas
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                            <h3 className="font-medium text-base sm:text-lg text-gray-900 dark:text-white">Desenvolvedor Full Stack</h3>
                            <Badge className="text-xs">Em análise</Badge>
                          </div>
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">TechSolutions</p>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-0 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>Manaus, AM</span>
                            </div>
                            <span className="hidden sm:inline mx-2 text-gray-400 dark:text-gray-600">•</span>
                            <span>Candidatura enviada há 5 dias</span>
                          </div>
                        </div>
                        
                        <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                            <h3 className="font-medium text-base sm:text-lg text-gray-900 dark:text-white">Front-end Developer</h3>
                            <Badge variant="outline" className="text-xs">Visualizado</Badge>
                          </div>
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">WebInnovate</p>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-0 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>Remoto</span>
                            </div>
                            <span className="hidden sm:inline mx-2 text-gray-400 dark:text-gray-600">•</span>
                            <span>Candidatura enviada há 1 semana</span>
                          </div>
                        </div>
                        
                        <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                            <h3 className="font-medium text-base sm:text-lg text-gray-900 dark:text-white">Desenvolvedor React</h3>
                            <Badge variant="destructive" className="text-xs">Encerrada</Badge>
                          </div>
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Digital Solutions</p>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-0 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>Manaus, AM</span>
                            </div>
                            <span className="hidden sm:inline mx-2 text-gray-400 dark:text-gray-600">•</span>
                            <span>Candidatura enviada há 2 semanas</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
