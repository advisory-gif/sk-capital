import fs from "node:fs";
import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";
import { JSDOM, VirtualConsole } from "jsdom";

// DOM/interaction checks, not a replacement for rendered browser or device QA.
// Run `npm run build:offline` first so this tests the actual portable artifact.
const html = fs.readFileSync("review-artifacts/sk-capital-review.html", "utf8");
const errors = [];
const requests = [];
const virtualConsole = new VirtualConsole();
virtualConsole.on("jsdomError", (error) => {
  // jsdom does not implement every modern CSS rule. Layout is not tested here.
  if (error.type !== "css parsing") errors.push(error.message);
});
virtualConsole.on("error", (...args) =>
  errors.push(args.map(String).join(" ")),
);
const dom = new JSDOM(html, {
  url: "file:///review/sk-capital-review.html",
  runScripts: "dangerously",
  pretendToBeVisual: true,
  virtualConsole,
  beforeParse(window) {
    window.scrollTo = () => {};
    window.HTMLElement.prototype.scrollIntoView = () => {};
    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
    });
    window.HTMLDialogElement.prototype.showModal = function () {
      this.open = true;
    };
    window.HTMLDialogElement.prototype.close = function () {
      const wasOpen = this.open;
      this.open = false;
      if (wasOpen) this.dispatchEvent(new window.Event("close"));
    };
    window.fetch = (...args) => {
      requests.push(args);
      return Promise.reject(
        new Error("Network forbidden in offline review tests"),
      );
    };
    window.XMLHttpRequest.prototype.open = function (...args) {
      requests.push(args);
      throw new Error("XHR forbidden in offline review tests");
    };
    window.open = (...args) => {
      requests.push(args);
      return null;
    };
  },
});
const { window } = dom;
const { document } = window;
const checks = [];
async function waitFor(predicate, description) {
  const until = Date.now() + 3000;
  while (!predicate()) {
    if (Date.now() >= until)
      throw new Error(`Timed out: ${description}. ${errors.join("; ")}`);
    await delay(10);
  }
}
const text = () => document.body.textContent.replace(/\s+/g, " ");
const findText = (selector, label) =>
  [...document.querySelectorAll(selector)].find(
    (element) => element.textContent.trim() === label,
  );
async function check(name, action) {
  await action();
  checks.push(name);
  console.log(`PASS ${name}`);
}
async function click(element) {
  assert.ok(element, "Click target exists");
  element.dispatchEvent(
    new window.MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      button: 0,
    }),
  );
  await delay(20);
}
async function route(path) {
  window.location.hash = `#${path}`;
  await waitFor(() => window.location.hash === `#${path}`, `route ${path}`);
  await delay(35);
}
function setInput(element, value) {
  const prototype =
    element.tagName === "TEXTAREA"
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, "value").set.call(element, value);
  element.dispatchEvent(new window.Event("input", { bubbles: true }));
}

