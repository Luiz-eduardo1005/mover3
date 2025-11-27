
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
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import CookieConsent from "@/components/CookieConsent";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import Advertise from "./pages/Advertise";
import About from "./pages/About";
import CurriculumRegistration from "./pages/CurriculumRegistration";
import Courses from "./pages/Courses";
import LoadingPage from "./pages/LoadingPage";
import AuthCallback from "./pages/AuthCallback";
import Applications from "./pages/Applications";
import Messages from "./pages/Messages";
import CompanyProfile from "./pages/CompanyProfile";
import JobDetails from "./pages/JobDetails";
import Companies from "./pages/Companies";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/advertise" element={<Advertise />} />
            <Route path="/about" element={<About />} />
            <Route path="/curriculum" element={<CurriculumRegistration />} />
            <Route path="/courses" element={<Courses />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/company/:id" element={<CompanyProfile />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/loading" element={<LoadingPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
