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

// Função auxiliar para detectar o navegador
const detectBrowser = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('chrome') && !userAgent.includes('edg')) return 'chrome';
  if (userAgent.includes('firefox')) return 'firefox';
  if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'safari';
  if (userAgent.includes('edg')) return 'edge';
  if (userAgent.includes('opera') || userAgent.includes('opr')) return 'opera';
  return 'unknown';
};

// Função auxiliar para verificar se está em contexto seguro (HTTPS)
const isSecureContext = () => {
  return window.isSecureContext || 
         location.protocol === 'https:' || 
         location.hostname === 'localhost' || 
         location.hostname === '127.0.0.1';
};

// Função auxiliar para obter getUserMedia com fallback
const getUserMedia = async (constraints: MediaStreamConstraints): Promise<MediaStream> => {
  // Tentar API moderna primeiro
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return navigator.mediaDevices.getUserMedia(constraints);
  }
  
  // Fallback para API antiga (navegadores mais antigos)
  const legacyGetUserMedia = 
    (navigator as any).getUserMedia ||
    (navigator as any).webkitGetUserMedia ||
    (navigator as any).mozGetUserMedia ||
    (navigator as any).msGetUserMedia;
  
  if (legacyGetUserMedia) {
    return new Promise((resolve, reject) => {
      legacyGetUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
  
  throw new Error('getUserMedia não é suportado neste navegador');
};

export const useSpeechToText = (lang: string = 'pt-BR'): UseSpeechToTextReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const browserRef = useRef<string>(detectBrowser());

  useEffect(() => {
    // Verificar contexto seguro (necessário para getUserMedia)
    if (!isSecureContext()) {
      setIsSupported(false);
      setError('Reconhecimento de voz requer conexão segura (HTTPS). Por favor, acesse o site via HTTPS.');
      return;
    }

    // Verificar suporte para Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;

      // Configurações específicas por navegador
      const browser = browserRef.current;
      if (browser === 'safari') {
        // Safari pode ter comportamentos diferentes
        recognition.continuous = false; // Safari funciona melhor com continuous=false
      }

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
          case 'service-not-allowed':
            errorMessage = 'Serviço de reconhecimento de voz não permitido. Verifique as configurações do navegador.';
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
      const browser = browserRef.current;
      if (browser === 'firefox') {
        setError('Firefox não suporta Web Speech API nativamente. Considere usar Chrome, Edge ou Safari.');
      } else if (browser === 'safari') {
        setError('Safari requer versão 14.1 ou superior para suporte a reconhecimento de voz.');
      } else {
        setError('Reconhecimento de voz não é suportado neste navegador. Tente usar Chrome, Edge, Opera ou Safari.');
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          // Ignorar erros ao parar durante cleanup
        }
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

    // Verificar contexto seguro novamente
    if (!isSecureContext()) {
      setError('Reconhecimento de voz requer conexão segura (HTTPS). Por favor, acesse o site via HTTPS.');
      return;
    }

    try {
      const browser = browserRef.current;
      
      // Solicitar permissão de microfone explicitamente
      // Necessário para Chrome, Opera, Edge e alguns casos do Safari
      try {
        // Construir constraints de áudio baseado no navegador
        const audioConstraints: MediaTrackConstraints = {
          echoCancellation: browser !== 'safari', // Safari pode não suportar
          noiseSuppression: browser !== 'safari',
          autoGainControl: browser !== 'safari',
        };

        // Solicitar permissão de microfone
        const stream = await getUserMedia({ audio: audioConstraints });
        
        // Armazenar o stream temporariamente
        mediaStreamRef.current = stream;
        
        // Parar o stream imediatamente após obter permissão
        // O SpeechRecognition vai gerenciar o acesso ao microfone
        stream.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        
        // Delay baseado no navegador para garantir que a permissão foi processada
        const delay = browser === 'safari' ? 200 : browser === 'firefox' ? 150 : 100;
        await new Promise(resolve => setTimeout(resolve, delay));
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
          // Tentar novamente sem constraints específicas
          try {
            const stream = await getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            // Se chegou aqui, a permissão foi concedida, continuar
          } catch (retryErr: any) {
            errorMessage = 'As configurações do microfone não são suportadas.';
            setError(errorMessage);
            return;
          }
        } else if (err.name === 'TypeError' && err.message.includes('getUserMedia')) {
          errorMessage = 'API de mídia não suportada. Por favor, use um navegador moderno (Chrome, Firefox, Edge, Safari ou Opera).';
        } else {
          errorMessage = `Erro ao acessar microfone: ${err.message || err.name}`;
        }
        
        setError(errorMessage);
        return;
      }

      // Agora iniciar o reconhecimento de voz
      try {
        recognitionRef.current.start();
      } catch (startErr: any) {
        // Tratar erros específicos ao iniciar
        if (startErr.message && startErr.message.includes('already started')) {
          // Já está rodando, apenas continuar
          return;
        }
        throw startErr;
      }
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

