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

interface UseTextToSpeechReturn {
  isSpeaking: boolean;
  isSupported: boolean;
  speak: (text: string, options?: SpeechOptions) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  restartWithNewOptions: (options: SpeechOptions) => void;
  getCurrentText: () => string | null;
}

interface SpeechOptions {
  rate?: number; // 0.1 a 10
  pitch?: number; // 0 a 2
  volume?: number; // 0 a 1
  lang?: string;
  voiceGender?: 'male' | 'female';
}

export const useTextToSpeech = (): UseTextToSpeechReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [currentText, setCurrentText] = useState<string>('');
  const [currentOptions, setCurrentOptions] = useState<SpeechOptions | undefined>();
  const [textChunks, setTextChunks] = useState<string[]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  
  // Usar refs para rastreamento mais confiável durante a leitura
  const currentChunkIndexRef = useRef(0);
  const textChunksRef = useRef<string[]>([]);
  const currentOptionsRef = useRef<SpeechOptions | undefined>();
  const isChangingVoiceRef = useRef(false);

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

  // Função auxiliar para dividir texto em chunks menores para troca de voz suave
  const splitIntoChunks = useCallback((text: string): string[] => {
    // Dividir por vírgulas, pontos, exclamações, interrogações e quebras de linha
    // Isso cria chunks menores para troca de voz mais suave
    const chunks: string[] = [];
    
    // Primeiro, dividir por pontuação final (., !, ?)
    let parts = text.split(/([.!?]\s+|[.!?]\n+)/);
    
    // Se não encontrou pontuação final, dividir por vírgulas
    if (parts.length <= 1) {
      parts = text.split(/([,;]\s+)/);
    }
    
    // Se ainda não dividiu, dividir por quebras de linha
    if (parts.length <= 1) {
      parts = text.split(/(\n+)/);
    }
    
    // Reconstruir chunks mantendo pontuação
    for (let i = 0; i < parts.length; i += 2) {
      if (parts[i]) {
        const chunk = parts[i] + (parts[i + 1] || '');
        const trimmed = chunk.trim();
        if (trimmed) {
          chunks.push(trimmed);
        }
      }
    }
    
    // Se ainda não dividiu bem, dividir por espaços (último recurso)
    if (chunks.length <= 1 && text.length > 100) {
      // Dividir em pedaços de aproximadamente 50 caracteres
      const chunkSize = 50;
      for (let i = 0; i < text.length; i += chunkSize) {
        const chunk = text.slice(i, i + chunkSize).trim();
        if (chunk) {
          chunks.push(chunk);
        }
      }
    }
    
    // Se ainda não dividiu, retornar o texto inteiro
    return chunks.length > 0 ? chunks : [text];
  }, []);

  // Função auxiliar para selecionar voz baseada no gênero
  const selectVoice = useCallback((targetGender: 'male' | 'female'): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    const brazilianVoices = voices.filter(voice => 
      voice.lang.includes('pt-BR') || voice.lang.includes('pt')
    );

    if (brazilianVoices.length === 0) return null;

    let selectedVoice: SpeechSynthesisVoice | null = null;
    
    if (targetGender === 'female') {
      selectedVoice = brazilianVoices.find(voice => {
        const name = voice.name.toLowerCase();
        return name.includes('maria') || 
               name.includes('heloisa') || 
               name.includes('heloísa') ||
               name.includes('luciana') ||
               name.includes('feminina') ||
               name.includes('female');
      }) || null;
      
      if (!selectedVoice && brazilianVoices.length > 1) {
        selectedVoice = brazilianVoices[brazilianVoices.length - 1];
      }
    }
    
    if (!selectedVoice || targetGender === 'male') {
      selectedVoice = brazilianVoices.find(voice => {
        const name = voice.name.toLowerCase();
        return name.includes('joão') || 
               name.includes('joao') ||
               name.includes('felipe') ||
               name.includes('masculina') ||
               name.includes('male');
      }) || null;
      
      if (!selectedVoice) {
        selectedVoice = brazilianVoices[0];
      }
    }
    
    return selectedVoice;
  }, []);

  // Função para falar um chunk específico (definida primeiro para ser usada em speak)
  const speakChunk = useCallback((chunkIndex: number, chunks: string[], options?: SpeechOptions) => {
    // Validar índice
    if (chunkIndex < 0 || chunkIndex >= chunks.length) {
      setIsSpeaking(false);
      currentChunkIndexRef.current = 0;
      setCurrentUtterance(null);
      return;
    }

    const chunk = chunks[chunkIndex];
    if (!chunk || !chunk.trim()) {
      // Se chunk vazio, pular para o próximo
      const nextIndex = chunkIndex + 1;
      if (nextIndex < chunks.length) {
        speakChunk(nextIndex, chunks, options);
      } else {
        setIsSpeaking(false);
        currentChunkIndexRef.current = 0;
        setCurrentUtterance(null);
      }
      return;
    }

    // Atualizar refs para rastreamento confiável ANTES de criar utterance
    currentChunkIndexRef.current = chunkIndex;
    textChunksRef.current = chunks;
    if (options) {
      currentOptionsRef.current = options;
    }

    const utterance = new SpeechSynthesisUtterance(chunk);
    
    // Usar opções mais atualizadas
    const finalOptions = options || currentOptionsRef.current || {};
    utterance.lang = finalOptions.lang || 'pt-BR';
    utterance.rate = finalOptions.rate || 1;
    utterance.pitch = finalOptions.pitch || 1;
    utterance.volume = finalOptions.volume || 1;

    // Selecionar voz baseada no gênero
    const targetGender = finalOptions.voiceGender || 'male';
    const selectedVoice = selectVoice(targetGender);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentChunkIndex(chunkIndex);
      setCurrentUtterance(utterance);
    };

    utterance.onend = () => {
      // Continuar com o próximo chunk usando as opções mais atualizadas
      const nextIndex = chunkIndex + 1;
      if (nextIndex < chunks.length) {
        // Sempre usar as opções mais recentes do ref (que podem ter sido atualizadas durante a leitura)
        const optionsToUse = currentOptionsRef.current || options || {};
        // Garantir que continuamos na ordem correta
        speakChunk(nextIndex, chunks, optionsToUse);
      } else {
        // Leitura completa
        setIsSpeaking(false);
        setCurrentUtterance(null);
        currentChunkIndexRef.current = 0;
      }
    };

    utterance.onerror = (error) => {
      console.error('Erro no Text-to-Speech:', error);
      setIsSpeaking(false);
      setCurrentUtterance(null);
    };

    // Falar imediatamente
    window.speechSynthesis.speak(utterance);
  }, [selectVoice]);

  const speak = useCallback((text: string, options?: SpeechOptions) => {
    if (!isSupported) {
      console.warn('Text-to-Speech não é suportado neste navegador');
      return;
    }

    // Armazenar texto e opções atuais
    setCurrentText(text);
    setCurrentOptions(options);
    if (options) {
      currentOptionsRef.current = options;
    }
    
    // Dividir texto em chunks
    const chunks = splitIntoChunks(text);
    setTextChunks(chunks);
    textChunksRef.current = chunks;
    setCurrentChunkIndex(0);
    currentChunkIndexRef.current = 0;

    // Parar qualquer fala anterior
    window.speechSynthesis.cancel();
    
    // Iniciar leitura do primeiro chunk
    speakChunk(0, chunks, options);
  }, [isSupported, splitIntoChunks, speakChunk]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      // Não limpar currentText aqui para permitir reiniciar se necessário
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

  const restartWithNewOptions = useCallback((newOptions: SpeechOptions) => {
    if (!isSupported) return;
    
    // Proteção contra múltiplas chamadas rápidas
    if (isChangingVoiceRef.current) {
      return;
    }
    isChangingVoiceRef.current = true;
    
    const chunks = textChunksRef.current.length > 0 ? textChunksRef.current : textChunks;
    const currentIndex = currentChunkIndexRef.current;
    
    // Validar chunks e índice
    if (chunks.length === 0 || currentIndex < 0) {
      isChangingVoiceRef.current = false;
      return;
    }

    // Mesclar opções ANTES de cancelar para garantir sincronização
    const mergedOptions = { 
      ...currentOptionsRef.current, 
      ...currentOptions,
      ...newOptions 
    };
    currentOptionsRef.current = mergedOptions;
    setCurrentOptions(mergedOptions);

    // Se não está mais falando, apenas continuar do mesmo trecho (ou próximo) com as novas opções
    if (!isSpeaking) {
      // Repetir o chunk atual ajuda a evitar "pulos" perceptíveis para o usuário
      const resumeIndex = Math.min(currentIndex, chunks.length - 1);
      isChangingVoiceRef.current = false;
      speakChunk(resumeIndex, chunks, mergedOptions);
      return;
    }
    
    // Parar leitura atual imediatamente (chunk que está sendo lido agora)
    window.speechSynthesis.cancel();
    
    // Pequena pausa para o navegador "soltar" o áudio anterior
    // Repetir o chunk atual após a pausa curta evita saltos grandes de conteúdo
    const resumeIndex = Math.min(currentIndex, chunks.length - 1);
    setTimeout(() => {
      isChangingVoiceRef.current = false;

      // Validar novamente antes de continuar
      if (resumeIndex >= 0 && resumeIndex < chunks.length) {
        speakChunk(resumeIndex, chunks, mergedOptions);
      } else if (resumeIndex >= chunks.length) {
        setIsSpeaking(false);
        currentChunkIndexRef.current = 0;
        setCurrentUtterance(null);
      }
    }, 120); // ~0.1s de pausa para suavizar a transição
  }, [isSupported, textChunks, isSpeaking, speakChunk, currentOptions]);

  const getCurrentText = useCallback(() => {
    return currentText || null;
  }, [currentText]);

  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
    pause,
    resume,
    restartWithNewOptions,
    getCurrentText,
  };
};

// Função auxiliar para ler todo o conteúdo da página
export const readPageContent = (
  speak: (text: string, options?: SpeechOptions) => void,
  options?: SpeechOptions
) => {
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
    speak(cleanText, options);
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
export const readSelectedText = (
  speak: (text: string, options?: SpeechOptions) => void,
  options?: SpeechOptions
) => {
  const selection = window.getSelection();
  if (selection && selection.toString().trim()) {
    speak(selection.toString().trim(), options);
  }
};
