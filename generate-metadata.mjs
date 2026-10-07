import fs from "node:fs";

// Index only an explicitly enabled launch on the production deployment.
// A preview, offline artifact or unfinished contact route stays noindex.
const config = JSON.parse(fs.readFileSync("launch-config.json", "utf8"));
const canIndex =
  config.launchEnabled &&
  config.contactVerified &&
  process.env.VERCEL_ENV === "production";
const pages = JSON.parse(fs.readFileSync("src/page-metadata.json", "utf8"));
const source = fs.readFileSync("dist/index.html", "utf8");
const escapeAttribute = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");

for (const [route, [heading, description]] of Object.entries(pages)) {
  const title = `${heading} | SK Capital`;
  const url = `https://www.skcapital.co.in${route}`;
  let html = source.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeAttribute(title)}</title>`,
  );
  html = html.replace(
    /<meta\s+(?:name|property)="(title|description|og:title|og:description|twitter:title|twitter:description|og:url|twitter:url)"\s+content="[^"]*"\s*\/>/g,
    (tag, key) =>
      tag.replace(
        /content="[^"]*"/,
        `content="${escapeAttribute(key.endsWith("url") ? url : key.endsWith("description") ? description : title)}"`,
      ),
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${url}" />`,
  );
  html = html.replace(
    /<meta name="robots" content="[^"]*"\s*\/>/,
    `<meta name="robots" content="${canIndex ? "index, follow" : "noindex, nofollow"}" />`,
  );
  const directory = route === "/" ? "dist" : `dist${route}`;
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(`${directory}/index.html`, html);
}
if (canIndex) {
  fs.writeFileSync(
    "dist/robots.txt",
    "User-agent: *\nAllow: /\nSitemap: https://www.skcapital.co.in/sitemap.xml\n",
  );
  fs.writeFileSync(
    "dist/sitemap.xml",
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      Object.keys(pages)
        .map(
          (route) =>
            "<url><loc>https://www.skcapital.co.in" + route + "</loc></url>",
        )
        .join("") +
      "</urlset>",
  );
} else {
  fs.writeFileSync("dist/robots.txt", "User-agent: *\nDisallow: /\n");
  if (fs.existsSync("dist/sitemap.xml")) fs.unlinkSync("dist/sitemap.xml");
}
