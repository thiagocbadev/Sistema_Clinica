import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ClinicProvider } from "@/contexts/ClinicContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Agenda from "./pages/Agenda";
import Pacientes from "./pages/Pacientes";
import Profissionais from "./pages/Profissionais";
import Servicos from "./pages/Servicos";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import PatientDashboard from "./pages/patient/PatientDashboard";
import { PatientLayout } from "./components/layout/PatientLayout";
import Login from "./pages/auth/Login";
import RegisterPatient from "./pages/auth/RegisterPatient";
import UserManagement from "./pages/admin/UserManagement";
import ProfessionalDashboard from "./pages/professional/ProfessionalDashboard";
import { ProtectedAdminRoute } from "./components/layout/ProtectedAdminRoute";
import { ProtectedProfessionalRoute } from "./components/layout/ProtectedProfessionalRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ClinicProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
            {/* Unified Auth */}
            <Route path="/" element={<Login />} />
            <Route path="/cadastro/paciente" element={<RegisterPatient />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedAdminRoute />}>
              <Route path="dashboard" element={<AppLayout><Index /></AppLayout>} />
              <Route path="agenda" element={<AppLayout><Agenda /></AppLayout>} />
              <Route path="pacientes" element={<AppLayout><Pacientes /></AppLayout>} />
              <Route path="profissionais" element={<AppLayout><Profissionais /></AppLayout>} />
              <Route path="servicos" element={<AppLayout><Servicos /></AppLayout>} />
              <Route path="configuracoes" element={<AppLayout><Configuracoes /></AppLayout>} />
              <Route path="usuarios" element={<AppLayout><UserManagement /></AppLayout>} />
            </Route>

            {/* Protected Professional Routes */}
            <Route element={<ProtectedProfessionalRoute />}>
              <Route path="profissional" element={<AppLayout><ProfessionalDashboard /></AppLayout>} />
            </Route>

            {/* Patient Portal Routes */}
            <Route path="portal" element={<PatientLayout />}>
              <Route path="dashboard" element={<PatientDashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </ClinicProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
