
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { 
  FileText, Upload, Plus, X, Briefcase, Building, Calendar, 
  GraduationCap, Languages, Award, MapPin, User, Phone, Mail
} from 'lucide-react';

const CurriculumRegistration = () => {
  const [step, setStep] = useState(1);
  const [uploadMode, setUploadMode] = useState('form');
  
  const handleNextStep = () => {
    if (step < 5) setStep(step + 1);
    else {
      toast({
        title: "Currículo cadastrado com sucesso!",
        description: "Seu currículo foi cadastrado e já está disponível para consulta pelas empresas.",
      });
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-10 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cadastre seu currículo</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Preencha as informações abaixo para criar seu currículo e aumentar suas chances de conseguir uma vaga
            </p>
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full 
                    ${step >= i ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                >
                  {i}
                  {i !== 5 && (
                    <div 
                      className={`absolute top-5 left-10 h-0.5 w-[calc(100%-2.5rem)] 
                      ${step > i ? 'bg-brand-500' : 'bg-gray-200'}`}
                    >
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
              <span>Informações<br />Pessoais</span>
              <span>Experiência<br />Profissional</span>
              <span>Formação<br />Acadêmica</span>
              <span>Habilidades<br />& Idiomas</span>
              <span>Resumo<br />& Finalizar</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && "Informações Pessoais"}
                {step === 2 && "Experiência Profissional"}
                {step === 3 && "Formação Acadêmica"}
                {step === 4 && "Habilidades e Idiomas"}
                {step === 5 && "Resumo e Preferências"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Preencha seus dados de contato e informações básicas"}
                {step === 2 && "Adicione suas experiências profissionais anteriores"}
                {step === 3 && "Informe sua formação acadêmica"}
                {step === 4 && "Adicione suas habilidades e conhecimento em idiomas"}
                {step === 5 && "Confira e finalize seu currículo"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <Tabs value={uploadMode} onValueChange={setUploadMode} className="w-full">
                    <TabsList className="grid grid-cols-2 w-full mb-4">
                      <TabsTrigger value="form">Preencher formulário</TabsTrigger>
                      <TabsTrigger value="upload">Enviar currículo</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="form" className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name" className="text-gray-900 dark:text-white">Nome</Label>
                          <Input id="first-name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name" className="text-gray-900 dark:text-white">Sobrenome</Label>
                          <Input id="last-name" required />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-900 dark:text-white">Email</Label>
                          <Input id="email" type="email" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-gray-900 dark:text-white">Telefone</Label>
                          <Input id="phone" required />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-gray-900 dark:text-white">Cidade</Label>
                          <Input id="city" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state" className="text-gray-900 dark:text-white">Estado</Label>
                          <Input id="state" required />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="profession" className="text-gray-900 dark:text-white">Profissão/Cargo atual</Label>
                          <Input id="profession" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linkedin" className="text-gray-900 dark:text-white">LinkedIn (opcional)</Label>
                          <Input id="linkedin" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="portfolio" className="text-gray-900 dark:text-white">Portfólio ou site pessoal (opcional)</Label>
                        <Input id="portfolio" />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="upload">
                      <div className="py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md text-center">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Arraste seu currículo ou clique para selecionar</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Suporte para PDF, DOCX ou TXT (máx. 5MB)</p>
                        <Button variant="outline" className="mx-auto">
                          <Upload className="mr-2 h-4 w-4" /> Selecionar arquivo
                        </Button>
                      </div>
                      <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Ao enviar seu currículo, automaticamente extrairemos seus dados para 
                        facilitar a criação do seu perfil. Você poderá revisar e editar as informações extraídas.
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
              
              {/* Step 2: Professional Experience */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-md p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Desenvolvedor Full Stack</h3>
                        <p className="text-gray-600 dark:text-gray-400">TechSolutions</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Jan 2022 - Atual</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Desenvolvimento e manutenção de aplicações web utilizando React, Node.js e SQL. 
                      Implementação de novas funcionalidades e correção de bugs.
                    </p>
                  </div>
                  
                    <Card className="border border-dashed bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-4 text-gray-900 dark:text-white">Adicionar experiência</h3>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="job-title">Cargo</Label>
                            <Input id="job-title" placeholder="Ex: Desenvolvedor Full Stack" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="company">Empresa</Label>
                            <Input id="company" placeholder="Ex: TechSolutions" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="start-date">Data de início</Label>
                            <Input id="start-date" type="month" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="end-date">Data de término</Label>
                            <Input id="end-date" type="month" />
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch id="current-job" />
                          <Label htmlFor="current-job">Trabalho atual</Label>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="job-description">Descrição das atividades</Label>
                          <Textarea 
                            id="job-description" 
                            placeholder="Descreva suas responsabilidades e conquistas neste cargo..." 
                            rows={4}
                          />
                        </div>
                        
                        <Button className="w-full">
                          <Plus className="h-4 w-4 mr-2" /> Adicionar experiência
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Step 3: Education */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-md p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Bacharelado em Ciência da Computação</h3>
                        <p className="text-gray-600 dark:text-gray-400">Universidade Estadual de Campinas</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">2018 - 2022</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                    <Card className="border border-dashed bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-4 text-gray-900 dark:text-white">Adicionar formação</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="degree">Curso/Grau</Label>
                          <Input id="degree" placeholder="Ex: Bacharelado em Ciência da Computação" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="institution">Instituição</Label>
                          <Input id="institution" placeholder="Ex: Universidade Estadual de Campinas" />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edu-start-date">Data de início</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o ano" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(year => (
                                  <SelectItem key={year} value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edu-end-date">Data de conclusão</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o ano" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(year => (
                                  <SelectItem key={year} value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                ))}
                                <SelectItem value="current">Em andamento</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="additional-info">Informações adicionais (opcional)</Label>
                          <Textarea 
                            id="additional-info" 
                            placeholder="Ex: Ênfase em Inteligência Artificial, Projetos relevantes, etc." 
                            rows={3}
                          />
                        </div>
                        
                        <Button className="w-full">
                          <Plus className="h-4 w-4 mr-2" /> Adicionar formação
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="pt-4 pb-2">
                    <h3 className="font-medium mb-4 text-gray-900 dark:text-white">Cursos e certificações</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-md p-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">AWS Certified Developer</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Amazon Web Services, 2023</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        <Plus className="h-4 w-4 mr-2" /> Adicionar certificação
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 4: Skills and Languages */}
              {step === 4 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-medium mb-4 text-gray-900 dark:text-white">Habilidades profissionais</h3>
                    
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {["React", "JavaScript", "TypeScript", "Node.js", "Python", "SQL"].map((skill) => (
                          <Badge key={skill} variant="secondary" className="pl-3 pr-2 py-1.5">
                            {skill}
                            <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Input placeholder="Adicione uma habilidade..." className="flex-grow" />
                        <Button>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Dica: Adicione habilidades técnicas e ferramentas com as quais você tem experiência
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-4 text-gray-900 dark:text-white">Idiomas</h3>
                    
                    <div className="space-y-4 mb-4">
                      <div className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-md p-4">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">Português</h4>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nativo</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-500" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-md p-4">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">Inglês</h4>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Avançado</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-500" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <Card className="border border-dashed bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-4 text-gray-900 dark:text-white">Adicionar idioma</h4>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="language">Idioma</Label>
                            <Input id="language" placeholder="Ex: Espanhol" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="proficiency">Nível</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o nível" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="basic">Básico</SelectItem>
                                <SelectItem value="intermediate">Intermediário</SelectItem>
                                <SelectItem value="advanced">Avançado</SelectItem>
                                <SelectItem value="fluent">Fluente</SelectItem>
                                <SelectItem value="native">Nativo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <Button className="w-full">
                            <Plus className="h-4 w-4 mr-2" /> Adicionar idioma
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              
              {/* Step 5: Summary and Preferences */}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="summary">Resumo profissional</Label>
                      <Textarea 
                        id="summary" 
                        placeholder="Escreva um breve resumo sobre sua experiência, objetivos e qualificações..." 
                        rows={5}
                        defaultValue="Desenvolvedor Full Stack com 3 anos de experiência em desenvolvimento de aplicações web. Especialista em React, Node.js e bancos de dados SQL. Apaixonado por criar interfaces intuitivas e desenvolver soluções eficientes. Comprometido com aprendizado contínuo e melhoria de habilidades técnicas."
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Este resumo será exibido no topo do seu perfil para recrutadores
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">Preferências de trabalho</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="desired-position">Cargo desejado</Label>
                        <Input id="desired-position" defaultValue="Desenvolvedor Full Stack" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="desired-location">Local desejado</Label>
                        <Input id="desired-location" defaultValue="Manaus, AM (ou remoto)" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="employment-type">Tipo de contratação</Label>
                        <Select defaultValue="clt">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="clt">CLT</SelectItem>
                            <SelectItem value="pj">PJ</SelectItem>
                            <SelectItem value="both">CLT ou PJ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="work-model">Modelo de trabalho</Label>
                        <Select defaultValue="hybrid">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="remote">Remoto</SelectItem>
                            <SelectItem value="onsite">Presencial</SelectItem>
                            <SelectItem value="hybrid">Híbrido</SelectItem>
                            <SelectItem value="any">Qualquer modelo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="desired-salary">Pretensão salarial (opcional)</Label>
                      <Input id="desired-salary" placeholder="Ex: R$ 8.000,00" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">Visibilidade do currículo</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Currículo visível para recrutadores</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Recrutadores poderão encontrar seu perfil em buscas
                        </p>
                      </div>
                      <Switch id="cv-visible" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Receber alertas de vagas</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Notificações sobre vagas compatíveis com seu perfil
                        </p>
                      </div>
                      <Switch id="job-alerts" defaultChecked />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={handlePrevStep}
                  disabled={step === 1}
                >
                  Voltar
                </Button>
                <Button onClick={handleNextStep}>
                  {step === 5 ? "Finalizar cadastro" : "Próximo"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CurriculumRegistration;
