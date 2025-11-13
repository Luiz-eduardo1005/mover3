
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
    <div className="fixed inset-0 h-screen w-full flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-800 overflow-hidden z-50">
      <div className="relative w-full h-full flex items-center justify-center px-4 sm:px-6">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "absolute w-16 h-16 sm:w-20 sm:h-20 md:w-40 md:h-40 rounded-full bg-white/10",
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
        
        <div className="relative z-10 text-center w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="mb-6 sm:mb-8 flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
              <div className="text-3xl sm:text-4xl font-bold text-brand-600 font-heading tracking-tighter">MV</div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-heading tracking-tight">
              MOVER
            </h1>
            <p className="text-white/80 mt-2 text-xs sm:text-sm md:text-base px-4">
              Mobilidade e Oportunidades para Vagas com Empregabilidade e Respeito
            </p>
          </div>
          
          {/* Loading bar */}
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto h-2 bg-white/20 rounded-full overflow-hidden mt-6 sm:mt-8 mb-3 sm:mb-4">
            <div 
              className="h-full bg-white rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-white/70 text-xs sm:text-sm mb-2">
            {progress === 100 ? 'Carregado!' : 'Carregando recursos...'}
          </p>
          
          {/* Loading messages */}
          <div className="h-6 sm:h-8 mt-3 sm:mt-4">
            {progress < 30 && (
              <p className="text-white/70 text-xs sm:text-sm animate-fade-in">
                Preparando vagas personalizadas...
              </p>
            )}
            {progress >= 30 && progress < 60 && (
              <p className="text-white/70 text-xs sm:text-sm animate-fade-in">
                Analisando melhores oportunidades...
              </p>
            )}
            {progress >= 60 && progress < 90 && (
              <p className="text-white/70 text-xs sm:text-sm animate-fade-in">
                Otimizando experiência do usuário...
              </p>
            )}
            {progress >= 90 && (
              <p className="text-white/70 text-xs sm:text-sm animate-fade-in">
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
