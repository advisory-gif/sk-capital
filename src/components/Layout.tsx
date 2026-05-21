import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import LeadMagnet from './LeadMagnet';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [leadMagnetOpen, setLeadMagnetOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
      <main className="relative z-10">{children}</main>
      <Footer />
      <LeadMagnet isOpen={leadMagnetOpen} onClose={() => setLeadMagnetOpen(false)} />
    </div>
  );
}

// Helper to open lead magnet from anywhere
export function openLeadMagnet() {
  window.dispatchEvent(new CustomEvent('open-lead-magnet'));
}
