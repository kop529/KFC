import { useState, useEffect, Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageNotFound from '@/lib/PageNotFound';

// Eagerly loaded pages (small, always needed)
import Home from '@/pages/Home';
import PoliciesPage from '@/pages/PoliciesPage';
import PoliciesDiCategory from '@/pages/PoliciesDiCategory';
import LeadershipPage from '@/pages/LeadershipPage';

// P-01 Fix: Lazy-load heavy pages to avoid parsing 510KB+ of data on first load
const PolicyDetailPage = lazy(() => import('@/pages/PolicyDetailPage'));
const SchoolMapPage = lazy(() => import('@/pages/SchoolMapPage'));
const TeamMembersPage = lazy(() => import('@/pages/TeamMembersPage'));

// Minimal dark fallback — matches app background, no layout shift
const PageFallback = () => <div className="min-h-screen bg-[#0B0F17]" />;

function AnimatedRoutes({ lang, setLang }) {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home lang={lang} setLang={setLang} />} />
          <Route path="/policies" element={<PoliciesPage lang={lang} setLang={setLang} />} />
          <Route path="/dimension/:dimensionId" element={<PoliciesDiCategory lang={lang} setLang={setLang} />} />
          <Route path="/policies/:subcategoryId" element={<PoliciesPage lang={lang} setLang={setLang} />} />
          <Route path="/policy/detail/:policyId" element={<PolicyDetailPage lang={lang} setLang={setLang} />} />
          <Route path="/leadership" element={<LeadershipPage lang={lang} setLang={setLang} />} />
          <Route path="/map" element={<SchoolMapPage lang={lang} setLang={setLang} />} />
          <Route path="/team/:teamId" element={<TeamMembersPage lang={lang} />} />
          <Route path="*" element={<PageNotFound lang={lang} />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  // U-01 Fix: Read the pre-resolved lang from the blocking script in index.html
  // This eliminates any flash of untranslated content (FOUC) on first paint.
  const [lang, setLang] = useState(() => {
    const preResolved = document.documentElement.getAttribute('data-lang');
    if (preResolved === 'th' || preResolved === 'en') return preResolved;
    // Fallback if attribute is missing (SSR-like environments)
    try {
      const savedLang = localStorage.getItem('app_lang');
      if (savedLang) return savedLang;
    } catch (e) {}
    const systemLang = typeof navigator !== 'undefined' ? (navigator.language || navigator.userLanguage || '') : '';
    return systemLang.toLowerCase().startsWith('th') ? 'th' : 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem('app_lang', lang);
    } catch (e) {
      console.warn('LocalStorage not available');
    }
  }, [lang]);

  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <div className="min-h-screen bg-[#0B0F17]">
          <AnimatedRoutes lang={lang} setLang={setLang} />
        </div>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App