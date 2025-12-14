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

  // Função auxiliar para dividir texto em frases
  const splitIntoChunks = useCallback((text: string): string[] => {
    // Dividir por pontuação final (., !, ?) seguida de espaço ou nova linha
    const sentences = text.split(/([.!?]\s+|[.!?]\n+)/);
    const chunks: string[] = [];
    
    for (let i = 0; i < sentences.length; i += 2) {
      if (sentences[i]) {
        const chunk = sentences[i] + (sentences[i + 1] || '');
        if (chunk.trim()) {
          chunks.push(chunk.trim());
        }
      }
    }
    
    // Se não encontrou pontuação, dividir por parágrafos ou linhas
    if (chunks.length === 0 || chunks.length === 1) {
      const paragraphs = text.split(/\n\n+/);
      if (paragraphs.length > 1) {
        return paragraphs.filter(p => p.trim());
      }
      // Se ainda não dividiu, dividir por linhas
      const lines = text.split(/\n+/);
      return lines.filter(l => l.trim());
    }
    
    return chunks;
  }, []);

  // Função para falar um chunk específico (definida primeiro para ser usada em speak)
  const speakChunk = useCallback((chunkIndex: number, chunks: string[], options?: SpeechOptions) => {
    if (chunkIndex >= chunks.length) {
      setIsSpeaking(false);
      return;
    }

    const chunk = chunks[chunkIndex];
    if (!chunk.trim()) {
      // Se chunk vazio, pular para o próximo
      speakChunk(chunkIndex + 1, chunks, options);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunk);
    
    utterance.lang = options?.lang || 'pt-BR';
    utterance.rate = options?.rate || 1;
    utterance.pitch = options?.pitch || 1;
    utterance.volume = options?.volume || 1;

    // Selecionar voz baseada no gênero
    const voices = window.speechSynthesis.getVoices();
    const targetGender = options?.voiceGender || 'male';
    
    const brazilianVoices = voices.filter(voice => 
      voice.lang.includes('pt-BR') || voice.lang.includes('pt')
    );

    if (brazilianVoices.length > 0) {
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
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentChunkIndex(chunkIndex);
      setCurrentUtterance(utterance);
    };

    utterance.onend = () => {
      // Continuar com o próximo chunk
      if (chunkIndex < chunks.length - 1) {
        speakChunk(chunkIndex + 1, chunks, options);
      } else {
        setIsSpeaking(false);
        setCurrentUtterance(null);
      }
    };

    utterance.onerror = (error) => {
      console.error('Erro no Text-to-Speech:', error);
      setIsSpeaking(false);
      setCurrentUtterance(null);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const speak = useCallback((text: string, options?: SpeechOptions) => {
    if (!isSupported) {
      console.warn('Text-to-Speech não é suportado neste navegador');
      return;
    }

    // Armazenar texto e opções atuais
    setCurrentText(text);
    setCurrentOptions(options);
    
    // Dividir texto em chunks
    const chunks = splitIntoChunks(text);
    setTextChunks(chunks);
    setCurrentChunkIndex(0);

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
    if (isSupported && textChunks.length > 0 && currentChunkIndex < textChunks.length) {
      // Parar leitura atual suavemente
      window.speechSynthesis.cancel();
      
      // Continuar do próximo chunk (não reiniciar o atual) com novas opções
      const nextChunkIndex = currentChunkIndex + 1;
      const mergedOptions = { ...currentOptions, ...newOptions };
      setCurrentOptions(mergedOptions);
      
      // Pequeno delay para transição suave
      setTimeout(() => {
        if (nextChunkIndex < textChunks.length) {
          speakChunk(nextChunkIndex, textChunks, mergedOptions);
        } else {
          setIsSpeaking(false);
        }
      }, 50);
    }
  }, [isSupported, textChunks, currentChunkIndex, currentOptions, speakChunk]);

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

