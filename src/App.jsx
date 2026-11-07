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
const NichtGefunden = lazy(() => import('@/pages/NichtGefunden'));
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
// Außenblick-Modul (Akquise): Zielliste und Zielkarte (nur Verwaltung, unter /akquise) sowie das
// öffentliche Portal für das Unternehmen (/aussenblick = Code-Eingang, /a/:code = die Seite)
const Zielliste = lazy(() => import('@/pages/aussenblick/Zielliste'));
const Zielkarte = lazy(() => import('@/pages/aussenblick/Zielkarte'));
const PortalEingang = lazy(() => import('@/pages/aussenblick/PortalEingang'));
const Portal = lazy(() => import('@/pages/aussenblick/Portal'));
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
// Rechtstexte (02.11.2026): nur über den Fuß verlinkt
const Impressum = lazy(() => import('@/pages/Impressum'));
const Datenschutz = lazy(() => import('@/pages/Datenschutz'));
// Wissensbereich: Übersicht und je Beitrag eine eigene dünne Seite (Titel und Beschreibung je Seite in Base44)
const Wissen = lazy(() => import('@/pages/wissen/Wissen'));
const WissenMitarbeiterbefragungErgebnisse = lazy(() => import('@/pages/wissen/beitrag/WissenMitarbeiterbefragungErgebnisse'));
const WissenWarumKuendigenGuteMitarbeiter = lazy(() => import('@/pages/wissen/beitrag/WissenWarumKuendigenGuteMitarbeiter'));
const WissenAlleinstellungsmerkmalFinden = lazy(() => import('@/pages/wissen/beitrag/WissenAlleinstellungsmerkmalFinden'));
const WissenWarumKaufenKundenBeiDerKonkurrenz = lazy(() => import('@/pages/wissen/beitrag/WissenWarumKaufenKundenBeiDerKonkurrenz'));
const WissenAbschlussquoteErhoehen = lazy(() => import('@/pages/wissen/beitrag/WissenAbschlussquoteErhoehen'));
// Zielgruppe 2: Unternehmensnachfolge
const WissenUnternehmensnachfolgeMarketing = lazy(() => import('@/pages/wissen/beitrag/WissenUnternehmensnachfolgeMarketing'));
const WissenGenerationenwechselFamilienunternehmenMarke = lazy(() => import('@/pages/wissen/beitrag/WissenGenerationenwechselFamilienunternehmenMarke'));
const WissenBetriebsuebergabeKundenInformieren = lazy(() => import('@/pages/wissen/beitrag/WissenBetriebsuebergabeKundenInformieren'));
const WissenMitarbeiterNachBetriebsuebernahme = lazy(() => import('@/pages/wissen/beitrag/WissenMitarbeiterNachBetriebsuebernahme'));
const WissenBetriebsuebernahmeErste100Tage = lazy(() => import('@/pages/wissen/beitrag/WissenBetriebsuebernahmeErste100Tage'));
const WissenBetriebsuebergabeVorbereiten = lazy(() => import('@/pages/wissen/beitrag/WissenBetriebsuebergabeVorbereiten'));
const WissenGesellschafterUneinigMarketing = lazy(() => import('@/pages/wissen/beitrag/WissenGesellschafterUneinigMarketing'));
const WissenKiEinfuehrenMitarbeiter = lazy(() => import('@/pages/wissen/beitrag/WissenKiEinfuehrenMitarbeiter'));
const WissenPreiserhoehungKundenMitteilen = lazy(() => import('@/pages/wissen/beitrag/WissenPreiserhoehungKundenMitteilen'));
const WissenVertriebAnkurbeln = lazy(() => import('@/pages/wissen/beitrag/WissenVertriebAnkurbeln'));
const WissenPersonalabbauMitarbeiterHalten = lazy(() => import('@/pages/wissen/beitrag/WissenPersonalabbauMitarbeiterHalten'));
const WissenMitarbeiterHaltenOhneGehaltserhoehung = lazy(() => import('@/pages/wissen/beitrag/WissenMitarbeiterHaltenOhneGehaltserhoehung'));
const WissenMitarbeiterbefragungIso9001 = lazy(() => import('@/pages/wissen/beitrag/WissenMitarbeiterbefragungIso9001'));
const WissenMitarbeiterbefragungIso45001 = lazy(() => import('@/pages/wissen/beitrag/WissenMitarbeiterbefragungIso45001'));

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
      {/* Öffentlich: Rechtstexte, nur im Fuß verlinkt */}
      <Route path="/impressum" element={<Impressum />} />
      <Route path="/datenschutz" element={<Datenschutz />} />
      <Route path="/wissen" element={<Wissen />} />
      <Route path="/wissen/mitarbeiterbefragung-ergebnisse" element={<WissenMitarbeiterbefragungErgebnisse />} />
      <Route path="/wissen/warum-kuendigen-gute-mitarbeiter" element={<WissenWarumKuendigenGuteMitarbeiter />} />
      <Route path="/wissen/alleinstellungsmerkmal-finden" element={<WissenAlleinstellungsmerkmalFinden />} />
      <Route path="/wissen/warum-kaufen-kunden-bei-der-konkurrenz" element={<WissenWarumKaufenKundenBeiDerKonkurrenz />} />
      <Route path="/wissen/abschlussquote-erhoehen" element={<WissenAbschlussquoteErhoehen />} />
      <Route path="/wissen/unternehmensnachfolge-marketing" element={<WissenUnternehmensnachfolgeMarketing />} />
      <Route path="/wissen/generationenwechsel-familienunternehmen-marke" element={<WissenGenerationenwechselFamilienunternehmenMarke />} />
      <Route path="/wissen/betriebsuebergabe-kunden-informieren" element={<WissenBetriebsuebergabeKundenInformieren />} />
      <Route path="/wissen/mitarbeiter-nach-betriebsuebernahme" element={<WissenMitarbeiterNachBetriebsuebernahme />} />
      <Route path="/wissen/betriebsuebernahme-erste-100-tage" element={<WissenBetriebsuebernahmeErste100Tage />} />
      <Route path="/wissen/betriebsuebergabe-vorbereiten" element={<WissenBetriebsuebergabeVorbereiten />} />
      <Route path="/wissen/gesellschafter-uneinig-marketing" element={<WissenGesellschafterUneinigMarketing />} />
      <Route path="/wissen/mitarbeiterbefragung-iso-9001" element={<WissenMitarbeiterbefragungIso9001 />} />
      <Route path="/wissen/mitarbeiterbefragung-iso-45001" element={<WissenMitarbeiterbefragungIso45001 />} />
      <Route path="/wissen/mitarbeiter-halten-ohne-gehaltserhoehung" element={<WissenMitarbeiterHaltenOhneGehaltserhoehung />} />
      <Route path="/wissen/personalabbau-mitarbeiter-halten" element={<WissenPersonalabbauMitarbeiterHalten />} />
      <Route path="/wissen/vertrieb-ankurbeln" element={<WissenVertriebAnkurbeln />} />
      <Route path="/wissen/preiserhoehung-kunden-mitteilen" element={<WissenPreiserhoehungKundenMitteilen />} />
      <Route path="/wissen/ki-einfuehren-mitarbeiter" element={<WissenKiEinfuehrenMitarbeiter />} />
      <Route path="/wissen/*" element={<NichtGefunden />} />
      <Route path="/i/:linkToken" element={<Interview />} />
      {/* Öffentlich mit Passwort: Kunden-Cockpit des Auftraggebers */}
      <Route path="/k/:code" element={<KundenCockpit />} />
      {/* Außenblick-Modul, öffentlich mit Einladungscode: Eingang und Portal */}
      <Route path="/aussenblick" element={<PortalEingang />} />
      <Route path="/a/:code" element={<Portal />} />
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
          <Route path="/akquise" element={<Zielliste />} />
          <Route path="/akquise/:id" element={<Zielkarte />} />
        </Route>
      </Route>
      {/* Unbekannte Adressen: eigene Seite mit noindex statt Kopie der Startseite */}
      <Route path="*" element={<NichtGefunden />} />
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