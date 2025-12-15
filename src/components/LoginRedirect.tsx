import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Componente responsável por redirecionar automaticamente
 * usuários autenticados para a área correta (candidato x empresa),
 * evitando que acessem páginas que não fazem sentido para seu tipo.
 */
const LoginRedirect = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!user) {
      hasRedirected.current = false;
      return;
    }

    if (!loading && user && profile && !hasRedirected.current) {
      const timer = setTimeout(() => {
        const currentPath = location.pathname;

        // Páginas neutras que ambos podem acessar
        const neutralPaths = ['/', '/jobs', '/companies', '/courses', '/about'];
        if (
          currentPath === '/login' ||
          currentPath === '/register' ||
          currentPath === '/auth/callback' ||
          neutralPaths.includes(currentPath)
        ) {
          return;
        }

        if (profile.user_type === 'employer') {
          // Empresa não deve ficar em páginas específicas de candidato
          if (
            currentPath === '/profile' ||
            currentPath === '/curriculum' ||
            currentPath === '/applications'
          ) {
            hasRedirected.current = true;
            navigate('/company/dashboard', { replace: true });
          }
        } else {
          // Candidato não deve acessar área de empresa
          if (
            currentPath.startsWith('/company') ||
            currentPath === '/advertise'
          ) {
            hasRedirected.current = true;
            navigate('/profile', { replace: true });
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [user, profile, loading, navigate, location.pathname]);

  return null;
};

export default LoginRedirect;


