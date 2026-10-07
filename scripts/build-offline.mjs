import fs from "node:fs";
import path from "node:path";
import { build } from "vite";

// Creates a portable review file only. The normal build keeps BrowserRouter.
await build({
  define: { "import.meta.env.VITE_OFFLINE_REVIEW": JSON.stringify("true") },
  build: {
    outDir: "offline-build",
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: { output: { inlineDynamicImports: true, format: "iife" } },
  },
});
const directory = "offline-build";
let html = fs.readFileSync(path.join(directory, "index.html"), "utf8");
html = html.replace(
  /<script\s+type="module"\s+crossorigin\s+src="([^"]+)"\s*><\/script>/g,
  (_, src) => {
    const script = fs.readFileSync(
      path.join(directory, src.replace(/^\//, "")),
      "utf8",
    );
    return `<script>${script.replaceAll("</script", "<\\/script")}</script>`;
  },
);
html = html.replace(
  /<link\s+rel="stylesheet"\s+crossorigin\s+href="([^"]+)"\s*>/g,
  (_, href) => {
    const css = fs
      .readFileSync(path.join(directory, href.replace(/^\//, "")), "utf8")
      .replace(/@import[^;]*fonts\.googleapis[^;]*;/g, "");
    return `<style>${css}</style>`;
  },
);
html = html.replace(/<link rel="preconnect"[^>]*>/g, "");
// Run the inline app after #root exists, exactly as a deferred module would.
const scripts = html.match(/<script>[\s\S]*?<\/script>/g) || [];
for (const script of scripts) html = html.replace(script, "");
html = html.replace("</body>", `${scripts.join("\n")}\n</body>`);
if (/src="\/assets\/|href="\/assets\//.test(html))
  throw new Error("Offline artifact still references an external build asset.");
fs.mkdirSync("review-artifacts", { recursive: true });
fs.writeFileSync("review-artifacts/sk-capital-review.html", html);
console.log(
  "Created review-artifacts/sk-capital-review.html with preview-only hash routing and no external font request.",
);
