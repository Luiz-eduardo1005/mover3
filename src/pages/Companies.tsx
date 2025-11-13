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
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Search, MapPin, Users, Star, Briefcase } from 'lucide-react';

// Dados das empresas com logos
const companiesData = [
  {
    id: 'techsolutions',
    name: 'TechSolutions',
    logo: '/logos/techsolutions.svg',
    industry: 'Tecnologia',
    location: 'Manaus, AM',
    size: '50-200 funcionários',
    rating: 4.5,
    totalReviews: 23,
    activeJobs: 5,
    description: 'Empresa de tecnologia focada em soluções inovadoras'
  },
  {
    id: 'empresa-inovadora',
    name: 'Empresa Inovadora',
    logo: '/logos/empresa-inovadora.svg',
    industry: 'Marketing',
    location: 'Manaus, AM',
    size: '11-50 funcionários',
    rating: 4.3,
    totalReviews: 15,
    activeJobs: 3,
    description: 'Agência de marketing digital especializada em crescimento'
  },
  {
    id: 'vendamais',
    name: 'VendaMais',
    logo: '/logos/vendamais.svg',
    industry: 'Vendas',
    location: 'Manaus, AM',
    size: '51-200 funcionários',
    rating: 4.7,
    totalReviews: 31,
    activeJobs: 8,
    description: 'Empresa líder em soluções de vendas e relacionamento'
  },
  {
    id: 'adminpro',
    name: 'AdminPro',
    logo: '/logos/adminpro.svg',
    industry: 'Administração',
    location: 'Manaus, AM',
    size: '1-10 funcionários',
    rating: 4.2,
    totalReviews: 8,
    activeJobs: 2,
    description: 'Soluções administrativas e consultoria empresarial'
  },
  {
    id: 'hospital-central',
    name: 'Hospital Central',
    logo: '/logos/hospital-central.svg',
    industry: 'Saúde',
    location: 'Manaus, AM',
    size: '201-500 funcionários',
    rating: 4.6,
    totalReviews: 45,
    activeJobs: 12,
    description: 'Hospital de referência em atendimento de qualidade'
  },
  {
    id: 'construtora-horizonte',
    name: 'Construtora Horizonte',
    logo: '/logos/construtora-horizonte.svg',
    industry: 'Construção',
    location: 'Manaus, AM',
    size: '51-200 funcionários',
    rating: 4.4,
    totalReviews: 19,
    activeJobs: 6,
    description: 'Construtora especializada em obras de grande porte'
  }
];

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const navigate = useNavigate();

  const industries = ['all', 'Tecnologia', 'Marketing', 'Vendas', 'Administração', 'Saúde', 'Construção'];

  const filteredCompanies = companiesData.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
              Empresas
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
              Conheça as empresas que estão contratando e encontre oportunidades de trabalho
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <Input
                type="text"
                placeholder="Buscar empresas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 sm:pl-10 py-5 sm:py-6 text-sm sm:text-base"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {industries.map(industry => (
                <Button
                  key={industry}
                  variant={selectedIndustry === industry ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedIndustry(industry)}
                  className={`text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 ${selectedIndustry === industry ? "bg-brand-500 hover:bg-brand-600" : ""}`}
                >
                  {industry === 'all' ? 'Todas' : industry}
                </Button>
              ))}
            </div>
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCompanies.map((company) => (
              <Card 
                key={company.id} 
                className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/company/${company.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {company.logo ? (
                          <img 
                            src={company.logo} 
                            alt={`${company.name} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              // Se a imagem não carregar, mostrar ícone
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              if (target.parentElement) {
                                target.parentElement.innerHTML = '<Building2 class="h-8 w-8 text-gray-400 dark:text-gray-500" />';
                              }
                            }}
                          />
                        ) : (
                          <Building2 className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-xl text-gray-900 dark:text-white mb-1 truncate">
                          {company.name}
                        </CardTitle>
                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">{company.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">
                    {company.description}
                  </p>
                  
                  <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Setor:</span>
                      <Badge variant="secondary" className="text-xs">{company.industry}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                        Tamanho:
                      </span>
                      <span className="text-gray-900 dark:text-white text-xs sm:text-sm">{company.size}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                        Avaliação:
                      </span>
                      <span className="text-gray-900 dark:text-white text-xs sm:text-sm">
                        {company.rating} ({company.totalReviews})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
                        Vagas ativas:
                      </span>
                      <span className="text-brand-600 dark:text-brand-400 font-medium text-xs sm:text-sm">
                        {company.activeJobs}
                      </span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-brand-500 hover:bg-brand-600 text-xs sm:text-sm py-2 sm:py-2.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/company/${company.id}`);
                    }}
                  >
                    Ver perfil da empresa
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhuma empresa encontrada
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tente ajustar os filtros ou termos de busca.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Companies;

