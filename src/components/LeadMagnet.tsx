import { useState } from 'react';
import { X, Download, Mail, ArrowRight } from 'lucide-react';

interface LeadMagnetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadMagnet({ isOpen, onClose }: LeadMagnetProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
        onClose();
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-navy-light border border-white/10 rounded-xl p-6 lg:p-8 w-full max-w-md shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cool hover:text-warm transition-colors"
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <Download className="text-gold" size={20} />
              </div>
              <div>
                <h3 className="font-display text-xl text-warm">
                  Startup Runway Calculator
                </h3>
                <p className="text-xs text-cool font-ui uppercase tracking-wider">
                  Free Download
                </p>
              </div>
            </div>

            <p className="text-cool text-sm mb-6 leading-relaxed">
              A simple spreadsheet that helps you calculate your exact cash
              runway, identify your burn rate, and plan for your next fundraise.
              Used by 200+ founders.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cool"
                  size={16}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-navy border border-white/10 rounded-lg text-warm placeholder:text-cool/50 text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gold text-navy font-medium rounded-lg hover:bg-gold/90 transition-colors flex items-center justify-center gap-2"
              >
                Get the calculator
                <ArrowRight size={16} />
              </button>
            </form>

            <p className="text-xs text-cool/50 mt-4 text-center">
              No spam. Unsubscribe anytime.
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
              <Download className="text-gold" size={28} />
            </div>
            <h3 className="font-display text-xl text-warm mb-2">
              Check your inbox!
            </h3>
            <p className="text-cool text-sm">
              The Runway Calculator is on its way to {email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
