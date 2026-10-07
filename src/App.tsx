import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';

// Preserve links shared by the previous hash-routed production site.
if (/^#\/(pricing|portfolio|blog|how-we-use-ai)?(?:$|[?#])/.test(window.location.hash)) {
  const route = window.location.hash.slice(1);
  window.history.replaceState(null, '', route);
}
function NavigationEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    document.title = pathname === '/pricing' ? 'Project pricing | SK Capital Advisory' : 'Business health, cash flow & margins | SK Capital Advisory';
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
export default function App() {
  return <BrowserRouter><NavigationEffects /><a href="#main-content" className="skip-link">Skip to content</a><Navbar /><main id="main-content"><Routes>
    <Route path="/" element={<Home />} /><Route path="/pricing" element={<Navigate to="/#reviews" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></main><Footer /></BrowserRouter>;
}
