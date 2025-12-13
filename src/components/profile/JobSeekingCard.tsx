/**
 * MOVER - Card de Busca de Emprego
 * 
 * Desenvolvido por Luis Roberto Lins de Almeida e equipe ADS FAMetro
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface JobSeekingCardProps {
  onResponse?: (isLooking: boolean) => void;
}

const JobSeekingCard: React.FC<JobSeekingCardProps> = ({ onResponse }) => {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Usuário';

  // Verificar se deve mostrar o card
  useEffect(() => {
    if (!user?.id) return;

    const checkShouldShow = () => {
      const lastAnswerDate = localStorage.getItem(`job_seeking_last_answer_${user.id}`);
      const dismissedDate = localStorage.getItem(`job_seeking_dismissed_${user.id}`);
      const hasAnswered = localStorage.getItem(`job_seeking_answered_${user.id}`);
      const jobPreferences = (profile as any)?.job_preferences;

      // Se nunca respondeu, mostrar
      if (!hasAnswered && jobPreferences?.has_answered_job_seeking_question !== true) {
        // Verificar se foi dispensado hoje
        if (dismissedDate) {
          const dismissed = new Date(dismissedDate);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - dismissed.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // Se foi dispensado hoje, não mostrar
          if (diffDays < 1) {
            setShowCard(false);
            return;
          }
        }
        setShowCard(true);
        return;
      }

      // Se já respondeu, verificar se passou 1 semana
      if (lastAnswerDate) {
        const lastDate = new Date(lastAnswerDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Se passou 7 dias ou mais, mostrar novamente
        if (diffDays >= 7) {
          // Verificar se foi dispensado hoje
          if (dismissedDate) {
            const dismissed = new Date(dismissedDate);
            const dismissedDiffTime = Math.abs(now.getTime() - dismissed.getTime());
            const dismissedDiffDays = Math.ceil(dismissedDiffTime / (1000 * 60 * 60 * 24));
            
            // Se foi dispensado hoje, não mostrar
            if (dismissedDiffDays < 1) {
              setShowCard(false);
              return;
            }
          }
          setShowCard(true);
          return;
        }
      }

      setShowCard(false);
    };

    checkShouldShow();
  }, [user, profile]);

  const handleResponse = async (isLooking: boolean) => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Buscar preferências existentes
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('job_preferences')
        .eq('id', user.id)
        .single();

      const existingPreferences = existingProfile?.job_preferences || {};
      
      // Salvar a resposta no perfil, mantendo outras preferências
      const { error } = await supabase
        .from('profiles')
        .update({ 
          job_preferences: {
            ...existingPreferences,
            is_looking_for_job: isLooking,
            has_answered_job_seeking_question: true,
            last_answer_date: new Date().toISOString()
          }
        })
        .eq('id', user.id);

      if (error) throw error;

      // Salvar no localStorage
      localStorage.setItem(`job_seeking_answered_${user.id}`, 'true');
      localStorage.setItem(`job_seeking_response_${user.id}`, isLooking.toString());
      localStorage.setItem(`job_seeking_last_answer_${user.id}`, new Date().toISOString());

      await refreshProfile();
      
      if (onResponse) {
        onResponse(isLooking);
      }
      
      setIsDismissed(true);
      setShowCard(false);
    } catch (error: any) {
      console.error('Erro ao salvar resposta:', error);
      // Mesmo com erro, continuar com a resposta
      localStorage.setItem(`job_seeking_answered_${user.id}`, 'true');
      localStorage.setItem(`job_seeking_response_${user.id}`, isLooking.toString());
      localStorage.setItem(`job_seeking_last_answer_${user.id}`, new Date().toISOString());
      
      if (onResponse) {
        onResponse(isLooking);
      }
      
      setIsDismissed(true);
      setShowCard(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowCard(false);
    // Salvar que foi dispensado por hoje (mostrar novamente amanhã se necessário)
    localStorage.setItem(`job_seeking_dismissed_${user?.id}`, new Date().toISOString());
  };

  if (!showCard || isDismissed) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 mb-6">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {/* Ilustração simplificada */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">👋</span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Olá, {displayName}!
                </h3>
                <p className="text-base text-gray-700 dark:text-gray-300">
                  Você está procurando emprego no momento?
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Só você pode ver sua resposta.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <Button
                onClick={() => handleResponse(true)}
                disabled={loading}
                className="flex-1 bg-brand-500 hover:bg-brand-600 text-white"
              >
                {loading ? 'Salvando...' : 'Sim'}
              </Button>
              <Button
                onClick={() => handleResponse(false)}
                disabled={loading}
                variant="outline"
                className="flex-1 border-gray-300 dark:border-gray-600"
              >
                Não
              </Button>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobSeekingCard;

