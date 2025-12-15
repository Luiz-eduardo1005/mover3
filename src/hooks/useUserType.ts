import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook de conveniência para acessar rapidamente o tipo de usuário
 * (candidate | employer) e alguns helpers úteis.
 */
export const useUserType = () => {
  const { user, profile, loading } = useAuth();

  const userType = profile?.user_type ?? null;

  const isCandidate = useMemo(() => userType === 'candidate', [userType]);
  const isEmployer = useMemo(() => userType === 'employer', [userType]);

  return {
    user,
    profile,
    loading,
    userType,
    isCandidate,
    isEmployer,
    isAuthenticated: !!user && !loading,
  };
};


