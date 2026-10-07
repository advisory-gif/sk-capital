import config from "../../launch-config.json";

// Enable only after the business contact route has been approved and verified.
// This is public configuration, never a place for credentials or personal email.
export const enquiryEmail = config.contactEmail;
export const siteIsLive =
  config.launchEnabled &&
  config.contactVerified &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiryEmail);

export function enquiryEmailHref(
  service: string,
  business: string,
  priority: string,
) {
  const subject = `SK Capital enquiry: ${service}`;
  const body = [
    `I would like to explore ${service}.`,
    business ? `Business: ${business}` : "",
    priority ? `Question: ${priority}` : "",
    "",
    "Please confirm fit, scope, the final payable amount and an agreed delivery date before any engagement.",
  ]
    .filter((line, index, all) => line || index === all.length - 2)
    .join("\n");
  return `mailto:${enquiryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
