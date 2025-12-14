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

import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import ErrorPage from "./ErrorPage";
import { analytics } from "@/lib/analytics";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Rastrear erro 404 no Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      analytics.error('404_not_found', `Route: ${location.pathname}`);
    }
  }, [location.pathname]);

  return (
    <ErrorPage
      statusCode={404}
      title="Página não encontrada"
      message={`A página "${location.pathname}" não existe ou foi movida.`}
    />
  );
};

export default NotFound;
