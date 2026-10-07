import { Link } from "react-router-dom";
import { siteIsLive } from "@/lib/launch";
import { openLeadMagnet } from "@/lib/lead-magnet";

export default function Footer() {
  return (
    <footer className="health-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link className="wordmark" to="/">
              SK Capital<span>Business advisory</span>
            </Link>
            <p>
              A clearer view of your business.
              <br />A practical next step.
            </p>
            <p>
              Founder-led advice across sales, delivery, profit, cash and
              capacity.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <Link to="/businesses">Business performance</Link>
            <Link to="/business-health-review">Revenue Leak Check</Link>
            <Link to="/startups">For startups</Link>
            <Link to="/business-health-review#business-pulse">
              Business Pulse
            </Link>
            <Link to="/#team">Our people</Link>
            <Link to="/portfolio">Illustrative sample work</Link>
            <Link to="/how-we-use-ai">Applied AI</Link>
            <Link to="/blog">Perspectives</Link>
            <button onClick={openLeadMagnet}>Runway calculator</button>
            <Link to="/business-health-review#enquiry">
              {siteIsLive ? "Discuss your business" : "Enquiry launch details"}
            </Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} SK Capital</span>
          <span>
            {siteIsLive
              ? "Founder-led business advisory · India"
              : "Launch preview · Enquiries and payments are not active."}
          </span>
        </div>
      </div>
    </footer>
  );
}
