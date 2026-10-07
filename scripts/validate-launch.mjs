import fs from "node:fs";
const config = JSON.parse(fs.readFileSync("launch-config.json", "utf8"));
if (
  config.launchEnabled &&
  (!config.contactVerified ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.contactEmail))
) {
  throw new Error(
    "Public launch is blocked: an approved business email must be verified and configured first.",
  );
}
console.log(
  config.launchEnabled
    ? "Launch configuration passed. Platform authorization and browser QA must also be verified before deployment."
    : "Launch remains disabled. Building a noindex local candidate with no active contact route.",
);
