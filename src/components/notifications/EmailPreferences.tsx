
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

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Bell, Briefcase, MessageSquare, Calendar, CheckCircle } from 'lucide-react';
import { useNotifications, EmailPreferences } from '@/hooks/useNotifications';
import { toast } from 'sonner';

const EmailPreferencesComponent = () => {
  const { emailPreferences, saveEmailPreferences } = useNotifications();
  const [preferences, setPreferences] = React.useState<EmailPreferences>(emailPreferences);

  React.useEffect(() => {
    setPreferences(emailPreferences);
  }, [emailPreferences]);

  const handleToggle = (key: keyof EmailPreferences) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
  };

  const handleSave = async () => {
    await saveEmailPreferences(preferences);
  };

  const preferencesConfig = [
    {
      key: 'application_updates' as keyof EmailPreferences,
      label: 'Atualizações de candidaturas',
      description: 'Receba emails quando o status da sua candidatura mudar',
      icon: Briefcase
    },
    {
      key: 'new_messages' as keyof EmailPreferences,
      label: 'Novas mensagens',
      description: 'Receba notificações por email quando receber novas mensagens',
      icon: MessageSquare
    },
    {
      key: 'job_matches' as keyof EmailPreferences,
      label: 'Vagas compatíveis',
      description: 'Receba sugestões de vagas que combinam com seu perfil',
      icon: CheckCircle
    },
    {
      key: 'interview_invites' as keyof EmailPreferences,
      label: 'Convites para entrevista',
      description: 'Receba emails quando for convidado para uma entrevista',
      icon: Calendar
    },
    {
      key: 'weekly_digest' as keyof EmailPreferences,
      label: 'Resumo semanal',
      description: 'Receba um resumo semanal das suas atividades na plataforma',
      icon: Bell
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-brand-600" />
          <CardTitle>Preferências de Email</CardTitle>
        </div>
        <CardDescription>
          Escolha quais tipos de notificações você deseja receber por email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {preferencesConfig.map((config) => {
          const Icon = config.icon;
          return (
            <div key={config.key} className="flex items-start justify-between gap-4 p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-4 w-4 text-gray-500" />
                  <Label htmlFor={config.key} className="font-medium cursor-pointer">
                    {config.label}
                  </Label>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {config.description}
                </p>
              </div>
              <Switch
                id={config.key}
                checked={preferences[config.key]}
                onCheckedChange={() => handleToggle(config.key)}
              />
            </div>
          );
        })}

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} className="bg-brand-500 hover:bg-brand-600">
            Salvar preferências
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailPreferencesComponent;

