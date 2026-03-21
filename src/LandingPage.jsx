import { useState, useEffect } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg: "#070d1a",
  surface: "#0d1526",
  panel: "#111e30",
  card: "#162238",
  elevated: "#1e2e45",
  border: "rgba(255,255,255,0.07)",
  gold: "#e6c364",
  goldDim: "#b09040",
  goldFaint: "rgba(230,195,100,0.07)",
  text: "#e8f0ff",
  muted: "rgba(232,240,255,0.55)",
  faint: "rgba(232,240,255,0.08)",
  success: "#34d399",
  warn: "#fbbf24",
  danger: "#f87171",
};

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icons = {
  runway: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  burn: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  margin: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
  insights: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  fund: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  scenario: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  play: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  menu: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  arrowRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  quote: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" opacity="0.2">
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
    </svg>
  ),
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Button({ children, onClick, variant = "primary", size = "md", fullWidth = false, icon }) {
  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "Manrope, sans-serif",
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    borderRadius: 8,
    transition: "all 0.2s ease",
    width: fullWidth ? "100%" : "auto",
    textDecoration: "none",
  };

  const sizeStyles = {
    sm: { padding: "10px 18px", fontSize: 13 },
    md: { padding: "14px 28px", fontSize: 15 },
    lg: { padding: "18px 36px", fontSize: 16 },
  };

  const variantStyles = {
    primary: {
      background: T.gold,
      color: "#1a1200",
    },
    secondary: {
      background: "transparent",
      color: T.text,
      border: `1px solid ${T.border}`,
    },
    ghost: {
      background: "transparent",
      color: T.muted,
    },
  };

  return (
    <button
      onClick={onClick}
      style={{ ...baseStyles, ...sizeStyles[size], ...variantStyles[variant] }}
      onMouseEnter={(e) => {
        if (variant === "primary") {
          e.currentTarget.style.background = T.goldDim;
          e.currentTarget.style.transform = "translateY(-2px)";
        } else if (variant === "secondary") {
          e.currentTarget.style.borderColor = T.gold;
          e.currentTarget.style.color = T.gold;
        }
      }}
      onMouseLeave={(e) => {
        if (variant === "primary") {
          e.currentTarget.style.background = T.gold;
          e.currentTarget.style.transform = "translateY(0)";
        } else if (variant === "secondary") {
          e.currentTarget.style.borderColor = T.border;
          e.currentTarget.style.color = T.text;
        }
      }}
    >
      {children}
      {icon && <span style={{ display: "flex" }}>{icon}</span>}
    </button>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Features", "Pricing", "About"];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "16px 24px",
        background: scrolled ? "rgba(7, 13, 26, 0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${T.border}` : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 900,
            fontSize: 22,
            color: T.gold,
            letterSpacing: "-0.02em",
          }}
        >
          SK Capital
        </div>

        {/* Desktop Nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
          }}
          className="desktop-nav"
        >
          <div style={{ display: "flex", gap: 32 }}>
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                style={{
                  color: T.muted,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  transition: "color 0.2s",
                  fontFamily: "Manrope, sans-serif",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = T.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
              >
                {link}
              </a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("signin");
              }}
              style={{
                color: T.muted,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "Manrope, sans-serif",
              }}
            >
              Sign In
            </a>
            <Button
              size="sm"
              onClick={() => onNavigate("signup")}
            >
              Get Started Free
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: T.text,
            cursor: "pointer",
            padding: 8,
          }}
          className="mobile-menu-btn"
        >
          {mobileMenuOpen ? Icons.close : Icons.menu}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: T.surface,
            borderBottom: `1px solid ${T.border}`,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              style={{
                color: T.text,
                textDecoration: "none",
                fontSize: 16,
                fontWeight: 500,
                fontFamily: "Manrope, sans-serif",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link}
            </a>
          ))}
          <Button fullWidth size="sm" onClick={() => onNavigate("signin")}>
            Sign In
          </Button>
          <Button fullWidth onClick={() => onNavigate("signup")}>
            Get Started Free
          </Button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
function HeroSection({ onNavigate }) {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "absolute",
          top: -300,
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(230,195,100,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", textAlign: "center", position: "relative" }}>
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: T.goldFaint,
            border: `1px solid rgba(230,195,100,0.2)`,
            borderRadius: 100,
            padding: "8px 16px",
            marginBottom: 32,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.gold }} />
          <span style={{ color: T.gold, fontSize: 13, fontWeight: 600, fontFamily: "Manrope, sans-serif" }}>
            CFO Intelligence Platform
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(36px, 6vw, 72px)",
            lineHeight: 1.1,
            color: T.text,
            marginBottom: 24,
            letterSpacing: "-0.02em",
          }}
        >
          Your Business Deserves
          <br />
          a CFO. <span style={{ color: T.gold }}>Now It Has One.</span>
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: T.muted,
            maxWidth: 680,
            margin: "0 auto 40px",
            lineHeight: 1.7,
            fontFamily: "Manrope, sans-serif",
          }}
        >
          SK Capital gives any business owner instant financial clarity — runway, burn rate, margins, and plain-English
          insights in minutes. No finance degree required.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button size="lg" onClick={() => onNavigate("signup")} icon={Icons.arrowRight}>
            Start for Free
          </Button>
          <Button variant="secondary" size="lg" icon={Icons.play}>
            Watch Demo
          </Button>
        </div>

        {/* Dashboard Preview */}
        <div
          style={{
            marginTop: 80,
            position: "relative",
          }}
        >
          <div
            style={{
              background: T.panel,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              padding: 24,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            {/* KPI Cards */}
            {[
              { label: "Runway", value: "18.5", unit: "months", color: T.success },
              { label: "Monthly Burn", value: "₹2.4L", unit: "", color: T.warn },
              { label: "Gross Margin", value: "68", unit: "%", color: T.success },
              { label: "Health Score", value: "87", unit: "/100", color: T.gold },
            ].map((kpi, i) => (
              <div
                key={i}
                style={{
                  background: T.card,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: "20px 24px",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: T.muted,
                    fontWeight: 500,
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  {kpi.label}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontWeight: 800,
                      fontSize: 32,
                      color: kpi.color,
                    }}
                  >
                    {kpi.value}
                  </span>
                  <span style={{ fontSize: 14, color: T.muted }}>{kpi.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Insight Card */}
          <div
            style={{
              position: "absolute",
              bottom: -30,
              right: -20,
              background: T.card,
              border: `1px solid rgba(52, 211, 153, 0.3)`,
              borderRadius: 12,
              padding: "14px 18px",
              maxWidth: 280,
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "rgba(52, 211, 153, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              ✅
            </span>
            <div>
              <div style={{ fontSize: 13, color: T.text, fontWeight: 600, marginBottom: 4, fontFamily: "Manrope, sans-serif" }}>
                Healthy Runway
              </div>
              <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
                At current burn, you have 18+ months of runway. You're in great shape.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PROBLEM SECTION ──────────────────────────────────────────────────────────
function ProblemSection() {
  const painPoints = [
    {
      icon: "👤",
      title: "No CFO on Staff",
      desc: "Hiring a CFO costs ₹30L+ per year. Most startups simply can't afford one.",
    },
    {
      icon: "📊",
      title: "Confusing Spreadsheets",
      desc: "You're drowning in data but starving for insights. Numbers without context.",
    },
    {
      icon: "⏳",
      title: "No Idea About Runway",
      desc: "You don't know how long your cash will last or when to start fundraising.",
    },
  ];

  return (
    <section
      style={{
        padding: "120px 24px",
        background: T.surface,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Stat */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div
            style={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(42px, 5vw, 64px)",
              color: T.danger,
              marginBottom: 16,
            }}
          >
            91%
          </div>
          <p
            style={{
              fontSize: "clamp(18px, 2.5vw, 24px)",
              color: T.text,
              fontFamily: "Manrope, sans-serif",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            of small businesses fail due to poor financial visibility.
          </p>
          <p
            style={{
              fontSize: 16,
              color: T.gold,
              fontWeight: 600,
              fontFamily: "Manrope, sans-serif",
            }}
          >
            SK Capital changes that.
          </p>
        </div>

        {/* Pain Points */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {painPoints.map((point, i) => (
            <div
              key={i}
              style={{
                background: T.panel,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: 32,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(230,195,100,0.3)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: T.goldFaint,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  marginBottom: 20,
                }}
              >
                {point.icon}
              </div>
              <h3
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: T.text,
                  marginBottom: 12,
                }}
              >
                {point.title}
              </h3>
              <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.7 }}>{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES SECTION ─────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      icon: Icons.runway,
      title: "Instant Runway Analysis",
      desc: "Know exactly how many months of cash you have left at current burn rate.",
    },
    {
      icon: Icons.burn,
      title: "Burn Rate Tracking",
      desc: "Track your monthly expenses and see where every rupee is going.",
    },
    {
      icon: Icons.margin,
      title: "Gross Margin Intelligence",
      desc: "Understand your true profitability after cost of goods sold.",
    },
    {
      icon: Icons.insights,
      title: "Plain-English Insights",
      desc: "No jargon. Just clear, actionable advice written for founders.",
    },
    {
      icon: Icons.fund,
      title: "Fund Management",
      desc: "Track LP commitments, deal pipeline, and portfolio performance.",
    },
    {
      icon: Icons.scenario,
      title: "Scenario Planning",
      desc: "Model different futures. See how decisions impact your runway.",
      badge: "Pro",
    },
  ];

  return (
    <section
      id="features"
      style={{
        padding: "120px 24px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.gold,
              textTransform: "uppercase",
              letterSpacing: 2,
              fontFamily: "Manrope, sans-serif",
            }}
          >
            Features
          </span>
          <h2
            style={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 42px)",
              color: T.text,
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            Everything You Need to Understand Your Finances
          </h2>
          <p style={{ fontSize: 17, color: T.muted, maxWidth: 600, margin: "0 auto" }}>
            Powerful tools that give you CFO-level insight without the CFO-level cost.
          </p>
        </div>

        {/* Feature Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {features.map((feature, i) => (
            <div
              key={i}
              style={{
                background: T.panel,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: 32,
                position: "relative",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(230,195,100,0.3)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {feature.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    background: T.gold,
                    color: "#1a1200",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 100,
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  {feature.badge}
                </span>
              )}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: T.goldFaint,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: T.gold,
                  marginBottom: 20,
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: T.text,
                  marginBottom: 10,
                }}
              >
                {feature.title}
              </h3>
              <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS SECTION ─────────────────────────────────────────────────────
function HowItWorksSection({ onNavigate }) {
  const steps = [
    {
      num: "01",
      title: "Sign Up Free",
      desc: "Create your account in 30 seconds. No credit card required.",
    },
    {
      num: "02",
      title: "Enter Your Numbers",
      desc: "Input your revenue, costs, and cash balance. Takes 2 minutes.",
    },
    {
      num: "03",
      title: "Get Instant CFO Insights",
      desc: "Receive actionable insights on runway, burn, and financial health.",
    },
  ];

  return (
    <section
      style={{
        padding: "120px 24px",
        background: T.surface,
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.gold,
              textTransform: "uppercase",
              letterSpacing: 2,
              fontFamily: "Manrope, sans-serif",
            }}
          >
            How It Works
          </span>
          <h2
            style={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 42px)",
              color: T.text,
              marginTop: 16,
            }}
          >
            CFO Intelligence in 3 Simple Steps
          </h2>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 32,
                padding: "40px 0",
                borderBottom: i < steps.length - 1 ? `1px solid ${T.border}` : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 900,
                  fontSize: 56,
                  color: T.goldFaint,
                  width: 80,
                  flexShrink: 0,
                  textAlign: "center",
                }}
              >
                {step.num}
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: 700,
                    fontSize: 22,
                    color: T.text,
                    marginBottom: 8,
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: T.goldFaint,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: T.gold,
                    flexShrink: 0,
                  }}
                >
                  {Icons.arrowRight}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Button size="lg" onClick={() => onNavigate("signup")} icon={Icons.arrowRight}>
            Get Started Now
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS SECTION ─────────────────────────────────────────────────────
function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "SK Capital saved my startup. I had no idea we only had 4 months of runway left until the dashboard showed me. We pivoted our spending immediately.",
      name: "Priya Sharma",
      role: "Founder, TechStartup.io",
      avatar: "PS",
    },
    {
      quote:
        "As a non-finance person, I finally understand my business numbers. The plain-English insights are a game-changer for any founder.",
      name: "Rahul Verma",
      role: "CEO, GrowthStack",
      avatar: "RV",
    },
    {
      quote:
        "We replaced our expensive part-time CFO with SK Capital. Same insights, fraction of the cost. Our board loves the reports.",
      name: "Ananya Patel",
      role: "Co-founder, FinEdge",
      avatar: "AP",
    },
  ];

  return (
    <section
      style={{
        padding: "120px 24px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.gold,
              textTransform: "uppercase",
              letterSpacing: 2,
              fontFamily: "Manrope, sans-serif",
            }}
          >
            Testimonials
          </span>
          <h2
            style={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 42px)",
              color: T.text,
              marginTop: 16,
            }}
          >
            Trusted by Founders Like You
          </h2>
        </div>

        {/* Testimonial Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                background: T.panel,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: 32,
                position: "relative",
              }}
            >
              <div style={{ color: T.gold, marginBottom: 20 }}>{Icons.quote}</div>
              <p
                style={{
                  fontSize: 15,
                  color: T.text,
                  lineHeight: 1.8,
                  marginBottom: 24,
                  fontStyle: "italic",
                }}
              >
                "{t.quote}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: T.gold,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#1a1200",
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                      color: T.text,
                    }}
                  >
                    {t.name}
                  </div>
                  <div style={{ fontSize: 13, color: T.muted }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PRICING SECTION ──────────────────────────────────────────────────────────
function PricingSection({ onNavigate }) {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      desc: "Perfect for getting started",
      features: ["Core financial analysis", "3 insights per month", "Runway calculator", "Basic dashboard"],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "₹4,999",
      period: "/month",
      desc: "For serious founders",
      features: [
        "Everything in Free",
        "Unlimited insights",
        "Scenario planning",
        "PDF reports",
        "Priority support",
        "Historical tracking",
      ],
      cta: "Start Pro Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "₹14,999",
      period: "/month",
      desc: "For fund managers",
      features: [
        "Everything in Pro",
        "Fund management",
        "LP tracking",
        "Deal pipeline",
        "Multi-user access",
        "Dedicated support",
        "Custom integrations",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section
      id="pricing"
      style={{
        padding: "120px 24px",
        background: T.surface,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.gold,
              textTransform: "uppercase",
              letterSpacing: 2,
              fontFamily: "Manrope, sans-serif",
            }}
          >
            Pricing
          </span>
          <h2
            style={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 42px)",
              color: T.text,
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            Simple, Transparent Pricing
          </h2>
          <p style={{ fontSize: 17, color: T.muted }}>Start free. Upgrade when you need more.</p>
        </div>

        {/* Pricing Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          {plans.map((plan, i) => (
            <div
              key={i}
              style={{
                background: plan.popular ? T.card : T.panel,
                border: `1px solid ${plan.popular ? T.gold : T.border}`,
                borderRadius: 20,
                padding: 36,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                transform: plan.popular ? "scale(1.02)" : "none",
              }}
            >
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: T.gold,
                    color: "#1a1200",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "6px 16px",
                    borderRadius: 100,
                    fontFamily: "Manrope, sans-serif",
                  }}
                >
                  Most Popular
                </div>
              )}
              <div style={{ marginBottom: 24 }}>
                <h3
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    color: T.text,
                    marginBottom: 8,
                  }}
                >
                  {plan.name}
                </h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                  <span
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontWeight: 800,
                      fontSize: 40,
                      color: T.text,
                    }}
                  >
                    {plan.price}
                  </span>
                  <span style={{ fontSize: 15, color: T.muted }}>{plan.period}</span>
                </div>
                <p style={{ fontSize: 14, color: T.muted }}>{plan.desc}</p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
                {plan.features.map((feature, j) => (
                  <li
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 0",
                      borderBottom: j < plan.features.length - 1 ? `1px solid ${T.border}` : "none",
                    }}
                  >
                    <span style={{ color: T.success, flexShrink: 0 }}>{Icons.check}</span>
                    <span style={{ fontSize: 14, color: T.text }}>{feature}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 28 }}>
                <Button
                  fullWidth
                  variant={plan.popular ? "primary" : "secondary"}
                  onClick={() => onNavigate("signup")}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT SECTION ────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section
      id="about"
      style={{
        padding: "120px 24px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: T.gold,
            textTransform: "uppercase",
            letterSpacing: 2,
            fontFamily: "Manrope, sans-serif",
          }}
        >
          About Us
        </span>
        <h2
          style={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 42px)",
            color: T.text,
            marginTop: 16,
            marginBottom: 24,
          }}
        >
          Built for Founders, by Founders
        </h2>
        <p
          style={{
            fontSize: 18,
            color: T.muted,
            lineHeight: 1.8,
            marginBottom: 20,
          }}
        >
          SK Capital was built for the founder who is too busy running a business to understand it. We believe every
          business deserves CFO-level intelligence — not just the ones who can afford one.
        </p>
        <p
          style={{
            fontSize: 18,
            color: T.muted,
            lineHeight: 1.8,
          }}
        >
          Our mission is simple: democratize financial clarity. Whether you're a solo founder bootstrapping your first
          startup or a fund manager overseeing millions, you deserve to understand your numbers.
        </p>
      </div>
    </section>
  );
}

// ─── CTA BANNER ───────────────────────────────────────────────────────────────
function CTABanner({ onNavigate }) {
  return (
    <section
      style={{
        padding: "80px 24px",
        background: T.gold,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 80px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <h2
          style={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 42px)",
            color: "#1a1200",
            marginBottom: 16,
          }}
        >
          Ready to Understand Your Business Like a CFO?
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "rgba(26, 18, 0, 0.7)",
            marginBottom: 32,
          }}
        >
          Join thousands of founders who've taken control of their finances.
        </p>
        <Button
          onClick={() => onNavigate("signup")}
          style={{
            background: "#1a1200",
            color: T.gold,
          }}
          size="lg"
        >
          Get Started Free — No Credit Card Required
        </Button>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Demo"],
    Company: ["About", "Blog", "Careers"],
    Legal: ["Privacy", "Terms", "Security"],
  };

  return (
    <footer
      style={{
        padding: "80px 24px 40px",
        background: T.bg,
        borderTop: `1px solid ${T.border}`,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 48,
            marginBottom: 64,
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: "Manrope, sans-serif",
                fontWeight: 900,
                fontSize: 24,
                color: T.gold,
                marginBottom: 12,
              }}
            >
              SK Capital
            </div>
            <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7 }}>CFO Intelligence for Every Business</p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <div
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: T.text,
                  marginBottom: 16,
                }}
              >
                {category}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {items.map((item) => (
                  <li key={item} style={{ marginBottom: 10 }}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      style={{
                        color: T.muted,
                        textDecoration: "none",
                        fontSize: 14,
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = T.gold)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: `1px solid ${T.border}`,
            paddingTop: 24,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <p style={{ fontSize: 13, color: T.muted }}>© 2026 SK Capital. All rights reserved.</p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  color: T.muted,
                  textDecoration: "none",
                  fontSize: 13,
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN LANDING PAGE COMPONENT ──────────────────────────────────────────────
export default function LandingPage({ onNavigate }) {
  return (
    <div
      style={{
        background: T.bg,
        color: T.text,
        fontFamily: "Manrope, sans-serif",
        minHeight: "100vh",
      }}
    >
      <Navbar onNavigate={onNavigate} />
      <HeroSection onNavigate={onNavigate} />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection onNavigate={onNavigate} />
      <TestimonialsSection />
      <PricingSection onNavigate={onNavigate} />
      <AboutSection />
      <CTABanner onNavigate={onNavigate} />
      <Footer />
    </div>
  );
}
