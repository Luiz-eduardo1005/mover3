
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-2">
      <div className="relative flex-grow">
        <label htmlFor="job-search" className="sr-only">Buscar por cargo, empresa ou palavra-chave</label>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        <Input 
          id="job-search"
          type="text" 
          placeholder="Cargo, empresa ou palavra-chave" 
          className="pl-9 sm:pl-10 py-5 sm:py-6 text-base"
          aria-label="Buscar por cargo, empresa ou palavra-chave"
          autoComplete="off"
        />
      </div>
      <div className="relative flex-grow">
        <label htmlFor="location-search" className="sr-only">Localização</label>
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        <Input 
          id="location-search"
          type="text" 
          placeholder="Manaus, AM" 
          defaultValue="Manaus, AM" 
          className="pl-9 sm:pl-10 py-5 sm:py-6 text-base"
          aria-label="Localização"
          autoComplete="off"
        />
      </div>
      <Button 
        size="lg" 
        className="bg-brand-500 hover:bg-brand-600 py-5 sm:py-6 w-full sm:w-auto text-base"
        aria-label="Pesquisar vagas"
      >
        <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        Pesquisar
      </Button>
    </div>
  );
};

export default SearchBar;
