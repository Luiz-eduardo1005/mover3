
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
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, Send, Search, User, Building2, 
  Clock, Check, CheckCheck, ArrowLeft 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import LoadingPage from './LoadingPage';

// Mock data - substituir por dados reais do Supabase
const mockConversations = [
  {
    id: '1',
    participant: {
      id: '1',
      name: 'TechSolutions',
      avatar: null,
      type: 'company'
    },
    lastMessage: {
      text: 'Olá! Gostaríamos de agendar uma entrevista.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false
    },
    unreadCount: 2,
    jobTitle: 'Desenvolvedor Full Stack'
  },
  {
    id: '2',
    participant: {
      id: '2',
      name: 'Empresa Inovadora',
      avatar: null,
      type: 'company'
    },
    lastMessage: {
      text: 'Obrigado pelo interesse! Analisaremos seu currículo.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    unreadCount: 0,
    jobTitle: 'Analista de Marketing Digital'
  },
  {
    id: '3',
    participant: {
      id: '3',
      name: 'João Silva',
      avatar: null,
      type: 'candidate'
    },
    lastMessage: {
      text: 'Tenho interesse na vaga. Posso enviar meu currículo?',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    unreadCount: 0,
    jobTitle: 'Gerente de Vendas'
  }
];

// Mock messages - será substituído por dados reais
const getMockMessages = (currentUserId?: string) => ({
  '1': [
    {
      id: '1',
      senderId: '1',
      text: 'Olá! Recebemos sua candidatura.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: '2',
      senderId: currentUserId || 'current',
      text: 'Obrigado! Fico no aguardo.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: '3',
      senderId: '1',
      text: 'Gostaríamos de agendar uma entrevista. Você está disponível?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: '4',
      senderId: '1',
      text: 'Olá! Gostaríamos de agendar uma entrevista.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      read: false
    }
  ]
});

const Messages = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Mostrar loading apenas enquanto está verificando autenticação
  // Se o usuário existe mas o perfil não, ainda assim mostrar a página
  if (loading && !user) {
    return <LoadingPage />;
  }

  // Filtrar conversas por busca
  const filteredConversations = mockConversations.filter(conv => 
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = selectedConversation 
    ? mockConversations.find(c => c.id === selectedConversation)
    : null;

  const mockMessages = getMockMessages(user?.id);
  const messages = selectedConversation && mockMessages[selectedConversation as keyof typeof mockMessages]
    ? mockMessages[selectedConversation as keyof typeof mockMessages]
    : [];

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    // TODO: Enviar mensagem para o Supabase
    console.log('Enviar mensagem:', messageText);
    setMessageText('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Agora';
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffHours < 48) return 'Ontem';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow py-6 sm:py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Mensagens
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Converse com empresas e candidatos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6" style={{ height: 'calc(100vh - 200px)' }}>
            {/* Lista de conversas - Mobile: ocultar quando conversa selecionada */}
            <Card className={`lg:col-span-1 flex flex-col bg-white dark:bg-gray-800 ${selectedConversation && 'hidden lg:flex'}`}>
              <CardContent className="p-0 flex flex-col h-full">
                {/* Busca */}
                <div className="p-3 sm:p-4 border-b dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar conversas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 sm:pl-10 text-sm dark:bg-gray-800 h-9 sm:h-10"
                    />
                  </div>
                </div>

                {/* Lista */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-2 sm:p-3">
                    {filteredConversations.length > 0 ? (
                      filteredConversations.map((conversation) => {
                        const isSelected = selectedConversation === conversation.id;
                        const isUnread = conversation.unreadCount > 0;
                        
                        return (
                          <div
                            key={conversation.id}
                            onClick={() => {
                              setSelectedConversation(conversation.id);
                            }}
                            className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-colors mb-2 active:scale-[0.98] ${
                              isSelected
                                ? 'bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                                <AvatarImage src={conversation.participant.avatar || undefined} />
                                <AvatarFallback className="text-xs bg-gray-200 dark:bg-gray-700">
                                  {conversation.participant.type === 'company' ? (
                                    <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" />
                                  ) : (
                                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" />
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1 gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm sm:text-base font-semibold truncate ${
                                      isUnread 
                                        ? 'text-gray-900 dark:text-white' 
                                        : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                      {conversation.participant.name}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                      {conversation.jobTitle}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    {isUnread && (
                                      <Badge className="bg-brand-500 text-white text-xs h-5 px-2 flex-shrink-0">
                                        {conversation.unreadCount}
                                      </Badge>
                                    )}
                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                      {formatTime(conversation.lastMessage.timestamp)}
                                    </span>
                                  </div>
                                </div>
                                <p className={`text-sm truncate mt-1 ${
                                  isUnread 
                                    ? 'text-gray-900 dark:text-white font-medium' 
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                  {conversation.lastMessage.text}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Nenhuma conversa encontrada
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Área de mensagens - Mobile: mostrar quando conversa selecionada */}
            <Card className={`lg:col-span-2 flex flex-col bg-white dark:bg-gray-800 ${!selectedConversation && 'hidden lg:flex'}`}>
              {selectedConv ? (
                <>
                  {/* Header da conversa */}
                  <div className="p-3 sm:p-4 border-b dark:border-gray-700 flex items-center gap-3">
                    {/* Botão voltar - apenas mobile */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedConversation(null);
                      }}
                      className="lg:hidden h-9 w-9 flex-shrink-0"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                      <AvatarImage src={selectedConv.participant.avatar || undefined} />
                      <AvatarFallback className="text-xs bg-gray-200 dark:bg-gray-700">
                        {selectedConv.participant.type === 'company' ? (
                          <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" />
                        ) : (
                          <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white truncate">
                        {selectedConv.participant.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                        {selectedConv.jobTitle}
                      </p>
                    </div>
                  </div>

                  {/* Mensagens */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                      {messages.map((message) => {
                        const isOwn = message.senderId === user?.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] lg:max-w-[80%] rounded-2xl p-3 sm:p-4 ${
                              isOwn
                                ? 'bg-brand-500 text-white rounded-br-sm'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm'
                            }`}>
                              <p className="text-sm sm:text-base break-words leading-relaxed">{message.text}</p>
                              <div className="flex items-center justify-end gap-1.5 mt-2">
                                <span className={`text-xs ${
                                  isOwn ? 'text-brand-100' : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                  {formatTime(message.timestamp)}
                                </span>
                                {isOwn && (
                                  message.read ? (
                                    <CheckCheck className="h-3.5 w-3.5 text-brand-100" />
                                  ) : (
                                    <Check className="h-3.5 w-3.5 text-brand-100" />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Input de mensagem */}
                  <div className="p-3 sm:p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex gap-2 items-end">
                      <Input
                        placeholder="Digite sua mensagem..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="flex-1 dark:bg-gray-700 text-sm sm:text-base h-11 sm:h-12 rounded-full px-4"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className="bg-brand-500 hover:bg-brand-600 h-11 w-11 sm:h-12 sm:w-12 p-0 rounded-full flex-shrink-0 disabled:opacity-50"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-6 sm:p-8 min-h-[400px]">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Selecione uma conversa
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 px-4 max-w-md">
                      Escolha uma conversa da lista para começar a trocar mensagens
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Messages;

