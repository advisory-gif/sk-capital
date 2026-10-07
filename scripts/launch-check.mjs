import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { build } from "vite";
import { JSDOM, VirtualConsole } from "jsdom";

const originalConfig = fs.readFileSync("launch-config.json", "utf8");
const directory = fs.mkdtempSync(
  path.join(os.tmpdir(), "skcapital-launch-check-"),
);
const fixturePath = path.join(directory, "launch-config.json");
const validator = path.resolve("scripts/validate-launch.mjs");
const results = [];
try {
  for (const config of [
    {
      launchEnabled: true,
      contactVerified: false,
      contactEmail: "enquiries@example.test",
    },
    { launchEnabled: true, contactVerified: true, contactEmail: "" },
  ]) {
    fs.writeFileSync(fixturePath, JSON.stringify(config));
    const run = spawnSync(process.execPath, [validator], {
      cwd: directory,
      encoding: "utf8",
    });
    assert.equal(run.status, 1);
    assert.match(run.stderr, /Public launch is blocked/);
  }
  results.push(
    "Public build rejects enabled launch with unverified or missing contact",
  );

  // A reserved, synthetic address is injected into an isolated build only.
  // The actual launch configuration remains disabled and is never rewritten.
  fs.writeFileSync(
    fixturePath,
    JSON.stringify({
      launchEnabled: true,
      contactVerified: true,
      contactEmail: "enquiries@example.test",
    }),
  );
  const bundle = await build({
    logLevel: "error",
    resolve: { alias: { "../../launch-config.json": fixturePath } },
    define: { "import.meta.env.VITE_OFFLINE_REVIEW": JSON.stringify("true") },
    build: {
      write: false,
      cssCodeSplit: false,
      modulePreload: false,
      rollupOptions: { output: { inlineDynamicImports: true, format: "iife" } },
    },
  });
  const code = bundle.output.find((item) => item.type === "chunk").code;
  const errors = [];
  const network = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", (error) => errors.push(error.message));
  virtualConsole.on("error", (...args) =>
    errors.push(args.map(String).join(" ")),
  );
  const dom = new JSDOM(
    `<!doctype html><html><head><title>Launch fixture</title></head><body><div id="root"></div><script>${code.replaceAll("</script", "<\\/script")}</script></body></html>`,
    {
      url: "https://review.example.test/#/business-health-review#enquiry",
      runScripts: "dangerously",
      pretendToBeVisual: true,
      virtualConsole,
      beforeParse(window) {
        window.scrollTo = () => {};
        window.HTMLElement.prototype.scrollIntoView = () => {};
        window.HTMLDialogElement.prototype.showModal = function () {
          this.open = true;
        };
        window.HTMLDialogElement.prototype.close = function () {
          this.open = false;
        };
        window.fetch = (...args) => {
          network.push(args);
          throw new Error("Network forbidden");
        };
        window.XMLHttpRequest.prototype.open = function (...args) {
          network.push(args);
          throw new Error("Network forbidden");
        };
      },
    },
  );
  const { window } = dom;
  const { document } = window;
  async function waitFor(predicate) {
    const deadline = Date.now() + 5000;
    while (!predicate()) {
      if (Date.now() > deadline)
        throw new Error(`Fixture timeout: ${errors.join("; ")}`);
      await delay(10);
    }
  }
  await waitFor(() => document.querySelector("#enquiry"));
  assert.equal(document.querySelector(".review-banner"), null);
  assert.match(
    document.querySelector(".activation-note").textContent,
    /A conversation before a data request/,
  );
  const emailLink = document.querySelector(".enquiry-card form a.primary");
  assert.ok(emailLink);
  assert.match(emailLink.textContent, /Open email draft/);
  assert.ok(emailLink.href.startsWith("mailto:enquiries@example.test?"));
  assert.equal(
    document.querySelector('.enquiry-card button[type="submit"]'),
    null,
  );
  results.push(
    "Live fixture hides preview banner and exposes an honestly labelled email-draft CTA",
  );
  function fill(selector, value) {
    const element = document.querySelector(selector);
    const prototype =
      element.tagName === "TEXTAREA"
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, "value").set.call(
      element,
      value,
    );
    element.dispatchEvent(new window.Event("input", { bubbles: true }));
  }
  fill("#business-type", "Fictional agency");
  fill("#priority", "Check scope & payment");
  await waitFor(() =>
    document
      .querySelector(".enquiry-card form a.primary")
      .href.includes("Fictional%20agency"),
  );
  const href = new URL(
    document.querySelector(".enquiry-card form a.primary").href,
  );
  assert.equal(
    href.searchParams.get("subject"),
    "SK Capital enquiry: Revenue Leak Check",
  );
  assert.match(href.searchParams.get("body"), /Check scope & payment/);
  assert.match(
    document.querySelector(".form-note").textContent,
    /does not send it/,
  );
  assert.equal(document.querySelector(".local-preview"), null);
  assert.equal(network.length, 0);
  assert.deepEqual(errors, []);
  results.push(
    "Email draft encodes selected inputs without submission, fake success or network attempts",
  );
  window.close();

  assert.equal(fs.readFileSync("launch-config.json", "utf8"), originalConfig);
  assert.equal(JSON.parse(originalConfig).launchEnabled, false);
  results.push(
    "Real launch stays disabled and approved preview source is untouched",
  );
  fs.mkdirSync("review-artifacts", { recursive: true });
  fs.writeFileSync(
    "review-artifacts/launch-check-results.json",
    JSON.stringify(
      {
        passed: results.length,
        checks: results,
        note: "Isolated DOM fixture only. No email was sent. The actual contact route remains unverified and disabled; rendered browser QA remains outstanding.",
      },
      null,
      2,
    ),
  );
  console.log(results.map((result) => `PASS ${result}`).join("\n"));
} finally {
  fs.rmSync(directory, { recursive: true, force: true });
}
