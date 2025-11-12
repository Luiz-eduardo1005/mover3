
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

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-600 tracking-wider uppercase">Sobre</h3>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 md:space-y-4">
              <li>
                <Link to="/about" className="text-sm sm:text-base text-gray-500 hover:text-brand-600">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm sm:text-base text-gray-500 hover:text-brand-600">
                  Carreiras
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-sm sm:text-base text-gray-500 hover:text-brand-600">
                  Imprensa
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-600 tracking-wider uppercase">Candidatos</h3>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 md:space-y-4">
              <li>
                <Link to="/jobs" className="text-sm sm:text-base text-gray-500 hover:text-brand-600">
                  Procurar vagas
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm sm:text-base text-gray-500 hover:text-brand-600">
                  Criar perfil
                </Link>
              </li>
              <li>
                <Link to="/curriculum" className="text-sm sm:text-base text-gray-500 hover:text-brand-600">
                  Enviar currículo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-600 tracking-wider uppercase">Empresas</h3>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 md:space-y-4">
              <li>
                <Link to="/advertise" className="text-sm sm:text-base text-gray-500 hover:text-brand-600">
                  Publicar vaga
                </Link>
              </li>
              <li>
                <Link to="/employer" className="text-sm sm:text-base text-gray-500 hover:text-brand-600">
                  Portal do empregador
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm sm:text-base text-gray-500 hover:text-brand-600">
                  Planos e preços
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-600 tracking-wider uppercase">Ajuda</h3>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 md:space-y-4">
              <li>
                <Link to="/contact" className="text-sm sm:text-base text-gray-500 hover:text-brand-600">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm sm:text-base text-gray-500 hover:text-brand-600">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm sm:text-base text-gray-500 hover:text-brand-600">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm sm:text-base text-gray-500 hover:text-brand-600">
                  Termos de uso
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 sm:mt-10 md:mt-12 border-t border-gray-200 pt-6 sm:pt-8">
          <p className="text-xs sm:text-sm md:text-base text-gray-400 text-center px-4">
            &copy; {new Date().getFullYear()} MOVER - Mobilidade e Oportunidades para Vagas com Empregabilidade e Respeito. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
