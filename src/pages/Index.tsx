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
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/search/SearchBar';
import AccessibilityNotice from '@/components/AccessibilityNotice';
import { Briefcase, User, Search } from 'lucide-react';
import JobList from '@/components/jobs/JobList';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 md:py-20">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-75"
            style={{ backgroundImage: 'url("/banner.jpg")' }}
          ></div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-brand-50 dark:from-gray-900 dark:to-gray-800 opacity-75"></div>
          {/* Content */}
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-2">
                  Encontre seu emprego ideal em Manaus e em todo o Brasil
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                  Plataforma desenvolvida por alunos da FAMETRO Manaus. Conectamos pessoas com deficiência a oportunidades de trabalho inclusivas e acessíveis. 
                  Milhares de vagas de emprego atualizadas diariamente, com foco em inclusão e respeito, seguindo WCAG 2.1 Nível AA.
                </p>

                <div className="max-w-4xl mx-auto px-4">
                  <SearchBar />
                </div>

                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
                  <Link to="/register" className="w-full sm:w-auto">
                    <Button variant="default" size="lg" className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600" aria-label="Cadastrar seu currículo na plataforma MOVER">
                      <User className="mr-2 h-5 w-5" aria-hidden="true" />
                      Cadastre seu currículo
                    </Button>
                  </Link>
                  <Link to="/advertise" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto" aria-label="Anunciar vaga inclusiva">
                      <Briefcase className="mr-2 h-5 w-5" aria-hidden="true" />
                      Anunciar vaga
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Job Listings */}
        <section className="py-8 sm:py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Vagas em destaque em Manaus
              </h2>
              <Link to="/jobs" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium text-sm sm:text-base">
                Ver todas as vagas →
              </Link>
            </div>

            <JobList />
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 sm:py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center px-2">
              Explore por categoria
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
              {['Tecnologia', 'Saúde', 'Educação', 'Finanças', 'Marketing', 'Vendas', 'Administração', 'Engenharia'].map((category) => (
                <Link to={`/jobs?category=${category}`} key={category}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow card-hover min-h-[100px] sm:min-h-[120px] flex flex-col justify-center border border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-base sm:text-lg text-gray-900 dark:text-white">{category}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Vagas disponíveis</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Companies */}
        <section className="py-8 sm:py-12 md:py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center px-2">
              Empresas em destaque
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {[
                { id: 'techsolutions', name: 'TechSolutions', logo: '/logos/techsolutions.svg' },
                { id: 'empresa-inovadora', name: 'Empresa Inovadora', logo: '/logos/empresa-inovadora.svg' },
                { id: 'vendamais', name: 'VendaMais', logo: '/logos/vendamais.svg' },
                { id: 'adminpro', name: 'AdminPro', logo: '/logos/adminpro.svg' },
                { id: 'hospital-central', name: 'Hospital Central', logo: '/logos/hospital-central.svg' },
                { id: 'construtora-horizonte', name: 'Construtora Horizonte', logo: '/logos/construtora-horizonte.svg' }
              ].map((company) => (
                <Link 
                  key={company.id} 
                  to={`/company/${company.id}`}
                  className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 flex items-center justify-center h-20 sm:h-24 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="w-full h-full rounded flex items-center justify-center overflow-hidden">
                    <img 
                      src={company.logo} 
                      alt={`${company.name} logo`}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        // Se a imagem não carregar, mostrar placeholder
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `<span class="text-gray-400 dark:text-gray-500 font-medium text-xs sm:text-sm">${company.name}</span>`;
                        }
                      }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Accessibility Section */}
        <AccessibilityNotice />

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-brand-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 px-2">
              Pronto para encontrar seu próximo emprego inclusivo?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-brand-100 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Cadastre-se gratuitamente na plataforma MOVER - desenvolvida por alunos da FAMETRO Manaus - 
              e tenha acesso a milhares de vagas inclusivas em Manaus e em todo o Brasil, 
              com suporte dedicado a pessoas com deficiência e total acessibilidade WCAG 2.1 Nível AA.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto" aria-label="Cadastrar currículo agora">
                  Cadastrar currículo
                </Button>
              </Link>
              <Link to="/jobs" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-brand-600" aria-label="Buscar vagas disponíveis">
                  Buscar vagas
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;