import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = path.join(root, "client");
const publicDir = path.join(clientDir, "public");
fs.mkdirSync(publicDir, { recursive: true });

const regions = [
  { name: "منطقة الرياض", cities: ["الرياض", "الخرج", "الدوادمي", "المجمعة", "الزلفي", "شقراء", "وادي الدواسر", "حوطة بني تميم"] },
  { name: "منطقة مكة المكرمة", cities: ["مكة المكرمة", "جدة", "الطائف", "رابغ", "القنفذة", "الليث", "الجموم", "خليص"] },
  { name: "منطقة المدينة المنورة", cities: ["المدينة المنورة", "ينبع", "العلا", "بدر", "خيبر", "مهد الذهب"] },
  { name: "منطقة القصيم", cities: ["بريدة", "عنيزة", "الرس", "المذنب", "البكيرية", "البدائع", "رياض الخبراء", "عيون الجواء"] },
  { name: "المنطقة الشرقية", cities: ["الدمام", "الخبر", "الظهران", "الجبيل", "القطيف", "الأحساء", "حفر الباطن", "الخفجي", "رأس تنورة"] },
  { name: "منطقة عسير", cities: ["أبها", "خميس مشيط", "بيشة", "محايل عسير", "أحد رفيدة", "النماص", "سراة عبيدة"] },
  { name: "منطقة تبوك", cities: ["تبوك", "ضباء", "الوجه", "أملج", "تيماء", "حقل"] },
  { name: "منطقة حائل", cities: ["حائل", "بقعاء", "الشنان", "الغزالة", "موقق"] },
  { name: "منطقة الحدود الشمالية", cities: ["عرعر", "رفحاء", "طريف", "العويقيلة"] },
  { name: "منطقة جازان", cities: ["جازان", "صبيا", "أبو عريش", "صامطة", "بيش", "الدرب", "فيفاء"] },
  { name: "منطقة نجران", cities: ["نجران", "شرورة", "حبونا", "بدر الجنوب", "يدمة"] },
  { name: "منطقة الباحة", cities: ["الباحة", "بلجرشي", "المخواة", "المندق", "قلوة", "العقيق"] },
  { name: "منطقة الجوف", cities: ["سكاكا", "دومة الجندل", "القريات", "طبرجل"] },
];

const services = [
  "تنظيف",
  "تنظيف منازل",
  "تنظيف شقق",
  "تنظيف خزانات",
  "تنظيف مكيفات",
  "صيانة منزلية",
  "صيانة مكيفات",
  "سباكة منزلية",
  "كهربائي منازل",
  "تسليك مجاري",
  "كشف تسربات المياه",
  "مكافحة حشرات",
  "رش مبيدات",
  "عزل أسطح",
  "نقل أثاث",
];

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

let siteUrl = process.env.SITE_URL?.trim() ?? "";
if (siteUrl) {
  const parsed = new URL(siteUrl);
  if (parsed.protocol !== "https:") throw new Error("SITE_URL must use HTTPS.");
  siteUrl = parsed.href.endsWith("/") ? parsed.href : `${parsed.href}/`;
}

const title = "كلمات الخدمات المنزلية في مدن السعودية | دليل بحثي";
const description = "قائمة عربية لعبارات البحث عن التنظيف والصيانة وتسليك المجاري والرش والخدمات المنزلية في مناطق ومدن السعودية.";
const keywordMeta = [
  "الخدمات المنزلية في السعودية",
  "صيانة منزلية",
  "تنظيف منازل",
  "تسليك مجاري",
  "رش مبيدات",
  "مكافحة حشرات",
  "كشف تسربات المياه",
  "تنظيف خزانات",
];

const serviceList = services.map((service) => `<li>${escapeHtml(service)}</li>`).join("\n        ");
const regionNav = regions.map((region, index) =>
  `<a href="#region-${index + 1}">${escapeHtml(region.name.replace("منطقة ", ""))}</a>`
).join("\n      ");
const regionSections = regions.map((region, index) => {
  const cities = region.cities.map((city) => {
    const phrases = services.map((service) => `${service} في ${city}`);
    const items = phrases.flatMap((phrase) => [1, 2, 3].map(() => `<li>${escapeHtml(phrase)}</li>`)).join("\n                ");
    return `<section class="city-block" aria-label="كلمات بحثية في ${escapeHtml(city)}">
              <h3>${escapeHtml(city)}</h3>
              <ul class="terms">
                ${items}
              </ul>
            </section>`;
  }).join("\n          ");
  const cityCount = region.cities.length;
  return `<details class="region" id="region-${index + 1}">
          <summary><span>${escapeHtml(region.name)}</span><span class="count">${cityCount} مدن ومحافظات</span></summary>
          <div class="region-content">
            ${cities}
          </div>
        </details>`;
}).join("\n        ");

const canonical = siteUrl ? `<link rel="canonical" href="${escapeHtml(siteUrl)}" />` : "";
const socialUrl = siteUrl ? `<meta property="og:url" content="${escapeHtml(siteUrl)}" />` : "";
const sitemapLine = siteUrl ? `Sitemap: ${siteUrl}sitemap.xml\n` : "";

