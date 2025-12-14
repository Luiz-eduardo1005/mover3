
/**
 * MOVER - Mobilidade e Oportunidades para Vagas com Empregabilidade e Respeito
 * 
 * Desenvolvido por Luis Roberto Lins de Almeida e equipe ADS FAMetro
 * Curso: Análise e Desenvolvimento de Sistemas (ADS)
 * Instituição: FAMETRO - Faculdade Metropolitana de Manaus
 * Período: 2º Período - 2025
 * 
 * Copyright (c) 2025 Luis Roberto Lins de Almeida e equipe ADS FAMetro
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import CookieConsent from "@/components/CookieConsent";
import AccessibilityControls from "@/components/AccessibilityControls";
import QuickNavigation from "@/components/navigation/QuickNavigation";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import React, { lazy, Suspense, useEffect } from "react";
import { initGA, trackPageView } from "@/lib/analytics";
import LoadingPage from "./pages/LoadingPage";
import ErrorPage from "./pages/ErrorPage";

// Lazy loading de rotas para code splitting
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Jobs = lazy(() => import("./pages/Jobs"));
const Profile = lazy(() => import("./pages/Profile"));
const Advertise = lazy(() => import("./pages/Advertise"));
const About = lazy(() => import("./pages/About"));
const CurriculumRegistration = lazy(() => import("./pages/CurriculumRegistration"));
const Courses = lazy(() => import("./pages/Courses"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Applications = lazy(() => import("./pages/Applications"));
const Messages = lazy(() => import("./pages/Messages"));
const CompanyProfile = lazy(() => import("./pages/CompanyProfile"));
const JobDetails = lazy(() => import("./pages/JobDetails"));
const Companies = lazy(() => import("./pages/Companies"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

// Componente para rastrear mudanças de rota
const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Inicializar GA na primeira carga
    if (typeof window !== 'undefined' && !window.gtag) {
      initGA();
    }

    // Rastrear visualização de página
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return null;
};

// Componente de Suspense para loading
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingPage />}>
    {children}
  </Suspense>
);

const App = () => (
  <ErrorBoundary>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RouteTracker />
            <AccessibilityProvider>
              <AuthProvider>
                <Routes>
                  <Route path="/" element={<SuspenseWrapper><Index /></SuspenseWrapper>} />
                  <Route path="/login" element={<SuspenseWrapper><Login /></SuspenseWrapper>} />
                  <Route path="/register" element={<SuspenseWrapper><Register /></SuspenseWrapper>} />
                  <Route path="/auth/callback" element={<SuspenseWrapper><AuthCallback /></SuspenseWrapper>} />
                  <Route path="/jobs" element={<SuspenseWrapper><Jobs /></SuspenseWrapper>} />
                  <Route path="/profile" element={<SuspenseWrapper><Profile /></SuspenseWrapper>} />
                  <Route 
                    path="/advertise" 
                    element={
                      <SuspenseWrapper>
                        <ProtectedRoute allowedUserTypes={['employer']}>
                          <Advertise />
                        </ProtectedRoute>
                      </SuspenseWrapper>
                    } 
                  />
                  <Route path="/about" element={<SuspenseWrapper><About /></SuspenseWrapper>} />
                  <Route 
                    path="/curriculum" 
                    element={
                      <SuspenseWrapper>
                        <ProtectedRoute allowedUserTypes={['candidate']}>
                          <CurriculumRegistration />
                        </ProtectedRoute>
                      </SuspenseWrapper>
                    } 
                  />
                  <Route path="/courses" element={<SuspenseWrapper><Courses /></SuspenseWrapper>} />
                  <Route 
                    path="/applications" 
                    element={
                      <SuspenseWrapper>
                        <ProtectedRoute allowedUserTypes={['candidate']}>
                          <Applications />
                        </ProtectedRoute>
                      </SuspenseWrapper>
                    } 
                  />
                  <Route path="/messages" element={<SuspenseWrapper><Messages /></SuspenseWrapper>} />
                  <Route path="/companies" element={<SuspenseWrapper><Companies /></SuspenseWrapper>} />
                  <Route path="/company/:id" element={<SuspenseWrapper><CompanyProfile /></SuspenseWrapper>} />
                  <Route path="/jobs/:id" element={<SuspenseWrapper><JobDetails /></SuspenseWrapper>} />
                  <Route path="/loading" element={<LoadingPage />} />
                  <Route path="/error" element={<ErrorPage statusCode={500} />} />
                  <Route path="/404" element={<ErrorPage statusCode={404} />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<SuspenseWrapper><NotFound /></SuspenseWrapper>} />
                </Routes>
                <QuickNavigation />
                <CookieConsent />
                <AccessibilityControls />
              </AuthProvider>
            </AccessibilityProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
