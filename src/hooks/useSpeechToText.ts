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
  const mediaStreamRef = useRef<MediaStream | null>(null);

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
        
        // Tratamento específico de erros
        let errorMessage = 'Erro no reconhecimento de voz';
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'Nenhum áudio detectado. Tente novamente.';
            break;
          case 'audio-capture':
            errorMessage = 'Não foi possível acessar o microfone. Verifique as permissões.';
            break;
          case 'not-allowed':
            errorMessage = 'Permissão de microfone negada. Por favor, permita o acesso ao microfone nas configurações do navegador.';
            break;
          case 'network':
            errorMessage = 'Erro de rede. Verifique sua conexão.';
            break;
          case 'aborted':
            errorMessage = 'Reconhecimento de voz interrompido.';
            break;
          default:
            errorMessage = `Erro no reconhecimento de voz: ${event.error}`;
        }
        
        setError(errorMessage);
        console.error('Speech recognition error:', event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Liberar stream de mídia quando terminar
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
        }
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
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [lang]);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current || isListening) {
      return;
    }

    try {
      // Primeiro, solicitar permissão de microfone explicitamente
      // Isso é necessário para Chrome e Opera
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          // Solicitar permissão de microfone explicitamente
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            } 
          });
          
          // Armazenar o stream temporariamente
          mediaStreamRef.current = stream;
          
          // Parar o stream imediatamente após obter permissão
          // O SpeechRecognition vai gerenciar o acesso ao microfone
          stream.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
          
          // Pequeno delay para garantir que a permissão foi processada
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (err: any) {
          console.error('Erro ao solicitar permissão de microfone:', err);
          
          let errorMessage = 'Não foi possível acessar o microfone';
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorMessage = 'Permissão de microfone negada. Por favor, permita o acesso ao microfone nas configurações do navegador e tente novamente.';
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            errorMessage = 'Nenhum microfone encontrado. Verifique se há um microfone conectado.';
          } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            errorMessage = 'O microfone está sendo usado por outro aplicativo. Feche outros aplicativos e tente novamente.';
          } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
            errorMessage = 'As configurações do microfone não são suportadas.';
          } else {
            errorMessage = `Erro ao acessar microfone: ${err.message || err.name}`;
          }
          
          setError(errorMessage);
          return;
        }
      }

      // Agora iniciar o reconhecimento de voz
      recognitionRef.current.start();
    } catch (err: any) {
      console.error('Erro ao iniciar reconhecimento:', err);
      setError('Não foi possível iniciar o reconhecimento de voz. Tente novamente.');
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (err) {
        console.error('Erro ao parar reconhecimento:', err);
      }
    }
    
    // Liberar stream de mídia se ainda estiver ativo
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
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

