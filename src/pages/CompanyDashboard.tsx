import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, FileText, BarChart3, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompanyDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main
        id="main-content"
        className="flex-grow py-8 sm:py-10"
        role="main"
        aria-label="Dashboard da empresa"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Painel da Empresa
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Gerencie suas vagas e acompanhe as candidaturas recebidas.
              </p>
            </div>
            <Button
              className="bg-brand-500 hover:bg-brand-600"
              onClick={() => navigate('/advertise')}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar nova vaga
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Vagas ativas
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">—</div>
                <Briefcase className="h-6 w-6 text-brand-500" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Candidaturas recebidas
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">—</div>
                <Users className="h-6 w-6 text-brand-500" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Vagas em análise
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">—</div>
                <BarChart3 className="h-6 w-6 text-brand-500" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Minhas vagas</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/company/jobs')}
                  >
                    Ver todas
                  </Button>
                </CardTitle>
                <CardDescription>
                  Visão geral das vagas que você publicou recentemente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Em breve você poderá ver aqui um resumo das vagas ativas, pausadas e encerradas.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Últimas candidaturas</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/company/applications')}
                  >
                    Ver candidaturas
                  </Button>
                </CardTitle>
                <CardDescription>
                  Acompanhe quem se candidatou recentemente para suas vagas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Em breve você poderá visualizar as candidaturas mais recentes com detalhes do candidato.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Como funciona o painel da empresa?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p>
                Esta área é exclusiva para contas de empresa. Aqui você poderá criar vagas,
                acompanhar candidaturas, gerenciar seu perfil empresarial e ter uma visão
                completa dos seus processos seletivos.
              </p>
              <p>
                Se você acessou este painel, significa que sua conta está configurada como
                <strong> empresa</strong>. Contas de candidato continuam usando a página
                <strong> Meu Perfil</strong>.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyDashboard;


