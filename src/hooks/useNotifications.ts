
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

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type NotificationType = 
  | 'application_status_changed'
  | 'new_message'
  | 'job_match'
  | 'interview_scheduled'
  | 'application_accepted'
  | 'application_rejected';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  metadata?: {
    jobId?: string;
    applicationId?: string;
    conversationId?: string;
    [key: string]: any;
  };
}

export interface EmailPreferences {
  application_updates: boolean;
  new_messages: boolean;
  job_matches: boolean;
  interview_invites: boolean;
  weekly_digest: boolean;
}

const defaultEmailPreferences: EmailPreferences = {
  application_updates: true,
  new_messages: true,
  job_matches: true,
  interview_invites: true,
  weekly_digest: false
};

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [emailPreferences, setEmailPreferences] = useState<EmailPreferences>(defaultEmailPreferences);
  const [loading, setLoading] = useState(true);

  // Carregar preferências de email do usuário
  useEffect(() => {
    if (user?.id) {
      loadEmailPreferences();
    }
  }, [user?.id]);

  const loadEmailPreferences = async () => {
    if (!user?.id) return;

    try {
      // TODO: Buscar do Supabase quando tabela estiver criada
      // Por enquanto usar localStorage
      const saved = localStorage.getItem(`email_preferences_${user.id}`);
      if (saved) {
        setEmailPreferences(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erro ao carregar preferências de email:', error);
    }
  };

  const saveEmailPreferences = async (preferences: EmailPreferences) => {
    if (!user?.id) return;

    try {
      // TODO: Salvar no Supabase
      localStorage.setItem(`email_preferences_${user.id}`, JSON.stringify(preferences));
      setEmailPreferences(preferences);
      toast.success('Preferências de email salvas!');
    } catch (error) {
      console.error('Erro ao salvar preferências de email:', error);
      toast.error('Erro ao salvar preferências');
    }
  };

  // Enviar notificação por email
  const sendEmailNotification = async (
    email: string,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Notification['metadata']
  ) => {
    // Verificar se o usuário quer receber este tipo de notificação
    const shouldSend = checkEmailPreference(type);
    if (!shouldSend) {
      console.log(`Email não enviado: usuário desabilitou notificações do tipo ${type}`);
      return;
    }

    try {
      // TODO: Integrar com serviço de email (Supabase Edge Function, Resend, SendGrid, etc.)
      // Exemplo de estrutura para Supabase Edge Function:
      /*
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: email,
          subject: title,
          html: generateEmailTemplate(type, message, metadata),
          type
        }
      });
      */

      // Por enquanto, apenas log
      console.log('Email notification:', {
        to: email,
        type,
        title,
        message,
        metadata
      });

      // Simular envio bem-suced
      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return { success: false, error };
    }
  };

  const checkEmailPreference = (type: NotificationType): boolean => {
    switch (type) {
      case 'application_status_changed':
      case 'application_accepted':
      case 'application_rejected':
        return emailPreferences.application_updates;
      case 'new_message':
        return emailPreferences.new_messages;
      case 'job_match':
        return emailPreferences.job_matches;
      case 'interview_scheduled':
        return emailPreferences.interview_invites;
      default:
        return true;
    }
  };

  // Criar e enviar notificação
  const createNotification = async (
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Notification['metadata'],
    sendEmail: boolean = true
  ) => {
    if (!user?.id) return;

    const notification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      read: false,
      created_at: new Date().toISOString(),
      metadata
    };

    try {
      // TODO: Salvar no Supabase
      // Por enquanto usar localStorage
      const existing = JSON.parse(localStorage.getItem(`notifications_${user.id}`) || '[]');
      const updated = [notification, ...existing];
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      setNotifications(updated);

      // Enviar email se solicitado
      if (sendEmail && user.email) {
        await sendEmailNotification(
          user.email,
          type,
          title,
          message,
          metadata
        );
      }

      return notification;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      return null;
    }
  };

  // Carregar notificações do usuário
  const loadNotifications = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // TODO: Buscar do Supabase
      const saved = JSON.parse(localStorage.getItem(`notifications_${user.id}`) || '[]');
      setNotifications(saved);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  // Marcar notificação como lida
  const markAsRead = async (notificationId: string) => {
    if (!user?.id) return;

    try {
      // TODO: Atualizar no Supabase
      const updated = notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      setNotifications(updated);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      // TODO: Atualizar no Supabase
      const updated = notifications.map(n => ({ ...n, read: true }));
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      setNotifications(updated);
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  // Carregar notificações quando o usuário fizer login
  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    } else {
      setNotifications([]);
    }
  }, [user?.id]);

  return {
    notifications,
    emailPreferences,
    loading,
    createNotification,
    markAsRead,
    markAllAsRead,
    saveEmailPreferences,
    loadNotifications,
    unreadCount: notifications.filter(n => !n.read).length
  };
};

// Template de email (exemplo)
export const generateEmailTemplate = (
  type: NotificationType,
  message: string,
  metadata?: Notification['metadata']
): string => {
  const baseTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a8fff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background: #1a8fff; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>MOVER</h1>
        </div>
        <div class="content">
          ${message}
        </div>
        <div class="footer">
          <p>Esta é uma mensagem automática do MOVER. Por favor, não responda este email.</p>
          <p><a href="${window.location.origin}/profile">Gerenciar preferências de email</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return baseTemplate;
};

