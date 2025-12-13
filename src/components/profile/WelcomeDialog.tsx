/**
 * MOVER - Componente de Boas-Vindas
 * Dialog que aparece quando o usuário acessa o perfil pela primeira vez
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userId: string;
  onAnswered: () => void;
}

const WelcomeDialog: React.FC<WelcomeDialogProps> = ({
  open,
  onOpenChange,
  userName,
  userId,
  onAnswered,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleAnswer = async (isLookingForJob: boolean) => {
    if (!userId) return;

    setIsSaving(true);
    try {
      // Salvar a resposta no perfil usando um campo JSONB para preferências
      const { error } = await supabase
        .from('profiles')
        .update({
          job_seeking_status: isLookingForJob ? 'active' : 'not_looking',
          welcome_answered: true,
          welcome_answered_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        // Se os campos não existirem, tentar salvar em um campo JSONB
        const preferences = {
          job_seeking: isLookingForJob,
          welcome_answered: true,
          welcome_answered_at: new Date().toISOString(),
        };

        const { error: error2 } = await supabase
          .from('profiles')
          .update({
            // Tentar salvar em um campo JSONB se existir, senão usar localStorage
          })
          .eq('id', userId);

        if (error2) {
          // Se não conseguir salvar no banco, usar localStorage
          localStorage.setItem(`mover_welcome_${userId}`, JSON.stringify({
            job_seeking: isLookingForJob,
            answered: true,
            answered_at: new Date().toISOString(),
          }));
        }
      }

      onAnswered();
      onOpenChange(false);
      
      if (isLookingForJob) {
        toast.success('Ótimo! Vamos te ajudar a encontrar a vaga ideal.');
      } else {
        toast.info('Sem problemas! Você pode mudar isso a qualquer momento.');
      }
    } catch (error: any) {
      console.error('Erro ao salvar resposta:', error);
      toast.error('Erro ao salvar sua resposta. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg" aria-describedby="welcome-description">
        <DialogHeader>
          <DialogTitle className="sr-only">Boas-vindas</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Ilustração */}
          <div className="flex justify-center">
            <div className="relative w-48 h-32 bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900 dark:to-brand-800 rounded-lg flex items-center justify-center">
              <Users className="h-16 w-16 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            </div>
          </div>

          {/* Mensagem de boas-vindas */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Olá, {userName || 'usuário'}!
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Você está procurando emprego no momento?
            </p>
          </div>

          {/* Nota de privacidade */}
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Só você pode ver sua resposta.
          </p>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={() => handleAnswer(true)}
              disabled={isSaving}
              className="flex-1 bg-brand-500 hover:bg-brand-600 text-white h-12 text-base font-medium"
              aria-label="Sim, estou procurando emprego"
            >
              Sim
            </Button>
            <Button
              onClick={() => handleAnswer(false)}
              disabled={isSaving}
              variant="outline"
              className="flex-1 border-2 border-brand-500 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 h-12 text-base font-medium"
              aria-label="Não, não estou procurando emprego"
            >
              Não
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;