await check(
  "Homepage, five business areas and draft status render",
  async () => {
    await waitFor(() => document.querySelector(".new-hero"), "home render");
    assert.match(
      document.querySelector("h1").textContent,
      /See the whole business/,
    );
    assert.deepEqual(
      [...document.querySelectorAll(".performance-grid h3")].map(
        (el) => el.textContent,
      ),
      ["Sales", "Delivery", "Profit", "Cash", "Capacity"],
    );
    assert.match(
      document.querySelector(".review-banner").textContent,
      /not active/,
    );
    await waitFor(
      () => document.title.includes("Business Performance"),
      "home metadata",
    );
    assert.match(document.title, /Business Performance/);
  },
);
await check(
  "Navigation opens, closes on Escape and returns focus",
  async () => {
    await click(document.querySelector(".menu-toggle"));
    assert.equal(
      document.querySelector(".menu-toggle").getAttribute("aria-expanded"),
      "true",
    );
    assert.equal(document.querySelector("#site-links").hidden, false);
    document.dispatchEvent(
      new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await delay(20);
    assert.equal(document.querySelector("#site-links").hidden, true);
    assert.equal(
      document.activeElement,
      document.querySelector(".menu-toggle"),
    );
  },
);
await check(
  "Primary CTA reaches bounded pilot and preserves metadata",
  async () => {
    await click(document.querySelector(".hero-copy .primary"));
    await waitFor(() => document.querySelector(".offer-hero"), "pilot render");
    assert.match(window.location.hash, /business-health-review/);
    assert.match(text(), /One-off pilot/);
    assert.match(text(), /final payable total/);
    assert.match(text(), /up to 10 selected/);
    await waitFor(
      () => document.title.includes("Revenue Leak Check"),
      "pilot metadata",
    );
    assert.match(document.title, /Revenue Leak Check/);
  },
);
await check("Pilot in-page navigation stays on the route", async () => {
  await click(document.querySelector(".offer-hero .primary"));
  assert.equal(window.location.hash, "#/business-health-review#scope");
  assert.ok(document.querySelector("#scope"));
  assert.match(document.querySelector("h1").textContent, /Follow the work/);
});
await check(
  "Local enquiry previews, closes and repeats without transmission",
  async () => {
    await route("/business-health-review#enquiry");
    setInput(
      document.querySelector("#business-type"),
      "Fictional design agency",
    );
    setInput(
      document.querySelector("#priority"),
      "Why is completed work waiting for billing?",
    );
    await delay(20);
    await click(document.querySelector('.enquiry-card button[type="submit"]'));
    await waitFor(
      () => document.querySelector(".local-preview"),
      "local preview",
    );
    assert.match(
      document.querySelector(".local-preview").textContent,
      /Fictional design agency/,
    );
    assert.match(
      document.querySelector(".local-preview").textContent,
      /completed work/,
    );
    assert.match(
      document.querySelector(".local-preview").textContent,
      /Not sent/,
    );
    await click(document.querySelector(".local-preview button"));
    assert.equal(document.querySelector(".local-preview"), null);
    const select = document.querySelector("#service");
    select.value = "Business Pulse";
    select.dispatchEvent(new window.Event("change", { bubbles: true }));
    await click(document.querySelector('.enquiry-card button[type="submit"]'));
    assert.match(
      document.querySelector(".local-preview").textContent,
      /Business Pulse/,
    );
    assert.equal(requests.length, 0);
  },
);
await check("FAQ expands and collapses as a native disclosure", async () => {
  const detail = document.querySelector(".faq details");
  await click(detail.querySelector("summary"));
  assert.equal(detail.open, true);
  await click(detail.querySelector("summary"));
  assert.equal(detail.open, false);
});
await check(
  "Leaving and reopening the enquiry clears entered text",
  async () => {
    await route("/");
    await route("/business-health-review");
    assert.equal(document.querySelector("#business-type").value, "");
    assert.equal(document.querySelector("#priority").value, "");
  },
);
await check("Scoped advisory links preselect the correct service", async () => {
  await route("/businesses");
  assert.match(
    text(),
    /not included in the ₹1,999 Revenue Leak Check or Business Pulse/,
  );
  await click(document.querySelector(".closing .primary"));
  assert.equal(
    window.location.hash,
    "#/business-health-review?service=advisory#enquiry",
  );
  assert.equal(
    document.querySelector("#service").value,
    "Separately scoped advisory",
  );
});
await check("Navigation closes after choosing a route", async () => {
  await click(document.querySelector(".menu-toggle"));
  const link = [...document.querySelectorAll("#site-links a")].find((element) =>
    element.textContent.includes("Perspectives"),
  );
  await click(link);
  await waitFor(
    () => document.querySelector(".perspective"),
    "perspectives route",
  );
  assert.equal(document.querySelector("#site-links").hidden, true);
});
await check("Back and Forward restore the expected page", async () => {
  await route("/startups");
  window.history.back();
  await waitFor(() => window.location.hash === "#/blog", "back navigation");
  await waitFor(() => document.querySelector(".perspective"), "back page");
  window.history.forward();
  await waitFor(
    () => window.location.hash === "#/startups",
    "forward navigation",
  );
  await waitFor(
    () =>
      document
        .querySelector("h1")
        ?.textContent.includes("Know what drives growth"),
    "forward page",
  );
});
await check("Portable pricing alias shows the pilot", async () => {
  await route("/pricing");
  assert.equal(window.location.hash, "#/pricing");
  assert.ok(document.querySelector(".offer-hero"));
});
await check("Runway calculator calculates, validates and closes", async () => {
  await click(findText("footer button", "Runway calculator"));
  const dialog = document.querySelector(".runway-dialog");
  assert.equal(dialog.open, true);
  setInput(document.querySelector("#cash"), "100000");
  setInput(document.querySelector("#burn"), "25000");
  await waitFor(
    () => dialog.querySelector("output").textContent.includes("4.0 months"),
    "runway result",
  );
  setInput(document.querySelector("#burn"), "0");
  await delay(20);
  assert.match(
    dialog.querySelector("output").textContent,
    /finite runway cannot/,
  );
  setInput(document.querySelector("#burn"), "-1");
  await delay(20);
  assert.match(dialog.querySelector("output").textContent, /non-negative/);
  await click(dialog.querySelector("button"));
  assert.equal(dialog.open, false);
});
await check(
  "Illustrative model exposes six distinct accessible views",
  async () => {
    await route("/portfolio");
    await waitFor(
      () => document.querySelector(".finance-dashboard"),
      "portfolio render",
    );
    const buttons = [
      ...document.querySelectorAll(".finance-view-controls button"),
    ];
    assert.equal(buttons.length, 6);
    const headings = [];
    for (const button of buttons) {
      await click(button);
      assert.equal(button.getAttribute("aria-pressed"), "true");
      assert.equal(
        document.querySelectorAll(
          '.finance-view-controls button[aria-pressed="true"]',
        ).length,
        1,
      );
      headings.push(document.querySelector("#finance-view-title").textContent);
      assert.ok(document.querySelector(".finance-panel table caption"));
    }
    assert.equal(new Set(headings).size, 6);
    assert.match(text(), /Fictional company/);
  },
);
await check(
  "All retained content routes and unknown route render",
  async () => {
    for (const path of [
      "/startups",
      "/blog",
      "/how-we-use-ai",
      "/not-a-real-route",
    ]) {
      await route(path);
      assert.equal(
        document.querySelectorAll("main h1").length,
        1,
        `${path} has one heading`,
      );
    }
    assert.match(document.querySelector("h1").textContent, /Page not found/);
    await click(document.querySelector("main .primary"));
    assert.ok(document.querySelector(".new-hero"));
  },
);
await check(
  "Offline artifact has no live enquiry endpoints or asset dependencies",
  async () => {
    assert.equal(requests.length, 0);
    assert.equal(
      document.querySelectorAll(
        'script[src], link[rel="stylesheet"], link[rel="preconnect"]',
      ).length,
      0,
    );
    assert.equal(
      document.querySelectorAll(
        'a[href^="mailto:"], a[href*="cal.com"], input[type="file"]',
      ).length,
      0,
    );
    assert.ok(!html.includes("fonts.googleapis.com"));
    assert.equal(
      document.querySelector('meta[name="robots"]').content,
      "noindex, nofollow",
    );
  },
);
assert.deepEqual(errors, [], "No runtime errors captured");
fs.writeFileSync(
  "review-artifacts/dom-check-results.json",
  JSON.stringify(
    {
      passed: checks.length,
      checks,
      runtimeErrors: errors,
      networkAttempts: requests.length,
      limitations:
        "jsdom DOM checks only. No browser-rendering, device, layout, visual, contrast, network-protocol or screen-reader QA.",
    },
    null,
    2,
  ),
);
window.close();
console.log(
  `\n${checks.length} DOM checks passed. Browser visual QA remains separate.`,
);
