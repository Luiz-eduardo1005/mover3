/**
 * MOVER - Skeleton Loader Component
 * Componente de loading com animação para melhor UX
 */

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  variant = 'rectangular',
  width,
  height,
  ...props 
}) => {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700";
  
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-md",
    card: "rounded-lg"
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
      aria-hidden="true"
      {...props}
    />
  );
};

// Componente para skeleton de card de vaga
export const JobCardSkeleton: React.FC = () => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
    <div className="flex items-start gap-3">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="40%" height={16} />
        <Skeleton variant="text" width="80%" height={14} />
      </div>
    </div>
    <div className="flex gap-2">
      <Skeleton variant="rectangular" width={80} height={24} />
      <Skeleton variant="rectangular" width={100} height={24} />
    </div>
  </div>
);

// Componente para skeleton de lista
export const JobListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-4" aria-label="Carregando vagas" role="status">
    {Array.from({ length: count }).map((_, i) => (
      <JobCardSkeleton key={i} />
    ))}
    <span className="sr-only">Carregando conteúdo...</span>
  </div>
);

export default Skeleton;

