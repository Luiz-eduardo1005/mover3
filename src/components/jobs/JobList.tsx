
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock } from 'lucide-react';

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
  return (
    <div className="space-y-3 sm:space-y-4">
      {jobListings.map((job) => (
        <Link to={`/jobs/${job.id}`} key={job.id} className="block">
          <div className={`bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow border-l-4 ${job.featured ? 'border-brand-500' : 'border-transparent'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">{job.title}</h3>
                      {job.featured && (
                        <Badge className="w-fit bg-brand-100 text-brand-800 hover:bg-brand-200 text-xs sm:text-sm">Destaque</Badge>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">{job.company}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-0 text-xs sm:text-sm text-gray-500">
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
              <div className="mt-2 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1 border-t sm:border-t-0 pt-3 sm:pt-0">
                <span className="text-base sm:text-lg font-medium text-gray-900">{job.salary}</span>
                <span className="text-xs sm:text-sm text-gray-500">{job.posted}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default JobList;
