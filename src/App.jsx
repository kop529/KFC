import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageNotFound from '@/lib/PageNotFound';

// Eagerly loaded pages for instant transitions
import Home from '@/pages/Home';
import PoliciesPage from '@/pages/PoliciesPage';
import LeadershipPage from '@/pages/LeadershipPage';

import SchoolMapPage from '@/pages/SchoolMapPage';

function AnimatedRoutes({ lang, setLang }) {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home lang={lang} setLang={setLang} />} />
        <Route path="/policies" element={<PoliciesPage lang={lang} setLang={setLang} />} />
        <Route path="/policies/:id" element={<PoliciesPage lang={lang} setLang={setLang} />} />
        <Route path="/leadership" element={<LeadershipPage lang={lang} setLang={setLang} />} />
        <Route path="/map" element={<SchoolMapPage lang={lang} setLang={setLang} />} />
        <Route path="*" element={<PageNotFound lang={lang} />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('app_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
  }, [lang]);

  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <div className="film-grain min-h-screen bg-[#0B0F17]">
          <AnimatedRoutes lang={lang} setLang={setLang} />
        </div>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App