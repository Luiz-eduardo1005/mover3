
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
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Briefcase, MapPin, Clock, Filter, Search, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import JobList from '@/components/jobs/JobList';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Jobs = () => {
  const [filters, setFilters] = useState({
    keyword: '',
    location: 'Manaus, AM',
    jobType: [],
    salary: [0, 15000],
    distance: 30,
    datePosted: 'any'
  });
  
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    if (key === 'jobType' && typeof value === 'string') {
      if (activeFilters.includes(value)) {
        setActiveFilters(prev => prev.filter(item => item !== value));
      } else {
        setActiveFilters(prev => [...prev, value]);
      }
    }
  };
  
  const clearFilter = (filterName: string) => {
    setActiveFilters(prev => prev.filter(item => item !== filterName));
    if (filterName === 'distance' || filterName === 'salary') {
      setFilters(prev => ({ ...prev, [filterName]: filterName === 'salary' ? [0, 15000] : 30 }));
    } else if (filterName === 'jobType') {
      setFilters(prev => ({ ...prev, jobType: [] }));
    } else {
      setFilters(prev => ({ ...prev, [filterName]: '' }));
    }
  };
  
  const clearAllFilters = () => {
    setFilters({
      keyword: '',
      location: 'Manaus, AM',
      jobType: [],
      salary: [0, 15000],
      distance: 30,
      datePosted: 'any'
    });
    setActiveFilters([]);
  };
  
  const jobTypes = ["Tempo integral", "Meio período", "Remoto", "Estágio", "Temporário", "Freelance"];
  const dateOptions = [
    { value: 'any', label: 'Qualquer data' },
    { value: 'today', label: 'Hoje' },
    { value: '3days', label: '3 dias' },
    { value: 'week', label: 'Última semana' },
    { value: 'month', label: 'Último mês' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Search Bar Section */}
        <section className="bg-gradient-to-r from-blue-50 to-brand-50 dark:from-gray-900 dark:to-gray-800 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Encontre Vagas em Manaus e Região</h1>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-2 mb-4 sm:mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <Input 
                  type="text" 
                  placeholder="Cargo, empresa ou palavra-chave"
                  value={filters.keyword}
                  onChange={e => handleFilterChange('keyword', e.target.value)} 
                  className="pl-9 sm:pl-10 py-4 sm:py-5 md:py-6 text-sm sm:text-base" 
                />
              </div>
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <Input 
                  type="text" 
                  placeholder="Localização"
                  value={filters.location}
                  onChange={e => handleFilterChange('location', e.target.value)} 
                  className="pl-9 sm:pl-10 py-4 sm:py-5 md:py-6 text-sm sm:text-base" 
                />
              </div>
              <Button size="lg" className="bg-brand-500 hover:bg-brand-600 py-4 sm:py-5 md:py-6 w-full sm:w-auto text-sm sm:text-base">
                <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Pesquisar
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center text-sm" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-1 h-4 w-4" />
                Filtros
                {activeFilters.length > 0 && (
                  <span className="ml-1 bg-brand-500 text-white rounded-full px-1.5 py-0.5 text-xs">
                    {activeFilters.length}
                  </span>
                )}
              </Button>
              
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
                  {activeFilters.map(filter => (
                    <Badge key={filter} variant="secondary" className="flex items-center gap-1 text-xs">
                      {filter}
                      <button onClick={() => clearFilter(filter)} className="hover:bg-gray-300 rounded-full p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                    Limpar todos
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
        
        <section className="py-4 sm:py-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              
              {/* Filters Panel */}
              {showFilters && (
                <div className="w-full lg:w-1/4">
                  <Card className="sticky top-20 lg:top-24 bg-white dark:bg-gray-800">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">Filtros</h2>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="lg:hidden"
                          onClick={() => setShowFilters(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-6">
                        {/* Job Types */}
                        <div>
                          <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Tipo de vaga</h3>
                          <div className="space-y-2">
                            {jobTypes.map(type => (
                              <div key={type} className="flex items-center">
                                <Checkbox 
                                  id={`job-type-${type}`} 
                                  checked={filters.jobType.includes(type)}
                                  onCheckedChange={() => handleFilterChange('jobType', type)}
                                />
                                <label htmlFor={`job-type-${type}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                  {type}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Distance */}
                        <div>
                          <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Distância</h3>
                          <div className="px-2">
                            <Slider
                              defaultValue={[30]}
                              max={100}
                              step={5}
                              value={[filters.distance]}
                              onValueChange={(value) => handleFilterChange('distance', value[0])}
                              className="mb-2"
                            />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>0km</span>
                              <span>Até {filters.distance}km</span>
                              <span>100km</span>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Date Posted */}
                        <div>
                          <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Data de publicação</h3>
                          <Select 
                            value={filters.datePosted}
                            onValueChange={(value) => handleFilterChange('datePosted', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione um período" />
                            </SelectTrigger>
                            <SelectContent>
                              {dateOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />
                        
                        {/* Salary Range */}
                        <div>
                          <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Faixa salarial</h3>
                          <div className="px-2">
                            <Slider
                              defaultValue={[0, 15000]}
                              min={0}
                              max={30000}
                              step={500}
                              value={filters.salary}
                              onValueChange={(value) => handleFilterChange('salary', value)}
                              className="mb-2"
                            />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>R$ {filters.salary[0].toLocaleString('pt-BR')}</span>
                              <span>R$ {filters.salary[1].toLocaleString('pt-BR')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button className="w-full bg-brand-500 hover:bg-brand-600">
                          Aplicar filtros
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Job Listings */}
              <div className={`w-full ${showFilters ? 'lg:w-3/4' : 'w-full'}`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    Vagas em destaque
                  </h2>
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevância</SelectItem>
                      <SelectItem value="date">Data</SelectItem>
                      <SelectItem value="salary-desc">Maior salário</SelectItem>
                      <SelectItem value="salary-asc">Menor salário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <JobList />
                
                <div className="mt-6 sm:mt-8 flex justify-center">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Carregar mais vagas
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Jobs;
