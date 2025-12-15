import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ArrowLeftRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompanyApplications: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main
        id="main-content"
        className="flex-grow py-8 sm:py-10"
        role="main"
        aria-label="Candidaturas recebidas"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Candidaturas
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Acompanhe os candidatos interessados nas vagas da sua empresa.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/company/jobs')}
            >
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Ir para minhas vagas
            </Button>
          </div>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-brand-500" />
                Candidaturas recebidas
              </CardTitle>
              <CardDescription>
                Em breve você verá aqui uma lista de candidaturas com status, vaga relacionada
                e dados principais do candidato.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                A tabela <code className="font-mono">job_applications</code> já pode ser usada para armazenar as
                candidaturas. Esta tela será o espelho da visão do candidato, porém focada na
                perspectiva da empresa, permitindo alterar o status (em análise, entrevista,
                aprovado, reprovado, etc.).
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyApplications;


