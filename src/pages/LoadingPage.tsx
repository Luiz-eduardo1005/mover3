
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            navigate('/');
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 120);
    
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-600 to-brand-800 overflow-hidden">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "absolute w-20 h-20 md:w-40 md:h-40 rounded-full bg-white/10",
                "animate-pulse"
              )}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${3 + Math.random() * 5}s`,
                animationDelay: `${Math.random() * 2}s`,
                transform: `scale(${0.5 + Math.random() * 0.5})`,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
              <div className="text-4xl font-bold text-brand-600 font-heading tracking-tighter">MV</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-heading tracking-tight">
              MOVER
            </h1>
            <p className="text-white/80 mt-2 text-sm md:text-base">
              Mobilidade e Oportunidades para Vagas com Empregabilidade e Respeito
            </p>
          </div>
          
          {/* Loading bar */}
          <div className="w-64 md:w-96 h-2 bg-white/20 rounded-full overflow-hidden mt-8 mb-4">
            <div 
              className="h-full bg-white rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-white/70 text-sm">
            {progress === 100 ? 'Carregado!' : 'Carregando recursos...'}
          </p>
          
          {/* Loading messages */}
          <div className="h-8 mt-4">
            {progress < 30 && (
              <p className="text-white/70 text-sm animate-fade-in">
                Preparando vagas personalizadas...
              </p>
            )}
            {progress >= 30 && progress < 60 && (
              <p className="text-white/70 text-sm animate-fade-in">
                Analisando melhores oportunidades...
              </p>
            )}
            {progress >= 60 && progress < 90 && (
              <p className="text-white/70 text-sm animate-fade-in">
                Otimizando experiência do usuário...
              </p>
            )}
            {progress >= 90 && (
              <p className="text-white/70 text-sm animate-fade-in">
                Quase lá! Finalizando...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
