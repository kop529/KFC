import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from '@/lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/ui/UserNotRegisteredError';
// Add page imports here
import Home from '@/pages/Home';
import PoliciesPage from '@/pages/PoliciesPage';
import LeadershipPage from '@/pages/LeadershipPage';

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
        <Routes>
          <Route path="/" element={<Home lang={lang} setLang={setLang} />} />
          <Route path="/policies" element={<PoliciesPage lang={lang} setLang={setLang} />} />
          <Route path="/policies/:id" element={<PoliciesPage lang={lang} setLang={setLang} />} />
          <Route path="/leadership" element={<LeadershipPage lang={lang} setLang={setLang} />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App