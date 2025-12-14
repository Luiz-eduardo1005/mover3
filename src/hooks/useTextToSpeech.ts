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

import { useState, useCallback, useEffect } from 'react';

interface UseTextToSpeechReturn {
  isSpeaking: boolean;
  isSupported: boolean;
  speak: (text: string, options?: SpeechOptions) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

interface SpeechOptions {
  rate?: number; // 0.1 a 10
  pitch?: number; // 0 a 2
  volume?: number; // 0 a 1
  lang?: string;
}

export const useTextToSpeech = (): UseTextToSpeechReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
    
    // Carregar vozes disponíveis
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        // Log para debug (pode ser removido em produção)
        if (voices.length > 0 && process.env.NODE_ENV === 'development') {
          console.log('Vozes disponíveis:', voices.map(v => ({ name: v.name, lang: v.lang })));
        }
      };
      
      loadVoices();
      // Alguns navegadores carregam vozes de forma assíncrona
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const speak = useCallback((text: string, options?: SpeechOptions) => {
    if (!isSupported) {
      console.warn('Text-to-Speech não é suportado neste navegador');
      return;
    }

    // Parar qualquer fala anterior
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.lang = options?.lang || 'pt-BR';
    utterance.rate = options?.rate || 1;
    utterance.pitch = options?.pitch || 1;
    utterance.volume = options?.volume || 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (error) => {
      console.error('Erro no Text-to-Speech:', error);
      setIsSpeaking(false);
    };

    // Tentar usar voz brasileira se disponível
    const voices = window.speechSynthesis.getVoices();
    const brazilianVoice = voices.find(voice => 
      voice.lang.includes('pt-BR') || voice.lang.includes('pt')
    );
    if (brazilianVoice) {
      utterance.voice = brazilianVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  const pause = useCallback(() => {
    if (isSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (isSupported && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsSpeaking(true);
    }
  }, [isSupported]);

  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
    pause,
    resume,
  };
};

// Função auxiliar para ler todo o conteúdo da página
export const readPageContent = (speak: (text: string) => void) => {
  // Remover elementos que não devem ser lidos
  const toRemove = ['script', 'style', 'nav', 'footer', 'aside', '[aria-hidden="true"]'];
  toRemove.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      (el as HTMLElement).setAttribute('data-original-aria-hidden', (el.getAttribute('aria-hidden') || 'false'));
      el.setAttribute('aria-hidden', 'true');
    });
  });

  // Obter texto do main ou body
  const main = document.querySelector('main') || document.body;
  const text = main.innerText || main.textContent || '';
  
  // Limpar texto extra
  const cleanText = text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();

  if (cleanText) {
    speak(cleanText);
  }

  // Restaurar elementos
  document.querySelectorAll('[data-original-aria-hidden]').forEach(el => {
    const original = el.getAttribute('data-original-aria-hidden');
    if (original === 'false') {
      el.removeAttribute('aria-hidden');
    } else {
      el.setAttribute('aria-hidden', original || 'false');
    }
    el.removeAttribute('data-original-aria-hidden');
  });
};

// Função auxiliar para ler texto selecionado
export const readSelectedText = (speak: (text: string) => void) => {
  const selection = window.getSelection();
  if (selection && selection.toString().trim()) {
    speak(selection.toString().trim());
  }
};

