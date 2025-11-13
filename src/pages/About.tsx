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
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from 'react-router-dom';
import { Briefcase, Users, BarChart, Award, CheckCircle, MapPin, Building } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-brand-50 to-white dark:from-gray-900 dark:to-gray-800">
          {/* Banner de fundo */}
          <div 
            className="absolute inset-0 opacity-75"
            style={{ 
              backgroundImage: 'url(/images/about-banner.jpg)', 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }}
          ></div>

          {/* Conteúdo */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Conectando talentos e oportunidades
            </h1>
            <p className="mt-6 text-xl text-gray-500 dark:text-gray-300 max-w-3xl mx-auto">
              A MOVER é uma plataforma inclusiva de recrutamento desenvolvida por alunos da FAMETRO Manaus, 
              voltada para pessoas com deficiência em Manaus e todo o Brasil, conectando profissionais talentosos 
              com oportunidades respeitosas e acessíveis, promovendo empregabilidade com inclusão e acessibilidade.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button asChild size="lg" className="bg-brand-500 hover:bg-brand-600">
                <Link to="/register">Cadastre-se</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/jobs">Ver vagas</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-brand-600">WCAG 2.1</p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Conformidade Nível AA</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-brand-600 dark:text-brand-400">100%</p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Acessível e Inclusivo</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-brand-600 dark:text-brand-400">FAMETRO</p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Projeto Acadêmico</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-brand-600 dark:text-brand-400">2025</p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Ano de Criação</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Tabs Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Conheça a MOVER</h2>
            
            <Tabs defaultValue="mission" className="max-w-4xl mx-auto">
              <TabsList className="grid grid-cols-3 w-full mb-8">
                <TabsTrigger value="mission">Missão</TabsTrigger>
                <TabsTrigger value="history">Nossa História</TabsTrigger>
                <TabsTrigger value="team">Equipe</TabsTrigger>
              </TabsList>
              
              <TabsContent value="mission" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-brand-100 p-3 rounded-full">
                      <Briefcase className="h-6 w-6 text-brand-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-medium">Nossa Missão</h4>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Conectar pessoas com deficiência a oportunidades de emprego inclusivas e respeitosas, 
                        promovendo empregabilidade, mobilidade social e desenvolvimento profissional com acessibilidade e dignidade.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-brand-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-brand-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-medium">Nossos Valores</h4>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Acessibilidade universal, respeito à diversidade, inclusão social, transparência, 
                        inovação e compromisso com a empregabilidade de pessoas com deficiência são os valores que guiam todas as nossas ações.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-brand-100 p-3 rounded-full">
                      <BarChart className="h-6 w-6 text-brand-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-medium">Nossa Visão</h4>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Ser a plataforma líder de recrutamento inclusivo do Brasil, referência em acessibilidade e empregabilidade, 
                        transformando o mercado de trabalho para ser verdadeiramente inclusivo e respeitoso com todas as diferenças.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="space-y-6">
                  <p className="text-gray-600 dark:text-gray-300">
                    A MOVER foi criada em 2025 por um grupo de alunos do curso de Análise e Desenvolvimento de Sistemas (ADS) da FAMETRO - Faculdade Metropolitana de Manaus, 
                    unidade Sul Cachoeirinha, no segundo período do curso. 
                    O projeto nasceu da necessidade de criar uma plataforma inclusiva e acessível que atendesse às necessidades específicas 
                    de pessoas com deficiência no mercado de trabalho, promovendo igualdade de oportunidades e respeito à diversidade.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-brand-100 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-brand-600" />
                      </div>
                      <p><span className="font-bold">Janeiro 2025:</span> Início do projeto MOVER pelos alunos de ADS da FAMETRO Manaus - Unidade Sul Cachoeirinha</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-brand-100 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-brand-600" />
                      </div>
                      <p><span className="font-bold">Fevereiro 2025:</span> Desenvolvimento da plataforma com foco em acessibilidade universal e empregabilidade</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-brand-100 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-brand-600" />
                      </div>
                      <p><span className="font-bold">Março 2025:</span> Implementação de recursos de acessibilidade (leitor de tela, navegação por teclado, alto contraste, WCAG 2.1)</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-brand-100 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-brand-600" />
                      </div>
                      <p><span className="font-bold">Abril 2025:</span> Certificação de conformidade com WCAG 2.1 Nível AA - Diretrizes de Acessibilidade para o Conteúdo da Web</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-brand-100 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-brand-600" />
                      </div>
                      <p><span className="font-bold">Hoje:</span> Conectando pessoas com deficiência em Manaus e Brasil a oportunidades respeitosas e acessíveis</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-lg border-l-4 border-brand-600 dark:border-brand-400">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>FAMETRO - Faculdade Metropolitana de Manaus</strong><br/>
                      Curso: Análise e Desenvolvimento de Sistemas (ADS)<br/>
                      Período: 2º Período - 2025<br/>
                      Unidade: Sul Cachoeirinha, Manaus - AM
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="team" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="text-center mb-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Projeto desenvolvido pelos alunos de ADS da FAMETRO - 2º Período 2025
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-brand-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Luis Roberto Lins de Almeida</h4>
                  </div>
                  <div className="bg-brand-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Victor Hugo de Paula Ferreira</h4>
                  </div>
                  <div className="bg-brand-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Luiz Gustavo de Souza Feitosa</h4>
                  </div>
                  <div className="bg-brand-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Mozart Brian de Almeida Assunção</h4>
                  </div>
                  <div className="bg-brand-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Alan Medeiros Batista</h4>
                  </div>
                  <div className="bg-brand-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Vinícius da Silva Pereira</h4>
                  </div>
                  <div className="bg-brand-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Milena Lima Varela</h4>
                  </div>
                  <div className="bg-brand-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Kaiky Alex Barroso dos Santos</h4>
                  </div>
                  <div className="bg-brand-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Alex Victor Oliveira Cortez dos Santos</h4>
                  </div>
                  <div className="bg-brand-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Luiz Eduardo Martins Figueredo</h4>
                  </div>
                  <div className="bg-brand-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Luiz Gabriel Alves Candido da Silva</h4>
                  </div>
                  <div className="bg-brand-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Cauan Bastos Mendonça de Oliveira</h4>
                  </div>
                  <div className="bg-brand-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Marcos Vinicius Nicacio Tavares</h4>
                  </div>
                  <div className="bg-brand-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Isaías Emanuel Vinhote Coelho</h4>
                  </div>
                  <div className="bg-brand-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Matheus Aurélio Nunes Barbosa</h4>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Resto do código permanece igual */}
        {/* Partners Section */}
        {/* Contact Section */}
      </main>

      <Footer />
    </div>
  );
};

export default About;
