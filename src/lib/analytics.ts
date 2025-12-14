/**
 * MOVER - Google Analytics 4 Integration
 * 
 * Desenvolvido por Luis Roberto Lins de Almeida e equipe ADS FAMetro
 */

// Google Analytics 4 Measurement ID
// Substitua pelo seu ID real quando tiver
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Inicializar Google Analytics
export const initGA = () => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

  // Criar script do Google Analytics
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Inicializar dataLayer e gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(...args: any[]) {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    anonymize_ip: true, // Privacidade
  });
};

// Rastrear visualização de página
export const trackPageView = (path: string, title?: string) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title || document.title,
  });
};

// Rastrear eventos
export const trackEvent = (
  eventName: string,
  eventParams?: {
    category?: string;
    label?: string;
    value?: number;
    [key: string]: any;
  }
) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, {
    event_category: eventParams?.category || 'general',
    event_label: eventParams?.label,
    value: eventParams?.value,
    ...eventParams,
  });
};

// Eventos específicos do MOVER
export const analytics = {
  // Eventos de navegação
  pageView: (path: string, title?: string) => trackPageView(path, title),
  
  // Eventos de busca
  search: (query: string, resultsCount?: number) => {
    trackEvent('search', {
      category: 'engagement',
      label: query,
      value: resultsCount,
      search_term: query,
    });
  },
  
  // Eventos de vagas
  viewJob: (jobId: string, jobTitle: string) => {
    trackEvent('view_item', {
      category: 'jobs',
      label: jobTitle,
      item_id: jobId,
      item_name: jobTitle,
    });
  },
  
  applyJob: (jobId: string, jobTitle: string) => {
    trackEvent('job_application', {
      category: 'jobs',
      label: jobTitle,
      item_id: jobId,
      item_name: jobTitle,
    });
  },
  
  saveJob: (jobId: string, jobTitle: string) => {
    trackEvent('save_job', {
      category: 'jobs',
      label: jobTitle,
      item_id: jobId,
      item_name: jobTitle,
    });
  },
  
  // Eventos de perfil
  profileView: () => {
    trackEvent('profile_view', {
      category: 'user',
    });
  },
  
  profileUpdate: (section: string) => {
    trackEvent('profile_update', {
      category: 'user',
      label: section,
    });
  },
  
  // Eventos de acessibilidade
  accessibilityFeature: (feature: string, action: 'enable' | 'disable') => {
    trackEvent('accessibility_feature', {
      category: 'accessibility',
      label: feature,
      action: action,
    });
  },
  
  // Eventos de autenticação
  login: (method: 'email' | 'google') => {
    trackEvent('login', {
      category: 'authentication',
      label: method,
    });
  },
  
  signup: (userType: 'candidate' | 'employer') => {
    trackEvent('sign_up', {
      category: 'authentication',
      label: userType,
    });
  },
  
  // Eventos de erro
  error: (errorType: string, errorMessage: string) => {
    trackEvent('exception', {
      category: 'error',
      label: errorType,
      description: errorMessage,
      fatal: false,
    });
  },
};

