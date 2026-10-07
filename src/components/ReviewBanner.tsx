import { Link } from "react-router-dom";
import { siteIsLive } from "@/lib/launch";

/** Keep visible until the founder has approved and activated the enquiry flow. */
export default function ReviewBanner() {
  if (siteIsLive) return null;
  return (
    <div className="review-banner" role="note">
      <span className="review-status">
        <span aria-hidden="true" /> Launch preview
      </span>
      <span>Enquiries, booking and payment are not active.</span>
      <Link to="/business-health-review#enquiry">
        View launch details <span aria-hidden="true">↗</span>
      </Link>
    </div>
  );
}
