
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Building2, BriefcaseBusiness, Briefcase, DollarSign, MapPin, Clock, CheckCircle } from 'lucide-react';

const Advertise = () => {
  const [jobType, setJobType] = useState('standard');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Vaga cadastrada com sucesso!",
      description: "Sua vaga foi enviada para análise e será publicada em breve.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-12 bg-gradient-to-b from-brand-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Anuncie sua vaga
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              Encontre os melhores profissionais para a sua empresa
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Job Posting Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes da vaga</CardTitle>
                  <CardDescription>
                    Preencha as informações abaixo para criar seu anúncio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="job-title">Título da vaga</Label>
                        <Input id="job-title" placeholder="Ex: Desenvolvedor Full Stack" required />
                      </div>
                      
                      <div>
                        <Label htmlFor="company-name">Nome da empresa</Label>
                        <Input id="company-name" placeholder="Ex: TechSolutions" required />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="job-location">Localização</Label>
                          <Input id="job-location" placeholder="Ex: Manaus, AM" required />
                        </div>
                        <div>
                          <Label htmlFor="work-model">Modelo de trabalho</Label>
                          <Select defaultValue="presencial">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o modelo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="presencial">Presencial</SelectItem>
                              <SelectItem value="remoto">Remoto</SelectItem>
                              <SelectItem value="hibrido">Híbrido</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="job-type">Tipo de contratação</Label>
                          <Select defaultValue="clt">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="clt">CLT</SelectItem>
                              <SelectItem value="pj">PJ</SelectItem>
                              <SelectItem value="estagio">Estágio</SelectItem>
                              <SelectItem value="temporario">Temporário</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="experience-level">Nível de experiência</Label>
                          <Select defaultValue="pleno">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o nível" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="estagiario">Estagiário</SelectItem>
                              <SelectItem value="junior">Júnior</SelectItem>
                              <SelectItem value="pleno">Pleno</SelectItem>
                              <SelectItem value="senior">Sênior</SelectItem>
                              <SelectItem value="especialista">Especialista</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="salary-range">Faixa salarial</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a faixa salarial" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ate-2000">Até R$ 2.000</SelectItem>
                            <SelectItem value="2001-3000">R$ 2.001 a R$ 3.000</SelectItem>
                            <SelectItem value="3001-4000">R$ 3.001 a R$ 4.000</SelectItem>
                            <SelectItem value="4001-5000">R$ 4.001 a R$ 5.000</SelectItem>
                            <SelectItem value="5001-7000">R$ 5.001 a R$ 7.000</SelectItem>
                            <SelectItem value="7001-10000">R$ 7.001 a R$ 10.000</SelectItem>
                            <SelectItem value="acima-10000">Acima de R$ 10.000</SelectItem>
                            <SelectItem value="a-combinar">A combinar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Benefícios</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="benefit-vr" />
                            <Label htmlFor="benefit-vr" className="cursor-pointer">Vale Refeição</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="benefit-vt" />
                            <Label htmlFor="benefit-vt" className="cursor-pointer">Vale Transporte</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="benefit-health" />
                            <Label htmlFor="benefit-health" className="cursor-pointer">Plano de Saúde</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="benefit-dental" />
                            <Label htmlFor="benefit-dental" className="cursor-pointer">Plano Odontológico</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="benefit-gym" />
                            <Label htmlFor="benefit-gym" className="cursor-pointer">Gympass</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="benefit-profit" />
                            <Label htmlFor="benefit-profit" className="cursor-pointer">PLR</Label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="job-description">Descrição da vaga</Label>
                        <Textarea 
                          id="job-description" 
                          placeholder="Descreva detalhadamente as responsabilidades, requisitos e o dia a dia do profissional..." 
                          rows={6}
                          required 
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="required-skills">Habilidades necessárias</Label>
                        <Input id="required-skills" placeholder="Ex: React, Node.js, SQL (separadas por vírgula)" />
                      </div>

                      <div className="pt-4">
                        <Label className="text-lg font-medium mb-2 block">Escolha seu plano de anúncio</Label>
                        <Tabs value={jobType} onValueChange={setJobType} className="w-full pt-2">
                          <TabsList className="grid grid-cols-3 w-full">
                            <TabsTrigger value="basic">Básico</TabsTrigger>
                            <TabsTrigger value="standard">Padrão</TabsTrigger>
                            <TabsTrigger value="premium">Premium</TabsTrigger>
                          </TabsList>
                          <TabsContent value="basic" className="p-4 border dark:border-gray-700 rounded-md mt-2 bg-white dark:bg-gray-800">
                            <p className="font-bold text-gray-900 dark:text-white">R$ 99,00</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Visibilidade por 7 dias</p>
                          </TabsContent>
                          <TabsContent value="standard" className="p-4 border rounded-md mt-2 border-brand-500 dark:border-brand-400 bg-brand-50 dark:bg-brand-900/20">
                            <p className="font-bold text-gray-900 dark:text-white">R$ 199,00</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Visibilidade por 15 dias + destaque na lista</p>
                          </TabsContent>
                          <TabsContent value="premium" className="p-4 border dark:border-gray-700 rounded-md mt-2 bg-white dark:bg-gray-800">
                            <p className="font-bold text-gray-900 dark:text-white">R$ 399,00</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Visibilidade por 30 dias + destaque na lista + envio para candidatos selecionados</p>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">Publicar vaga</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Por que anunciar conosco?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-brand-100 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Alcance qualificado</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Mais de 100.000 profissionais cadastrados na região de Campinas e SP</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-brand-100 dark:bg-brand-900 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Ferramentas de triagem</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Filtros avançados para encontrar o candidato ideal</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-brand-100 dark:bg-brand-900 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Análise de desempenho</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Estatísticas completas sobre visualizações e candidaturas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Vagas em destaque</CardTitle>
                  <CardDescription>Exemplos de vagas atualmente em destaque</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border dark:border-gray-700 p-4 rounded-md bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">Desenvolvedor Full Stack</h4>
                      <Badge>Destaque</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">TechSolutions</p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>Manaus, AM</span>
                    </div>
                  </div>
                  
                  <div className="border dark:border-gray-700 p-4 rounded-md bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">Analista de Marketing Digital</h4>
                      <Badge>Destaque</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Digital Growth</p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>Remoto</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Precisa de ajuda?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Entre em contato com nosso time de suporte para tirar dúvidas ou solicitar um pacote personalizado para sua empresa.
                  </p>
                  <Button variant="outline" className="w-full">Falar com consultor</Button>
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

export default Advertise;
