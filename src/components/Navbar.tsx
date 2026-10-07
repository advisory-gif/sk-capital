import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import "@/health.css";
import "@/review.css";

const links = [
  ["Business performance", "/businesses"],
  ["For startups", "/startups"],
  ["Revenue Leak Check", "/business-health-review"],
  ["How we work", "/#process"],
  ["Our people", "/#team"],
  ["Sample work", "/portfolio"],
  ["Applied AI", "/how-we-use-ai"],
  ["Perspectives", "/blog"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-nav">
      <Link
        className="skip-link"
        to={location.pathname + location.search + "#main-content"}
      >
        Skip to content
      </Link>
      <div className="nav-inner">
        <Link className="wordmark" to="/" aria-label="SK Capital home">
          SK Capital<span>Business advisory</span>
        </Link>
        <nav className="nav-shortcuts" aria-label="Quick navigation">
          <Link to="/businesses">What we do</Link>
          <Link to="/#team">Our people</Link>
          <Link to="/portfolio">Sample work</Link>
          <Link className="nav-cta" to="/business-health-review">
            Explore the pilot <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </nav>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="site-links"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav
          id="site-links"
          className="nav-links"
          hidden={!open}
          aria-label="Main navigation"
        >
          {links.map(([label, url]) => (
            <Link
              key={url}
              to={url}
              aria-current={location.pathname === url ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
