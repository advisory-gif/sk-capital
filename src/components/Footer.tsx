import { Link } from 'react-router-dom';
import { Mail, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-white/5 py-12 lg:py-16">
      <div className="w-full px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl text-gold font-semibold">
              SK Capital
            </span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-cool">
            <a
              href="mailto:advisory@skcapital.co.in"
              className="flex items-center gap-2 hover:text-gold transition-colors"
            >
              <Mail size={14} />
              Email
            </a>
            <a
              href="https://linkedin.com/company/sk-capital"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gold transition-colors"
            >
              <Linkedin size={14} />
              LinkedIn
            </a>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline">
              SK Capital - Finance reporting and forecasting systems for startups
            </span>
            <Link
              to="/how-we-use-ai"
              className="text-gold hover:text-gold/80 transition-colors"
            >
              How we use AI
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-xs text-cool/60">
            &copy; {new Date().getFullYear()} SK Capital
          </div>
        </div>
      </div>
    </footer>
  );
}
