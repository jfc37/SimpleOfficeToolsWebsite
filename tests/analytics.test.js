const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const cheerio = require("cheerio");

const websiteRoot = path.resolve(__dirname, "..");
const productionPages = [
  "index.html",
  "features.html",
  "simply-sign.html",
  "pricing.html",
  "download.html",
  "faqs.html",
  "videos.html",
  "privacy-policy.html",
  "refund-policy.html",
  "terms-and-conditions.html",
  "checkout.html",
  "purchase-completed.html"
];
const developmentPages = [
  "pricing-dev.html",
  "checkout-dev.html",
  "purchase-completed-dev.html"
];

function read(relativePath) {
  return fs.readFileSync(path.join(websiteRoot, relativePath), "utf8");
}

test("all production pages use the shared analytics loader", () => {
  productionPages.forEach((page) => {
    const source = read(page);
    const $ = cheerio.load(source);
    const loaders = $('script[src="assets/js/analytics.js"]');

    assert.equal(loaders.length, 1, `${page} should load analytics.js exactly once`);
    assert.doesNotMatch(source, /googletagmanager\.com\/gtag\/js/, `${page} should not duplicate the GA loader`);
    assert.doesNotMatch(source, /gtag\((['"])config\1/, `${page} should not configure GA inline`);
  });
});

test("development purchase pages do not send to the production property", () => {
  developmentPages.forEach((page) => {
    const source = read(page);

    assert.doesNotMatch(source, /assets\/js\/analytics\.js/, `${page} should not load production analytics`);
    assert.doesNotMatch(source, /G-97B467N03C/, `${page} should not contain the production measurement ID`);
    assert.doesNotMatch(source, /googletagmanager\.com/, `${page} should not load Google Tag Manager`);
  });
});

test("the analytics loader requires a visitor choice and exposes cookie settings", () => {
  const source = read("assets/js/analytics.js");

  assert.match(source, /consentChoice !== CONSENT_GRANTED/);
  assert.match(source, /data-consent-choice="denied"/);
  assert.match(source, /data-consent-choice="granted"/);
  assert.match(source, /Cookie settings/);
  assert.match(source, /allow_google_signals: false/);
  assert.match(source, /allow_ad_personalization_signals: false/);
  assert.match(source, /\["txn", "companyId", "companyName", "deviceId"\]/);
});

test("GA4 checkout events include item-level ecommerce data", () => {
  const source = read("checkout.html");

  assert.match(source, /function buildAnalyticsItem\(\)/);
  assert.match(source, /item_id: sku/);
  assert.match(source, /item_name: product\.name/);
  assert.match(source, /item_category:/);
  assert.match(source, /price: product\.unitPrice/);
  assert.match(source, /track\('begin_checkout',[\s\S]*?items: \[buildAnalyticsItem\(\)\]/);
  assert.match(source, /track\('purchase',[\s\S]*?items: \[buildAnalyticsItem\(\)\]/);
  assert.match(source, /callback: function \(\) \{[\s\S]*?redirectCompleted\(txn\)/);
});

test("high-value pricing links have analytics labels and locations", () => {
  const $ = cheerio.load(read("pricing.html"));
  const buyLinks = $('a[data-checkout-kind="envelopes"]');

  assert.equal(buyLinks.length, 5);
  buyLinks.each((_, element) => {
    const link = $(element);
    assert.equal(link.attr("data-analytics"), "cta_buy_click");
    assert.ok(link.attr("data-analytics-label"));
    assert.equal(link.attr("data-analytics-location"), "pricing-envelope-table");
  });
});

test("privacy copy describes optional website analytics and withdrawal", () => {
  const $ = cheerio.load(read("privacy-policy.html"));
  const analyticsSection = $("#website-analytics");

  assert.equal(analyticsSection.length, 1);
  assert.match(analyticsSection.text(), /Google Analytics is optional/);
  assert.match(analyticsSection.text(), /Cookie settings/);
  assert.match(analyticsSection.text(), /not loaded until/i);
});