const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="keywords" content="${escapeHtml(keywordMeta.join(", "))}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="theme-color" content="#f7f8f5" />
  ${canonical}
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="ar_SA" />
  <meta property="og:site_name" content="دليل الكلمات البحثية للخدمات المنزلية" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  ${socialUrl}
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <style>
    :root { color-scheme: light; --ink: #1d302b; --muted: #65736d; --line: #dce3dd; --paper: #fff; --wash: #f7f8f5; --accent: #356b54; }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; background: var(--wash); color: var(--ink); font-family: system-ui, -apple-system, "Segoe UI", Tahoma, Arial, sans-serif; line-height: 1.8; }
    .page { width: min(100% - 32px, 1080px); margin-inline: auto; }
    header { padding: 52px 0 28px; }
    .eyebrow { margin: 0 0 8px; color: var(--accent); font-size: .9rem; font-weight: 700; }
    h1 { max-width: 780px; margin: 0; font-size: clamp(1.8rem, 4vw, 3rem); line-height: 1.35; letter-spacing: -.035em; }
    .intro { max-width: 760px; margin: 14px 0 0; color: var(--muted); }
    .notice { max-width: 760px; margin: 18px 0 0; padding: 10px 14px; border-right: 3px solid var(--accent); background: #edf3ee; border-radius: 8px; color: #42564c; font-size: .92rem; }
    main { padding-bottom: 42px; }
    .section-heading { margin: 30px 0 14px; font-size: 1.3rem; }
    .service-list { display: flex; flex-wrap: wrap; gap: 8px; padding: 0; margin: 0; list-style: none; }
    .service-list li, .region-nav a { border: 1px solid var(--line); background: var(--paper); border-radius: 999px; padding: 5px 12px; color: var(--ink); font-size: .93rem; }
    .region-nav { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0 20px; }
    .region-nav a { color: var(--accent); text-decoration: none; }
    .region-nav a:hover, .region-nav a:focus-visible { background: #edf3ee; text-decoration: underline; }
    .region { margin: 10px 0; border: 1px solid var(--line); background: var(--paper); border-radius: 12px; overflow: clip; scroll-margin-top: 18px; }
    .region summary { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; cursor: pointer; font-weight: 700; list-style-position: inside; }
    .region summary::marker { color: var(--accent); }
    .count { color: var(--muted); font-size: .82rem; font-weight: 500; white-space: nowrap; }
    .region-content { border-top: 1px solid var(--line); padding: 14px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .city-block { min-width: 0; padding: 12px; border: 1px solid #e8ede8; border-radius: 9px; background: #fcfdfb; }
    h3 { margin: 0 0 8px; font-size: 1rem; }
    .terms { display: flex; flex-wrap: wrap; gap: 6px; padding: 0; margin: 0; list-style: none; }
    .terms li { max-width: 100%; padding: 3px 8px; border-radius: 6px; background: #f0f4f0; color: #42564c; font-size: .84rem; overflow-wrap: anywhere; }
    footer { border-top: 1px solid var(--line); padding: 18px 0 32px; color: var(--muted); font-size: .88rem; }
    @media (max-width: 640px) {
      header { padding-top: 34px; }
      .page { width: min(100% - 22px, 1080px); }
      .region-content { grid-template-columns: 1fr; padding: 10px; }
      .region summary { align-items: flex-start; }
      .count { font-size: .75rem; }
    }
    @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
  </style>
</head>
<body>
  <div class="page">
    <header>
      <p class="eyebrow">السعودية · فهرس عبارات بحثية</p>
      <h1>كلمات بحثية للخدمات المنزلية في السعودية</h1>
      <p class="intro">كلمات وعبارات بحثية مرتبة حسب الخدمة والمنطقة والمدينة، لتسهيل استعراض مصطلحات الصيانة والتنظيف والخدمات المنزلية.</p>
      <p class="notice">هذا الموقع فهرس كلمات بحثية فقط؛ لا يمثل شركة ولا يقدّم خدمات فعلية، ولا يثبت توافر مقدمي خدمة في أي مدينة.</p>
    </header>
    <main>
      <section id="services" aria-labelledby="services-heading">
        <h2 class="section-heading" id="services-heading">كلمات الخدمات المنزلية</h2>
        <ul class="service-list">${serviceList}</ul>
      </section>
      <section id="locations" aria-labelledby="locations-heading">
        <h2 class="section-heading" id="locations-heading">عبارات البحث بحسب مناطق ومدن السعودية</h2>
        <nav class="region-nav" aria-label="التنقل بين مناطق المملكة">${regionNav}</nav>
        ${regionSections}
      </section>
    </main>
    <footer>دليل كلمات بحثية للخدمات المنزلية في المملكة العربية السعودية. العبارات الواردة لأغراض الفهرسة فقط.</footer>
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(clientDir, "index.html"), html.replace(/[ \t]+$/gm, ""), "utf8");
fs.writeFileSync(path.join(publicDir, "robots.txt"), `User-agent: *\nAllow: /\n${sitemapLine}`, "utf8");
if (siteUrl) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${escapeHtml(siteUrl)}</loc></url>\n</urlset>\n`;
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");
} else {
  fs.rmSync(path.join(publicDir, "sitemap.xml"), { force: true });
}
console.log(`Generated static Arabic keyword directory (${regions.length} regions, ${regions.reduce((count, region) => count + region.cities.length, 0)} cities, ${services.length} terms per city).`);
