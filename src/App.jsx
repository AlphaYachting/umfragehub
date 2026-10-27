import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';

// Seiten werden erst geladen, wenn sie gebraucht werden. Befragte laden so nur die
// Interview-Seite, die Verwaltung nur die Seite, die gerade offen ist.
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const Projects = lazy(() => import('@/pages/Projects'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const WaveEditor = lazy(() => import('@/pages/WaveEditor'));
const WaveDashboard = lazy(() => import('@/pages/WaveDashboard'));
const RawData = lazy(() => import('@/pages/RawData'));
const WaveInvites = lazy(() => import('@/pages/WaveInvites'));
const QuestionLibrary = lazy(() => import('@/pages/QuestionLibrary'));
const Interview = lazy(() => import('@/pages/Interview'));
const Startseite = lazy(() => import('@/pages/Startseite'));
const KundenCockpit = lazy(() => import('@/pages/KundenCockpit'));
const ModulPositionierung = lazy(() => import('@/pages/modul/Positionierung'));
const ModulTeam = lazy(() => import('@/pages/modul/Team'));
const ModulKunden = lazy(() => import('@/pages/modul/Kunden'));
const ModulVertrieb = lazy(() => import('@/pages/modul/Vertrieb'));
const UeberUns = lazy(() => import('@/pages/UeberUns'));
const Kontakt = lazy(() => import('@/pages/Kontakt'));
const Preise = lazy(() => import('@/pages/Preise'));

const Laden = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-border border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-border border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Suspense fallback={<Laden />}>
    <Routes>
      {/* Öffentlich: Startseite für alle, die andifragt.at ohne Befragungslink aufrufen */}
      <Route path="/" element={<Startseite />} />
      {/* Öffentlich: die vier Modulseiten */}
      <Route path="/positionierung" element={<ModulPositionierung />} />
      <Route path="/team" element={<ModulTeam />} />
      <Route path="/kunden" element={<ModulKunden />} />
      <Route path="/vertrieb" element={<ModulVertrieb />} />
      {/* Öffentlich: Über uns und Kontakt */}
      <Route path="/ueber-uns" element={<UeberUns />} />
      <Route path="/kontakt" element={<Kontakt />} />
      {/* Öffentlich: Preise mit Rechner */}
      <Route path="/preise" element={<Preise />} />
      <Route path="/i/:linkToken" element={<Interview />} />
      {/* Öffentlich mit Passwort: Kunden-Cockpit des Auftraggebers */}
      <Route path="/k/:code" element={<KundenCockpit />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AdminLayout />}>
          <Route path="/verwaltung" element={<Projects />} />
          <Route path="/projekt/:id" element={<ProjectDetail />} />
          <Route path="/welle/:id/editor" element={<WaveEditor />} />
          <Route path="/welle/:id/dashboard" element={<WaveDashboard />} />
          <Route path="/welle/:id/rohdaten" element={<RawData />} />
          <Route path="/welle/:id/einladungen" element={<WaveInvites />} />
          <Route path="/bibliothek" element={<QuestionLibrary />} />
        </Route>
      </Route>
      {/* Unbekannte Adressen landen auf der Startseite */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App