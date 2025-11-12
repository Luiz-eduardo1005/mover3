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
import { Card, CardContent } from "@/components/ui/card";
import { Users, Keyboard, Eye, Volume2, CheckCircle } from 'lucide-react';

const AccessibilityNotice = () => {
  const features = [
    {
      icon: Keyboard,
      title: 'Navegação por Teclado',
      description: 'Todos os elementos são acessíveis via teclado'
    },
    {
      icon: Eye,
      title: 'Leitor de Tela',
      description: 'Suporte completo para leitores de tela (NVDA, JAWS, VoiceOver)'
    },
    {
      icon: Volume2,
      title: 'Alto Contraste',
      description: 'Suporte para modo de alto contraste do sistema'
    },
    {
      icon: Users,
      title: 'WCAG 2.1 AA',
      description: 'Conformidade com as diretrizes internacionais de acessibilidade'
    }
  ];

  return (
    <section className="py-16 bg-brand-50 border-t border-brand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600 rounded-full mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Plataforma MOVER - Totalmente Acessível
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compromisso com a inclusão digital. Nossa plataforma foi desenvolvida pensando em pessoas com todos os tipos de deficiência.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 border-brand-200 hover:border-brand-500 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                      <Icon className="h-6 w-6 text-brand-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-white border-2 border-brand-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-brand-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Recursos de Acessibilidade Implementados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-600" />
                    <span>Labels descritivos para campos de formulário</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-600" />
                    <span>Estrutura semântica HTML5</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-600" />
                    <span>Atalhos de teclado para navegação</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-600" />
                    <span>Contraste de cores aprimorado</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-600" />
                    <span>Redução de animações para usuários sensíveis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-brand-600" />
                    <span>ARIA labels em elementos interativos</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-brand-500 to-brand-600 text-white border-2 border-brand-400 mt-6">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-white flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-3">Certificação WCAG 2.1 Nível AA</h3>
                <p className="text-sm text-white/90 mb-3">
                  A plataforma MOVER foi desenvolvida seguindo rigorosamente as Diretrizes de Acessibilidade para o Conteúdo da Web (WCAG) 2.1, Nível AA, 
                  uma norma internacional desenvolvida pelo W3C que descreve como proporcionar acessibilidade de conteúdos Web a pessoas com deficiência.
                </p>
                <p className="text-sm text-white/90 mb-3">
                  Estas orientações ajudam a adaptar sítios Web e aplicações móveis a utilizadores com deficiências visuais, auditivas, motoras e cognitivas.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Nível A - Mínimo</span>
                  <span className="px-3 py-1 bg-white/30 rounded-full text-xs font-medium">Nível AA - Alcançado ✅</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Conformidade Legal</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-50 border-2 border-brand-200 mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3 text-center">Desenvolvido por Alunos da FAMETRO</h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              Este projeto foi desenvolvido por alunos do curso de Análise e Desenvolvimento de Sistemas (ADS) da 
              FAMETRO - Faculdade Metropolitana de Manaus, Unidade Sul Cachoeirinha, no 2º período de 2025, 
              como parte de um projeto acadêmico focado em acessibilidade e inclusão digital.
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Precisa de suporte adicional? Entre em contato através do nosso{' '}
            <a href="/contact" className="text-brand-600 hover:underline font-medium">
              formulário de contato
            </a>
            {' '}ou pelo email: <a href="mailto:acessibilidade@mover.com.br" className="text-brand-600 hover:underline font-medium">acessibilidade@mover.com.br</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AccessibilityNotice;
