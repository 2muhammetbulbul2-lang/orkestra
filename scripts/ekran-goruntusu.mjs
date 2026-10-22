#!/usr/bin/env node
// Görsel kanıt: bir sayfanın ekran görüntülerini kanit/ klasörüne yazar (mobil, tablet, masaüstü).
// Projede kurulu Playwright'ı kullanır; KURMAZ. Playwright veya Chromium yoksa nedenini söyleyip 2 koduyla çıkar.
// Hedef yalnız yerel adres (localhost, 127.0.0.1, [::1]) veya proje içindeki bir dosyadır.
// Kullanım: node ekran-goruntusu.mjs <projeKökü> <hedef> <ad> [--boyut mobil,tablet,masaustu] [--tam-sayfa]
import { mkdirSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const BOYUTLAR = {
  mobil: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  masaustu: { width: 1280, height: 800 },
};
const argv = process.argv.slice(2);
const bayrak = (ad) => argv.includes(ad);
const deger = (ad) => { const i = argv.indexOf(ad); return i >= 0 ? argv[i + 1] : undefined; };
const konum = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1] === '--boyut'));
const [kokArg, hedef, adHam] = konum;
if (!kokArg || !hedef || !adHam) {
  console.error('Kullanım: node ekran-goruntusu.mjs <projeKökü> <hedef> <ad> [--boyut mobil,tablet,masaustu] [--tam-sayfa]');
  process.exit(1);
}
const kok = resolve(kokArg);
const ad = adHam.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'ekran';
const secilen = (deger('--boyut') || 'mobil,masaustu').split(',').map((s) => s.trim()).filter(Boolean);
const gecersiz = secilen.filter((s) => !BOYUTLAR[s]);
if (gecersiz.length) { console.error(`Bilinmeyen boyut: ${gecersiz.join(', ')} (mobil, tablet, masaustu)`); process.exit(1); }

function hedefUrl() {
  if (/^https?:\/\//i.test(hedef)) {
    const host = new URL(hedef).hostname;
    if (!['localhost', '127.0.0.1', '[::1]', '::1'].includes(host)) {
      console.error(`REDDEDİLDİ: yalnız yerel adresler açılır (${host}).`);
      process.exit(1);
    }
    return hedef;
  }
  const tam = resolve(kok, hedef);
  const gorece = relative(kok, tam);
  if (gorece.startsWith('..') || isAbsolute(gorece) || !existsSync(tam)) {
    console.error(`REDDEDİLDİ: dosya proje içinde değil veya yok: ${hedef}`);
    process.exit(1);
  }
  return pathToFileURL(tam).href;
}

async function playwrightYukle() {
  const gerek = createRequire(join(kok, 'package.json'));
  for (const paket of ['playwright', '@playwright/test', 'playwright-core']) {
    try { return await import(pathToFileURL(gerek.resolve(paket)).href); } catch { /* sıradaki */ }
  }
  return null;
}

const url = hedefUrl();
const pw = await playwrightYukle();
if (!pw) {
  console.error('PLAYWRIGHT YOK: projede kurulu değil. Orkestra kurmaz; kullanıcı karar verir (örn. `npm i -D playwright` ve `npx playwright install chromium`).');
  process.exit(2);
}
const chromium = pw.chromium ?? pw.default?.chromium;
let tarayici;
try {
  tarayici = await chromium.launch();
} catch (e) {
  console.error(`CHROMIUM AÇILAMADI: ${String(e.message).split('\n')[0]}\nKullanıcı \`npx playwright install chromium\` çalıştırmalı; orkestra çalıştırmaz.`);
  process.exit(2);
}
const klasor = join(kok, 'kanit');
mkdirSync(klasor, { recursive: true });
let hata = 0;
try {
  for (const boyut of secilen) {
    const sayfa = await tarayici.newPage({ viewport: BOYUTLAR[boyut] });
    const konsolHata = [];
    sayfa.on('pageerror', (e) => konsolHata.push(e.message));
    sayfa.on('console', (m) => { if (m.type() === 'error') konsolHata.push(m.text()); });
    try {
      await sayfa.goto(url, { waitUntil: 'load', timeout: 20000 });
      await sayfa.waitForTimeout(500);
      const dosya = join(klasor, `${ad}-${boyut}.png`);
      await sayfa.screenshot({ path: dosya, fullPage: bayrak('--tam-sayfa') });
      console.log(`YAZILDI: kanit/${ad}-${boyut}.png (${BOYUTLAR[boyut].width}x${BOYUTLAR[boyut].height})`);
    } catch (e) {
      console.error(`HATA (${boyut}): ${String(e.message).split('\n')[0]}`);
      hata++;
    }
    if (konsolHata.length) console.log(`KONSOL HATASI (${boyut}): ${konsolHata.slice(0, 3).join(' | ')}`);
    await sayfa.close();
  }
} finally {
  await tarayici.close();
}
process.exitCode = hata ? 2 : 0;
