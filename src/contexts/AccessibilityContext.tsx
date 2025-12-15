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

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type FontSize = 'normal' | 'large' | 'extra-large';
export type ContrastMode = 'normal' | 'high';
export type AnimationPreference = 'normal' | 'reduced';
export type TextSpacing = 'normal' | 'large' | 'extra-large';
export type FontFamily = 'default' | 'dyslexia';
export type CursorSize = 'normal' | 'large';
export type VoiceGender = 'male' | 'female';

interface AccessibilityPreferences {
  fontSize: FontSize;
  contrastMode: ContrastMode;
  reduceAnimations: boolean;
  highContrast: boolean;
  textSpacing: TextSpacing;
  fontFamily: FontFamily;
  highlightLinks: boolean;
  highlightButtons: boolean;
  largeCursor: boolean;
  readingMode: boolean;
  voiceGender: VoiceGender;
  speechRate: number;
}

interface AccessibilityContextType {
  preferences: AccessibilityPreferences;
  updateFontSize: (size: FontSize) => void;
  updateContrastMode: (mode: ContrastMode) => void;
  toggleAnimations: () => void;
  toggleHighContrast: () => void;
  updateTextSpacing: (spacing: TextSpacing) => void;
  updateFontFamily: (family: FontFamily) => void;
  toggleHighlightLinks: () => void;
  toggleHighlightButtons: () => void;
  toggleLargeCursor: () => void;
  toggleReadingMode: () => void;
  updateVoiceGender: (gender: VoiceGender) => void;
  updateSpeechRate: (rate: number) => void;
  resetPreferences: () => void;
}

const defaultPreferences: AccessibilityPreferences = {
  fontSize: 'normal',
  contrastMode: 'normal',
  reduceAnimations: false,
  highContrast: false,
  textSpacing: 'normal',
  fontFamily: 'default',
  highlightLinks: false,
  highlightButtons: false,
  largeCursor: false,
  readingMode: false,
  voiceGender: 'male',
  speechRate: 1,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEY = 'mover-accessibility-preferences';

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => {
    // Carregar preferências do localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Garantir que voiceGender e speechRate existam (para compatibilidade com versões antigas)
          return { 
            ...defaultPreferences, 
            ...parsed,
            voiceGender: parsed.voiceGender || 'male',
            speechRate: parsed.speechRate !== undefined ? parsed.speechRate : 1
          };
        } catch {
          return defaultPreferences;
        }
      }
    }
    return defaultPreferences;
  });

  // Salvar preferências no localStorage sempre que mudarem
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    }
  }, [preferences]);

  // Aplicar preferências no DOM
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Aplicar tamanho da fonte
    root.classList.remove('font-normal', 'font-large', 'font-extra-large');
    root.classList.add(`font-${preferences.fontSize}`);

    // Aplicar modo de alto contraste
    if (preferences.highContrast || preferences.contrastMode === 'high') {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Aplicar redução de animações
    if (preferences.reduceAnimations) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Aplicar espaçamento de texto
    body.classList.remove('spacing-normal', 'spacing-large', 'spacing-extra-large');
    body.classList.add(`spacing-${preferences.textSpacing}`);

    // Aplicar fonte para dislexia
    if (preferences.fontFamily === 'dyslexia') {
      body.classList.add('font-dyslexia');
    } else {
      body.classList.remove('font-dyslexia');
    }

    // Aplicar destacar links
    if (preferences.highlightLinks) {
      body.classList.add('highlight-links');
    } else {
      body.classList.remove('highlight-links');
    }

    // Aplicar destacar botões
    if (preferences.highlightButtons) {
      body.classList.add('highlight-buttons');
    } else {
      body.classList.remove('highlight-buttons');
    }

    // Aplicar cursor grande
    if (preferences.largeCursor) {
      body.classList.add('large-cursor');
    } else {
      body.classList.remove('large-cursor');
    }

    // Aplicar modo leitura
    if (preferences.readingMode) {
      body.classList.add('reading-mode');
    } else {
      body.classList.remove('reading-mode');
    }
  }, [preferences]);

  const updateFontSize = (size: FontSize) => {
    setPreferences(prev => ({ ...prev, fontSize: size }));
  };

  const updateContrastMode = (mode: ContrastMode) => {
    setPreferences(prev => ({ ...prev, contrastMode: mode, highContrast: mode === 'high' }));
  };

  const toggleAnimations = () => {
    setPreferences(prev => ({ ...prev, reduceAnimations: !prev.reduceAnimations }));
  };

  const toggleHighContrast = () => {
    setPreferences(prev => {
      const newHighContrast = !prev.highContrast;
      return {
        ...prev,
        highContrast: newHighContrast,
        contrastMode: newHighContrast ? 'high' : 'normal',
      };
    });
  };

  const updateTextSpacing = (spacing: TextSpacing) => {
    setPreferences(prev => ({ ...prev, textSpacing: spacing }));
  };

  const updateFontFamily = (family: FontFamily) => {
    setPreferences(prev => ({ ...prev, fontFamily: family }));
  };

  const toggleHighlightLinks = () => {
    setPreferences(prev => ({ ...prev, highlightLinks: !prev.highlightLinks }));
  };

  const toggleHighlightButtons = () => {
    setPreferences(prev => ({ ...prev, highlightButtons: !prev.highlightButtons }));
  };

  const toggleLargeCursor = () => {
    setPreferences(prev => ({ ...prev, largeCursor: !prev.largeCursor }));
  };

  const toggleReadingMode = () => {
    setPreferences(prev => ({ ...prev, readingMode: !prev.readingMode }));
  };

  const updateVoiceGender = (gender: VoiceGender) => {
    setPreferences(prev => ({ ...prev, voiceGender: gender }));
  };

  const updateSpeechRate = (rate: number) => {
    setPreferences(prev => ({ ...prev, speechRate: Math.max(0.5, Math.min(2, rate)) }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        preferences,
        updateFontSize,
        updateContrastMode,
        toggleAnimations,
        toggleHighContrast,
        updateTextSpacing,
        updateFontFamily,
        toggleHighlightLinks,
        toggleHighlightButtons,
        toggleLargeCursor,
        toggleReadingMode,
        updateVoiceGender,
        updateSpeechRate,
        resetPreferences,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility deve ser usado dentro de um AccessibilityProvider');
  }
  return context;
};

