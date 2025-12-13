/**
 * MOVER - Diálogo de Busca de Emprego
 * 
 * Desenvolvido por Luis Roberto Lins de Almeida e equipe ADS FAMetro
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface JobSeekingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResponse: (isLooking: boolean) => void;
}

const JobSeekingDialog: React.FC<JobSeekingDialogProps> = ({ open, onOpenChange, onResponse }) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Usuário';

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
            has_answered_job_seeking_question: true
          }
        })
        .eq('id', user.id);

      if (error) throw error;

      // Salvar no localStorage para não mostrar novamente
      localStorage.setItem(`job_seeking_answered_${user.id}`, 'true');
      localStorage.setItem(`job_seeking_response_${user.id}`, isLooking.toString());

      onResponse(isLooking);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao salvar resposta:', error);
      // Mesmo com erro, continuar com a resposta
      localStorage.setItem(`job_seeking_answered_${user.id}`, 'true');
      localStorage.setItem(`job_seeking_response_${user.id}`, isLooking.toString());
      onResponse(isLooking);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      // Não permitir fechar clicando fora ou pressionando ESC até responder
      if (!loading) {
        onOpenChange(open);
      }
    }}>
      <DialogContent className="sm:max-w-md p-0" onInteractOutside={(e) => e.preventDefault()}>
        <div className="relative">
          {/* Ilustração no topo */}
          <div className="bg-gradient-to-b from-pink-50 to-white dark:from-pink-900/20 dark:to-gray-800 p-6 pb-4 rounded-t-lg">
            <div className="flex justify-center items-center mb-4">
              <div className="relative w-48 h-32">
                {/* Ilustração simplificada de pessoas em uma mesa */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full flex items-end justify-center gap-2">
                    {/* Pessoa esquerda */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-orange-200 dark:bg-orange-800 rounded-full flex items-center justify-center mb-1">
                        <div className="w-8 h-8 bg-orange-300 dark:bg-orange-700 rounded-full"></div>
                      </div>
                      <div className="w-8 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                    {/* Mesa */}
                    <div className="w-20 h-4 bg-amber-200 dark:bg-amber-800 rounded mb-2"></div>
                    {/* Pessoa direita */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center mb-1">
                        <div className="w-8 h-8 bg-blue-300 dark:bg-blue-700 rounded-full"></div>
                      </div>
                      <div className="w-8 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogHeader className="px-6 pt-4">
            <DialogTitle className="text-xl text-center text-gray-900 dark:text-white">
              Olá, {displayName}. Você está procurando emprego no momento?
            </DialogTitle>
          </DialogHeader>
          
          <div className="px-6 pb-6 pt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-6">
              Só você pode ver sua resposta.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => handleResponse(true)}
                disabled={loading}
                variant="outline"
                className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                Sim
              </Button>
              <Button
                onClick={() => handleResponse(false)}
                disabled={loading}
                variant="outline"
                className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                Não
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobSeekingDialog;

