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

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Cookie, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já aceitou ou recusou os cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Mostrar banner após um pequeno delay
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom-5 duration-300",
        "bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg"
      )}
      role="banner"
      aria-label="Aviso sobre cookies"
    >
      <Card className="max-w-7xl mx-auto p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="flex-shrink-0 mt-1">
              <Cookie className="h-6 w-6 text-brand-600" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-brand-600" aria-hidden="true" />
                <h3 className="font-semibold text-gray-900">
                  Uso de Cookies e Armazenamento Local
                </h3>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                Este site utiliza cookies e armazenamento local do navegador para melhorar sua experiência, 
                manter sua sessão de login ativa e personalizar o conteúdo. Ao continuar navegando, você 
                concorda com o uso dessas tecnologias.
              </p>
              <p className="text-xs text-gray-500">
                <strong>Importante:</strong> Os cookies são essenciais para manter você logado e salvar suas preferências. 
                Se você recusar, algumas funcionalidades podem não funcionar corretamente.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="whitespace-nowrap"
            >
              Recusar
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="bg-brand-500 hover:bg-brand-600 whitespace-nowrap"
            >
              Aceitar
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="h-8 w-8"
              aria-label="Fechar aviso de cookies"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CookieConsent;

