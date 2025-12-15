import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompanyJobs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main
        id="main-content"
        className="flex-grow py-8 sm:py-10"
        role="main"
        aria-label="Vagas da empresa"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Minhas vagas
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Gerencie todas as vagas publicadas pela sua empresa.
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

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-brand-500" />
                Vagas publicadas
              </CardTitle>
              <CardDescription>
                Em breve você verá aqui a lista de vagas da sua empresa com filtros por status,
                data e quantidade de candidaturas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                A estrutura de banco (tabela <code className="font-mono">job_postings</code>) já pode ser usada
                para armazenar as vagas. Assim que as consultas estiverem prontas, esta página
                mostrará as vagas ativas, pausadas e encerradas, além de atalhos rápidos para
                visualizar os detalhes e as candidaturas de cada vaga.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyJobs;


