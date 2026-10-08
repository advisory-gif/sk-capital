import { useEffect } from 'react';
import { BrowserRouter, HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Samples from '@/pages/Samples';
import { findSample } from '@/lib/samples';

const standalone = import.meta.env.MODE === 'standalone';
const Router = standalone ? HashRouter : BrowserRouter;

// Preserve links shared by the previous hash-routed production site.
if (!standalone && /^#\/(pricing|portfolio|blog|how-we-use-ai)?(?:$|[?#])/.test(window.location.hash)) {
  const route = window.location.hash.slice(1);
  window.history.replaceState(null, '', route);
}
function NavigationEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const isSample = pathname.startsWith('/samples');
    const sample = findSample(pathname.split('/')[2]);
    const title = sample ? `${sample.name} example | SK Capital` : isSample ? 'Service examples | SK Capital' : 'Business Performance Advisory | SK Capital';
    const description = isSample ? 'Explore simple visual examples of SK Capital services, using fictional US-dollar figures. One question, a clear chart and a practical next step.' : 'Understand what is holding your business back. Practical analysis of profit, cash, growth and marketing performance, with useful planning, reporting and focused AI workflows.';
    document.title = title;
    for (const [selector, content] of [['meta[name="description"]', description], ['meta[property="og:title"]', title], ['meta[property="og:description"]', description], ['meta[property="og:url"]', `https://www.skcapital.co.in${pathname}`]]) {
      document.querySelector(selector)?.setAttribute('content', content);
    }
    if (hash) {
      const target = document.getElementById(hash === '#reviews' ? 'services' : hash.slice(1));
      target?.scrollIntoView();
      if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
    }
    else window.scrollTo(0, 0);
    // Make client-side page changes understandable to keyboard and screen-reader users.
    if (isSample && !hash) document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true });
  }, [pathname, hash]);
  return null;
}
export default function App() {
  return <Router><NavigationEffects /><a href="#main-content" className="skip-link" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Skip to content</a><Navbar /><main id="main-content" tabIndex={-1}><Routes>
    <Route path="/" element={<Home />} /><Route path="/pricing" element={<Navigate to="/#services" replace />} />
    <Route path="/samples" element={<Samples />} /><Route path="/samples/:sampleId" element={<Samples />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></main><Footer /></Router>;
}
