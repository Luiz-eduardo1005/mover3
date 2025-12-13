
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Mock data for job listings
const jobListings = [
  {
    id: 1,
    title: 'Desenvolvedor Full Stack',
    company: 'TechSolutions',
    location: 'Manaus, AM',
    type: 'Tempo integral',
    salary: 'R$ 6.000 - R$ 8.000',
    posted: '2 dias atrás',
    featured: true
  },
  {
    id: 2,
    title: 'Analista de Marketing Digital',
    company: 'Empresa Inovadora',
    location: 'Manaus, AM',
    type: 'Tempo integral',
    salary: 'R$ 4.500 - R$ 5.500',
    posted: '3 dias atrás',
    featured: false
  },
  {
    id: 3,
    title: 'Gerente de Vendas',
    company: 'VendaMais',
    location: 'Manaus, AM',
    type: 'Tempo integral',
    salary: 'R$ 7.000 - R$ 9.000',
    posted: '1 dia atrás',
    featured: true
  },
  {
    id: 4,
    title: 'Assistente Administrativo',
    company: 'AdminPro',
    location: 'Manaus, AM',
    type: 'Meio período',
    salary: 'R$ 2.000 - R$ 2.500',
    posted: '1 semana atrás',
    featured: false
  },
  {
    id: 5,
    title: 'Enfermeiro(a)',
    company: 'Hospital Central',
    location: 'Manaus, AM',
    type: 'Tempo integral',
    salary: 'R$ 4.000 - R$ 5.000',
    posted: '5 dias atrás',
    featured: false
  },
  {
    id: 6,
    title: 'Engenheiro Civil',
    company: 'Construtora Horizonte',
    location: 'Manaus, AM',
    type: 'Tempo integral',
    salary: 'R$ 8.000 - R$ 10.000',
    posted: '4 dias atrás',
    featured: true
  }
];

const JobList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar vagas salvas do Supabase
  const { data: savedJobs = [] } = useQuery({
    queryKey: ['savedJobs', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('job_posting_id')
        .eq('candidate_id', user.id);
      
      if (error) {
        console.error('Erro ao buscar vagas salvas:', error);
        return [];
      }
      
      return data.map(item => item.job_posting_id);
    },
    enabled: !!user?.id,
  });

  const handleSaveJob = async (e: React.MouseEvent, jobId: number | string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Faça login para salvar vagas');
      return;
    }

    const jobIdStr = jobId.toString();
    const isSaved = savedJobs.includes(jobIdStr);
    
    try {
      if (isSaved) {
        // Remover do Supabase
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('candidate_id', user.id)
          .eq('job_posting_id', jobIdStr);
        
        if (error) throw error;
        
        // Atualizar cache
        queryClient.setQueryData(['savedJobs', user.id], (old: string[] = []) => 
          old.filter(id => id !== jobIdStr)
        );
        
        toast.success('Vaga removida das salvas');
      } else {
        // Salvar no Supabase
        const { error } = await supabase
          .from('saved_jobs')
          .insert({
            candidate_id: user.id,
            job_posting_id: jobIdStr,
          });
        
        if (error) {
          // Se já existe, apenas atualizar cache
          if (error.code === '23505') {
            queryClient.setQueryData(['savedJobs', user.id], (old: string[] = []) => 
              [...old, jobIdStr]
            );
            toast.success('Vaga já estava salva');
            return;
          }
          throw error;
        }
        
        // Atualizar cache
        queryClient.setQueryData(['savedJobs', user.id], (old: string[] = []) => 
          [...old, jobIdStr]
        );
        
        toast.success('Vaga salva com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro ao salvar/remover vaga:', error);
      toast.error(error.message || 'Erro ao processar ação. Tente novamente.');
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {jobListings.map((job) => {
        const isSaved = savedJobs.includes(job.id.toString());
        return (
          <div key={job.id} className="relative group">
            <Link to={`/jobs/${job.id}`} className="block">
              <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow border-l-4 ${job.featured ? 'border-brand-500' : 'border-transparent'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center flex-shrink-0">
                        <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                  </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white truncate">{job.title}</h3>
                      {job.featured && (
                            <Badge className="w-fit bg-brand-100 dark:bg-brand-900 text-brand-800 dark:text-brand-200 hover:bg-brand-200 dark:hover:bg-brand-800 text-xs sm:text-sm">Destaque</Badge>
                      )}
                    </div>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">{job.company}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-0 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                          <span className="hidden sm:inline mx-2">•</span>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                      <span>{job.type}</span>
                    </div>
                  </div>
                </div>
              </div>
                  </div>
                  <div className="mt-2 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1 border-t sm:border-t-0 dark:border-gray-700 pt-3 sm:pt-0">
                    <span className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">{job.salary}</span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{job.posted}</span>
              </div>
            </div>
          </div>
        </Link>
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleSaveJob(e, job.id)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 shadow-md hover:shadow-lg h-8 w-8 sm:h-9 sm:w-9"
                aria-label={isSaved ? 'Remover das salvas' : 'Salvar vaga'}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 dark:text-brand-400" />
                ) : (
                  <Bookmark className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                )}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default JobList;
