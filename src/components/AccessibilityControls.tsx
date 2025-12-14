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

import React, { useState, useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Button } from '@/components/ui/button';
import { useTextToSpeech, readPageContent, readSelectedText } from '@/hooks/useTextToSpeech';
import { useSpeechToText, processVoiceCommand } from '@/hooks/useSpeechToText';
import {
  Accessibility,
  Type,
  Contrast,
  Pause,
  X,
  Minus,
  Plus,
  RotateCcw,
  AlignJustify,
  Brain,
  Link as LinkIcon,
  MousePointerClick,
  MousePointer2,
  BookOpen,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  MinusCircle,
  PlusCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const AccessibilityControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const navigate = useNavigate();
  const {
    preferences,
    updateFontSize,
    toggleHighContrast,
    toggleAnimations,
    updateTextSpacing,
    updateFontFamily,
    toggleHighlightLinks,
    toggleHighlightButtons,
    toggleLargeCursor,
    toggleReadingMode,
    updateVoiceGender,
    updateSpeechRate,
    resetPreferences,
  } = useAccessibility();

  const {
    isSpeaking,
    isSupported: isTTSSupported,
    speak,
    stop: stopSpeech,
    pause: pauseSpeech,
    resume: resumeSpeech,
    restartWithNewOptions,
  } = useTextToSpeech();

  const {
    isListening,
    isSupported: isSTTSupported,
    transcript,
    startListening,
    stopListening,
    error: speechError,
  } = useSpeechToText();

  // Atalhos de teclado globais
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Alt + A = Abrir/fechar controles de acessibilidade
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsOpen(prev => {
          const newState = !prev;
          setNotificationMessage('Controles de acessibilidade ' + (newState ? 'abertos' : 'fechados'));
          return newState;
        });
      }
      // Alt + S = Ler conteúdo da página
      if (e.altKey && e.key.toLowerCase() === 's' && !e.shiftKey) {
        e.preventDefault();
        if (isSpeaking) {
          stopSpeech();
          setNotificationMessage('Leitura interrompida');
        } else {
          readPageContent((text: string) => speak(text, { 
            rate: preferences.speechRate,
            voiceGender: preferences.voiceGender 
          }));
          setNotificationMessage('Iniciando leitura da página');
        }
      }
      // Alt + Shift + S = Parar leitura
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (isSpeaking) {
          stopSpeech();
          setNotificationMessage('Leitura interrompida');
        }
      }
      // Alt + V = Ativar comandos por voz
      if (e.altKey && e.key.toLowerCase() === 'v' && isSTTSupported) {
        e.preventDefault();
        if (isListening) {
          stopListening();
          setNotificationMessage('Comandos por voz desativados');
        } else {
          startListening();
          setNotificationMessage('Comandos por voz ativados. Fale seus comandos.');
        }
      }
      // Esc = Fechar controles se abertos
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setNotificationMessage('Controles de acessibilidade fechados');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, isSpeaking, isSTTSupported, isListening, stopSpeech, stopListening, startListening, speak, preferences.speechRate, preferences.voiceGender]);

  // Processar comandos de voz
  useEffect(() => {
    if (transcript && isListening) {
      processVoiceCommand(transcript, {
        onNavigate: (path) => {
          navigate(path);
          stopListening();
          setNotificationMessage(`Navegando para ${path}`);
        },
        onClose: () => {
          if (isOpen) {
            setIsOpen(false);
          }
          stopListening();
          setNotificationMessage('Comandos por voz desativados');
        },
      });
    }
  }, [transcript, isListening, navigate, isOpen, stopListening]);


  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleFontSizeIncrease = () => {
    if (preferences.fontSize === 'normal') {
      updateFontSize('large');
    } else if (preferences.fontSize === 'large') {
      updateFontSize('extra-large');
    }
  };

  const handleFontSizeDecrease = () => {
    if (preferences.fontSize === 'extra-large') {
      updateFontSize('large');
    } else if (preferences.fontSize === 'large') {
      updateFontSize('normal');
    }
  };

  const handleTextSpacingIncrease = () => {
    if (preferences.textSpacing === 'normal') {
      updateTextSpacing('large');
    } else if (preferences.textSpacing === 'large') {
      updateTextSpacing('extra-large');
    }
  };

  const handleTextSpacingDecrease = () => {
    if (preferences.textSpacing === 'extra-large') {
      updateTextSpacing('large');
    } else if (preferences.textSpacing === 'large') {
      updateTextSpacing('normal');
    }
  };

  const handleReadPage = () => {
    if (isSpeaking) {
      stopSpeech();
      setNotificationMessage('Leitura interrompida');
    } else {
      readPageContent((text: string) => speak(text, { 
        rate: preferences.speechRate,
        voiceGender: preferences.voiceGender 
      }));
      setNotificationMessage('Iniciando leitura da página');
    }
  };

  const handleReadSelection = () => {
    readSelectedText((text: string) => speak(text, { 
      rate: preferences.speechRate,
      voiceGender: preferences.voiceGender 
    }));
    setNotificationMessage('Lendo texto selecionado');
  };

  const handleVoiceCommand = () => {
    if (isListening) {
      stopListening();
      setNotificationMessage('Comandos por voz desativados');
    } else {
      startListening();
      setNotificationMessage('Comandos por voz ativados. Fale seus comandos.');
    }
  };

  // Limpar mensagem de notificação após 3 segundos
  useEffect(() => {
    if (notificationMessage) {
      const timer = setTimeout(() => setNotificationMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notificationMessage]);

  return (
    <>
      {/* Live region para notificações */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {notificationMessage}
      </div>

      <div
        className="fixed left-0 top-[120px] z-50"
        role="region"
        aria-label="Controles de acessibilidade"
      >
      {/* Painel de controles */}
      <div
        className={cn(
          'absolute left-0 top-0 bg-background border-r-2 border-border shadow-xl rounded-r-lg min-w-[240px]',
          'overflow-y-auto overflow-x-hidden',
          'transition-transform duration-300 ease-in-out',
          'accessibility-scrollbar',
          'max-h-[calc(100vh-140px)]',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="toolbar"
        aria-label="Ferramentas de acessibilidade"
      >
        <div className="space-y-2 p-3 pb-10">
          {/* Cabeçalho */}
          <div className="flex items-center gap-2 pb-2 border-b border-border sticky top-0 bg-background z-10">
            <Accessibility className="h-5 w-5 text-primary" aria-hidden="true" />
            <h3 className="font-semibold text-sm">Acessibilidade</h3>
          </div>

          {/* Informações de atalhos de teclado */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-2">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">Atalhos de Teclado:</p>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li><kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded text-xs">Alt</kbd> + <kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded text-xs">A</kbd> - Abrir/Fechar controles</li>
              <li><kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded text-xs">Alt</kbd> + <kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded text-xs">S</kbd> - Ler página</li>
              <li><kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded text-xs">Alt</kbd> + <kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded text-xs">Shift</kbd> + <kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded text-xs">S</kbd> - Parar leitura</li>
              <li><kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded text-xs">Alt</kbd> + <kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded text-xs">V</kbd> - Comandos por voz</li>
              <li><kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded text-xs">Esc</kbd> - Fechar controles</li>
            </ul>
          </div>

          {/* Controle de Tamanho da Fonte */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-xs font-medium">Tamanho da Fonte</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleFontSizeDecrease}
                disabled={preferences.fontSize === 'normal'}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="Diminuir tamanho da fonte"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </Button>
              <span className="flex-1 text-center text-xs">
                {preferences.fontSize === 'normal' && 'Normal'}
                {preferences.fontSize === 'large' && 'Grande'}
                {preferences.fontSize === 'extra-large' && 'Muito Grande'}
              </span>
              <Button
                onClick={handleFontSizeIncrease}
                disabled={preferences.fontSize === 'extra-large'}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="Aumentar tamanho da fonte"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Controle de Alto Contraste */}
          <div className="space-y-2">
            <Button
              onClick={toggleHighContrast}
              variant={preferences.highContrast ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start gap-2"
              aria-pressed={preferences.highContrast}
              aria-label={preferences.highContrast ? 'Desativar alto contraste' : 'Ativar alto contraste'}
            >
              <Contrast className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs">Alto Contraste</span>
            </Button>
          </div>

          {/* Espaçamento de Texto */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlignJustify className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-xs font-medium">Espaçamento</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleTextSpacingDecrease}
                disabled={preferences.textSpacing === 'normal'}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="Diminuir espaçamento"
              >
                <MinusCircle className="h-4 w-4" aria-hidden="true" />
              </Button>
              <span className="flex-1 text-center text-xs">
                {preferences.textSpacing === 'normal' && 'Normal'}
                {preferences.textSpacing === 'large' && 'Grande'}
                {preferences.textSpacing === 'extra-large' && 'Muito Grande'}
              </span>
              <Button
                onClick={handleTextSpacingIncrease}
                disabled={preferences.textSpacing === 'extra-large'}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="Aumentar espaçamento"
              >
                <PlusCircle className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Fonte para Dislexia */}
          <div className="space-y-2">
            <Button
              onClick={() => updateFontFamily(preferences.fontFamily === 'dyslexia' ? 'default' : 'dyslexia')}
              variant={preferences.fontFamily === 'dyslexia' ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start gap-2"
              aria-pressed={preferences.fontFamily === 'dyslexia'}
              aria-label={preferences.fontFamily === 'dyslexia' ? 'Desativar fonte para dislexia' : 'Ativar fonte para dislexia'}
            >
              <Brain className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs">Fonte para Dislexia</span>
            </Button>
          </div>

          {/* Destacar Links */}
          <div className="space-y-2">
            <Button
              onClick={toggleHighlightLinks}
              variant={preferences.highlightLinks ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start gap-2"
              aria-pressed={preferences.highlightLinks}
              aria-label={preferences.highlightLinks ? 'Desativar destaque de links' : 'Ativar destaque de links'}
            >
              <LinkIcon className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs">Destacar Links</span>
            </Button>
          </div>

          {/* Destacar Botões */}
          <div className="space-y-2">
            <Button
              onClick={toggleHighlightButtons}
              variant={preferences.highlightButtons ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start gap-2"
              aria-pressed={preferences.highlightButtons}
              aria-label={preferences.highlightButtons ? 'Desativar destaque de botões' : 'Ativar destaque de botões'}
            >
              <MousePointerClick className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs">Destacar Botões</span>
            </Button>
          </div>

          {/* Cursor Ampliado */}
          <div className="space-y-2">
            <Button
              onClick={toggleLargeCursor}
              variant={preferences.largeCursor ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start gap-2"
              aria-pressed={preferences.largeCursor}
              aria-label={preferences.largeCursor ? 'Desativar cursor ampliado' : 'Ativar cursor ampliado'}
            >
              <MousePointer2 className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs">Cursor Ampliado</span>
            </Button>
          </div>

          {/* Modo Leitura */}
          <div className="space-y-2">
            <Button
              onClick={toggleReadingMode}
              variant={preferences.readingMode ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start gap-2"
              aria-pressed={preferences.readingMode}
              aria-label={preferences.readingMode ? 'Desativar modo leitura' : 'Ativar modo leitura'}
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs">Modo Leitura</span>
            </Button>
          </div>

          {/* Leitor de Texto */}
          {isTTSSupported && (
            <>
              <div className="pt-2 border-t border-border space-y-2">
                <Button
                  onClick={handleReadPage}
                  variant={isSpeaking ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start gap-2"
                  aria-pressed={isSpeaking}
                  aria-label={isSpeaking ? 'Parar leitura' : 'Ler conteúdo da página'}
                >
                  {isSpeaking ? (
                    <VolumeX className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Volume2 className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="text-xs">{isSpeaking ? 'Parar Leitura' : 'Ler Conteúdo'}</span>
                </Button>
                <Button
                  onClick={handleReadSelection}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  aria-label="Ler texto selecionado"
                >
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                  <span className="text-xs">Ler Seleção</span>
                </Button>
                
                {/* Controle de voz (masculina/feminina) */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span className="text-xs font-medium">Voz</span>
                  </div>
                  <div className="flex items-center gap-2 px-2">
                    <Button
                      onClick={() => {
                        updateVoiceGender('male');
                        // Se estiver falando, reiniciar com voz masculina
                        if (isSpeaking) {
                          restartWithNewOptions({
                            voiceGender: 'male',
                            rate: preferences.speechRate,
                          });
                        }
                      }}
                      variant={preferences.voiceGender === 'male' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1 text-xs"
                      aria-label="Voz masculina"
                      aria-pressed={preferences.voiceGender === 'male'}
                    >
                      Masculina
                    </Button>
                    <Button
                      onClick={() => {
                        updateVoiceGender('female');
                        // Se estiver falando, reiniciar com voz feminina
                        if (isSpeaking) {
                          restartWithNewOptions({
                            voiceGender: 'female',
                            rate: preferences.speechRate,
                          });
                        }
                      }}
                      variant={preferences.voiceGender === 'female' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1 text-xs"
                      aria-label="Voz feminina"
                      aria-pressed={preferences.voiceGender === 'female'}
                    >
                      Feminina
                    </Button>
                  </div>
                </div>

                {/* Controle de velocidade de leitura */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span className="text-xs font-medium">Velocidade de Leitura</span>
                  </div>
                  <div className="flex items-center gap-2 px-2">
                    <Button
                      onClick={() => {
                        if (preferences.speechRate > 0.5) {
                          updateSpeechRate(preferences.speechRate - 0.1);
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      aria-label="Diminuir velocidade de leitura"
                      disabled={preferences.speechRate <= 0.5}
                    >
                      <Minus className="h-3 w-3" aria-hidden="true" />
                    </Button>
                    <span className="flex-1 text-center text-xs font-medium">
                      {preferences.speechRate.toFixed(1)}x
                    </span>
                    <Button
                      onClick={() => {
                        if (preferences.speechRate < 2) {
                          updateSpeechRate(preferences.speechRate + 0.1);
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      aria-label="Aumentar velocidade de leitura"
                      disabled={preferences.speechRate >= 2}
                    >
                      <Plus className="h-3 w-3" aria-hidden="true" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground px-2">
                    Atalho: Alt+S para ler, Alt+Shift+S para parar
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Comandos por Voz */}
          {isSTTSupported && (
            <div className="pt-2 border-t border-border space-y-2">
              <Button
                onClick={handleVoiceCommand}
                variant={isListening ? 'default' : 'outline'}
                size="sm"
                className="w-full justify-start gap-2"
                aria-pressed={isListening}
                aria-label={isListening ? 'Parar comandos por voz' : 'Ativar comandos por voz'}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Mic className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="text-xs">{isListening ? 'Parar Voz' : 'Comandos por Voz'}</span>
              </Button>
              {speechError && (
                <p className="text-xs text-destructive px-2" role="alert">{speechError}</p>
              )}
              {isListening && (
                <p className="text-xs text-muted-foreground px-2">
                  Comandos disponíveis: "ir para vagas", "ir para perfil", "fechar"
                </p>
              )}
              <p className="text-xs text-muted-foreground px-2">
                Atalho: Alt+V para ativar
              </p>
            </div>
          )}

          {/* Controle de Reduzir Animações */}
          <div className="space-y-2">
            <Button
              onClick={toggleAnimations}
              variant={preferences.reduceAnimations ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start gap-2"
              aria-pressed={preferences.reduceAnimations}
              aria-label={preferences.reduceAnimations ? 'Ativar animações' : 'Reduzir animações'}
            >
              <Pause className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs">Reduzir Animações</span>
            </Button>
          </div>

          {/* Botão de Reset */}
          <div className="pt-2 border-t border-border pb-4">
            <Button
              onClick={resetPreferences}
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-xs"
              aria-label="Restaurar configurações padrão"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Restaurar Padrão</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Botão principal para abrir/fechar - sempre visível */}
      <Button
        onClick={handleToggle}
        className={cn(
          'absolute left-0 top-0 rounded-r-lg rounded-l-none h-10 w-10 shadow-lg',
          'bg-primary hover:bg-primary/90 text-primary-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'transition-transform duration-300 ease-in-out z-10',
          isOpen ? 'translate-x-[240px]' : 'translate-x-0'
        )}
        aria-label={isOpen ? 'Fechar controles de acessibilidade' : 'Abrir controles de acessibilidade'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Accessibility className="h-5 w-5" aria-hidden="true" />
        )}
      </Button>
    </div>
    </>
  );
};

export default AccessibilityControls;

