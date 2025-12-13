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

import { useState, useCallback, useEffect, useRef } from 'react';

interface UseSpeechToTextReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  error: string | null;
}

export const useSpeechToText = (lang: string = 'pt-BR'): UseSpeechToTextReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Verificar suporte para Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        setError(`Erro no reconhecimento de voz: ${event.error}`);
        console.error('Speech recognition error:', event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setError('Reconhecimento de voz não é suportado neste navegador');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [lang]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Erro ao iniciar reconhecimento:', err);
        setError('Não foi possível iniciar o reconhecimento de voz');
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    error,
  };
};

// Comandos de voz comuns para navegação
export const processVoiceCommand = (
  transcript: string,
  callbacks: {
    onNavigate?: (path: string) => void;
    onSearch?: (query: string) => void;
    onClose?: () => void;
    onOpen?: (item: string) => void;
  }
) => {
  const lowerTranscript = transcript.toLowerCase().trim();

  // Comandos de navegação
  if (callbacks.onNavigate) {
    if (lowerTranscript.includes('ir para') || lowerTranscript.includes('abrir')) {
      if (lowerTranscript.includes('início') || lowerTranscript.includes('home')) {
        callbacks.onNavigate('/');
      } else if (lowerTranscript.includes('vagas') || lowerTranscript.includes('empregos')) {
        callbacks.onNavigate('/jobs');
      } else if (lowerTranscript.includes('cursos')) {
        callbacks.onNavigate('/courses');
      } else if (lowerTranscript.includes('perfil')) {
        callbacks.onNavigate('/profile');
      } else if (lowerTranscript.includes('sobre')) {
        callbacks.onNavigate('/about');
      }
    }

    if (lowerTranscript.includes('voltar') || lowerTranscript.includes('retroceder')) {
      window.history.back();
    }
  }

  // Comando de busca
  if (callbacks.onSearch && (lowerTranscript.includes('buscar') || lowerTranscript.includes('procurar'))) {
    const searchQuery = lowerTranscript.replace(/buscar|procurar/gi, '').trim();
    if (searchQuery) {
      callbacks.onSearch(searchQuery);
    }
  }

  // Comando de fechar
  if (callbacks.onClose && (lowerTranscript.includes('fechar') || lowerTranscript.includes('sair'))) {
    callbacks.onClose();
  }
};

