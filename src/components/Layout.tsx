import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import LeadMagnet from './LeadMagnet';
import pageMetadata from '@/page-metadata.json';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [leadMagnetOpen, setLeadMagnetOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView();
    } else { window.scrollTo(0, 0); }
    const pages: Record<string,string[]> = pageMetadata;
    const [heading,description] = pages[location.pathname] || ['Page not found','Find your next step with SK Capital.'];
    document.title = heading+' | SK Capital';
    const canonical = 'https://www.skcapital.co.in'+location.pathname;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href',canonical);
    for(const key of ['description','og:description','twitter:description'])document.querySelector(`meta[name="${key}"],meta[property="${key}"]`)?.setAttribute('content',description);
    for(const key of ['title','og:title','twitter:title'])document.querySelector(`meta[name="${key}"],meta[property="${key}"]`)?.setAttribute('content',document.title);
    for(const key of ['og:url','twitter:url'])document.querySelector(`meta[property="${key}"]`)?.setAttribute('content',canonical);
  }, [location]);

  // Expose lead magnet toggle globally
  useEffect(() => {
    const handleToggle = () => setLeadMagnetOpen(true);
    window.addEventListener('open-lead-magnet' as any, handleToggle);
    return () => window.removeEventListener('open-lead-magnet' as any, handleToggle);
  }, []);

  return (
    <div className="min-h-screen bg-navy text-warm relative">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Vignette overlay */}
      <div className="vignette-overlay" />

      <Navbar />
      <main id="main-content" tabIndex={-1} className="relative z-10">{children}</main>
      <Footer />
      <LeadMagnet isOpen={leadMagnetOpen} onClose={() => setLeadMagnetOpen(false)} />
    </div>
  );
}

// Helper to open lead magnet from anywhere
export function openLeadMagnet() {
  window.dispatchEvent(new CustomEvent('open-lead-magnet'));
}
