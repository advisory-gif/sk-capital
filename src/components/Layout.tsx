import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LeadMagnet from "./LeadMagnet";
import ReviewBanner from "./ReviewBanner";
import pageMetadata from "@/page-metadata.json";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [leadMagnetOpen, setLeadMagnetOpen] = useState(false);
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    const changedPage = previousPath.current !== location.pathname;
    previousPath.current = location.pathname;
    const frame = requestAnimationFrame(() => {
      if (changedPage)
        document.getElementById("main-content")?.focus({ preventScroll: true });
      if (location.hash)
        document.getElementById(location.hash.slice(1))?.scrollIntoView();
      else window.scrollTo(0, 0);
    });
    const pages: Record<string, string[]> = pageMetadata;
    const [heading, description] = pages[location.pathname] || [
      "Page not found",
      "Find your next step with SK Capital.",
    ];
    document.title = `${heading} | SK Capital`;
    const canonical = `https://www.skcapital.co.in${location.pathname}`;
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", canonical);
    for (const key of ["description", "og:description", "twitter:description"])
      document
        .querySelector(`meta[name="${key}"],meta[property="${key}"]`)
        ?.setAttribute("content", description);
    for (const key of ["title", "og:title", "twitter:title"])
      document
        .querySelector(`meta[name="${key}"],meta[property="${key}"]`)
        ?.setAttribute("content", document.title);
    for (const key of ["og:url", "twitter:url"])
      document
        .querySelector(`meta[property="${key}"]`)
        ?.setAttribute("content", canonical);
    return () => cancelAnimationFrame(frame);
  }, [location]);

  useEffect(() => {
    const handleToggle = () => setLeadMagnetOpen(true);
    window.addEventListener("open-lead-magnet", handleToggle);
    return () => window.removeEventListener("open-lead-magnet", handleToggle);
  }, []);

  return (
    <div className="site-shell">
      <ReviewBanner />
      <Navbar key={location.pathname + location.search + location.hash} />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <LeadMagnet
        isOpen={leadMagnetOpen}
        onClose={() => setLeadMagnetOpen(false)}
      />
    </div>
  );
}
