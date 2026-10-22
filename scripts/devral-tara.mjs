#!/usr/bin/env node
// Devralma taraması: var olan bir projenin hafıza, yol haritası, test/CI ve risk durumunu özetler.
// Bağımlılık yok, ağ yok, dosya yazmaz (stdout'a basar). Kullanım: node devral-tara.mjs [projeKökü]
// Gizli dosyalar (.env*, *.pem, *.key, .dev.vars, secrets/) ve deny klasörleri okunmaz; yalnız varlığı bildirilir.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { extname, join, relative, resolve, sep } from 'node:path';

const BUYUK_SATIR = 1000;
const HAFIZA_DOSYA_KB = 50;
const HAFIZA_INDEKS_KB = 10;
const MAX_OKUMA = 2_000_000;
const ATLA_KLASOR = new Set(['node_modules', 'dist', 'build', '.wrangler', '.git', 'secrets', 'graphify-out']);
const GIZLI = (ad) => ad === '.env' || ad.startsWith('.env.') || ad.endsWith('.pem') || ad.endsWith('.key') || ad === '.dev.vars';
const KOD = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.py', '.go', '.rs', '.java', '.cs', '.rb', '.php', '.vue', '.svelte']);
const HAFIZA_KLASOR = [/(^|\/)claude-memory$/, /(^|\/)\.claude\/memory$/, /(^|\/)memory$/];
const YOL_HARITASI = /(^|\/)(roadmap|yol-haritasi|yol_haritasi)\.md$/i;
const DEVIR = /(^|\/)(devir[-_ ]?notu|handoff|progress)\.md$/i;

const kok = resolve(process.argv[2] || process.env.CLAUDE_PROJECT_DIR || process.cwd());

function gitDosyalari() {
  const res = spawnSync('git', ['-C', kok, 'ls-files', '-co', '--exclude-standard'], { encoding: 'utf8' });
  if (res.status !== 0 || res.error) return null;
  return res.stdout.split('\n').filter(Boolean);
}

function gez(dizin, cikti = []) {
  for (const g of readdirSync(dizin, { withFileTypes: true })) {
    if (cikti.length > 8000) break;
    const tam = join(dizin, g.name);
    if (g.isDirectory()) {
      if (!ATLA_KLASOR.has(g.name)) gez(tam, cikti);
    } else if (g.isFile()) cikti.push(relative(kok, tam).split(sep).join('/'));
  }
  return cikti;
}

const kb = (b) => Math.round(b / 102.4) / 10;
const boyut = (rel) => { try { return statSync(join(kok, rel)).size; } catch { return 0; } };
function satirSay(rel) {
  const b = boyut(rel);
  if (!b || b > MAX_OKUMA) return null;
  try { return readFileSync(join(kok, rel), 'utf8').split('\n').length; } catch { return null; }
}
const parcalar = (rel) => rel.split('/');
const klasorIcinde = (rel) => parcalar(rel).slice(0, -1).some((p) => ATLA_KLASOR.has(p));

try {
  if (!existsSync(kok)) { process.stdout.write(`Devralma taraması: ${kok} bulunamadı.\n`); process.exit(0); }
  const tumu = gitDosyalari() || gez(kok);
  const gizliler = tumu.filter((d) => GIZLI(parcalar(d).at(-1)) || parcalar(d).includes('secrets'));
  const dosyalar = tumu.filter((d) => !klasorIcinde(d) && !gizliler.includes(d));
  const cikti = [`# Devralma taraması: ${kok}`, ''];

  // 1. Mevcut düzen
  const var_ = (re) => dosyalar.filter((d) => re.test(d));
  const claudeMd = dosyalar.filter((d) => /(^|\/)CLAUDE\.md$/.test(d));
  const harita = var_(YOL_HARITASI);
  const devir = var_(DEVIR);
  const yaz = (ad, liste) => cikti.push(`- ${ad}: ${liste.length ? liste.join(', ') : 'yok'}`);
  cikti.push('## Mevcut düzen');
  yaz('CLAUDE.md', claudeMd);
  yaz('ORKESTRA.md', dosyalar.filter((d) => d === 'ORKESTRA.md'));
  yaz('Yol haritası', harita);
  yaz('Devir / ilerleme notu', devir);
  yaz('.claude/settings*.json', dosyalar.filter((d) => /^\.claude\/settings.*\.json$/.test(d)));
  cikti.push(`- Gizli dosya/klasör (okunmadı): ${gizliler.length ? `${gizliler.length} adet (içerik rapora yazılmaz)` : 'yok'}`);
  if (gizliler.some((d) => parcalar(d).at(-1) === '.dev.vars')) cikti.push('  - `.dev.vars` bulundu: deny listesine eklenmesi önerilir (şablonda yok).');

  // 2. Hafıza
  cikti.push('', '## Hafıza');
  const hafizaKokleri = new Set();
  for (const d of dosyalar) {
    const ust = parcalar(d).slice(0, -1).join('/');
    if (ust && HAFIZA_KLASOR.some((re) => re.test(ust)) && d.endsWith('.md')) hafizaKokleri.add(ust);
  }
  if (!hafizaKokleri.size) cikti.push('- Proje içinde hafıza klasörü bulunamadı.');
  for (const klasor of hafizaKokleri) {
    const dosya = dosyalar.filter((d) => d.startsWith(`${klasor}/`) && d.endsWith('.md'));
    const toplam = dosya.reduce((t, d) => t + boyut(d), 0);
    cikti.push(`- \`${klasor}/\`: ${dosya.length} dosya, ${kb(toplam)} KB`);
    const sisen = dosya.filter((d) => boyut(d) > HAFIZA_DOSYA_KB * 1024).sort((a, b) => boyut(b) - boyut(a));
    for (const d of sisen) cikti.push(`  - ŞİŞMİŞ: ${d} (${kb(boyut(d))} KB, sınır ${HAFIZA_DOSYA_KB} KB)`);
    const indeks = dosya.find((d) => d.endsWith('/MEMORY.md'));
    if (indeks && boyut(indeks) > HAFIZA_INDEKS_KB * 1024) {
      cikti.push(`  - İNDEKS BÜYÜK: ${indeks} (${kb(boyut(indeks))} KB; her oturumda yüklenirse bağlamı şişirir, sınır ${HAFIZA_INDEKS_KB} KB)`);
    }
  }
  for (const d of claudeMd) {
    const ic = boyut(d) <= MAX_OKUMA ? readFileSync(join(kok, d), 'utf8') : '';
    const importlar = [...ic.matchAll(/^\s*@(\S+)/gm)].map((m) => m[1]);
    if (importlar.length) cikti.push(`- ${d} içe aktarır: ${importlar.join(', ')}`);
  }

  // 3. Komutlar ve CI
  cikti.push('', '## Test, CI ve dağıtım');
  const pkgler = dosyalar.filter((d) => /(^|\/)package\.json$/.test(d)).slice(0, 6);
  if (!pkgler.length) cikti.push('- package.json bulunamadı.');
  for (const p of pkgler) {
    try {
      const s = JSON.parse(readFileSync(join(kok, p), 'utf8')).scripts || {};
      const adlar = Object.keys(s).slice(0, 14);
      cikti.push(`- ${p} script'leri: ${adlar.length ? adlar.map((a) => `\`${a}\``).join(', ') : 'yok'}`);
    } catch { cikti.push(`- ${p}: okunamadı`); }
  }
  const ci = dosyalar.filter((d) => d.startsWith('.github/workflows/'));
  cikti.push(`- CI iş akışları: ${ci.length ? ci.join(', ') : 'yok'}`);
  const altyapi = dosyalar.filter((d) => /(^|\/)(wrangler\.toml|Dockerfile|docker-compose\.ya?ml|vercel\.json|netlify\.toml)$/.test(d));
  cikti.push(`- Altyapı dosyaları: ${altyapi.length ? altyapi.join(', ') : 'yok'}`);
  const testSay = dosyalar.filter((d) => /(\.test\.|\.spec\.|(^|\/)tests?\/|(^|\/)e2e\/)/.test(d)).length;
  cikti.push(`- Test dosyası sayısı: ${testSay}`);

  // 4. Risk: büyük kaynak dosyalar
  cikti.push('', '## Riskli büyük dosyalar');
  const buyukler = [];
  for (const d of dosyalar) {
    if (!KOD.has(extname(d).toLowerCase())) continue;
    const s = satirSay(d);
    if (s && s >= BUYUK_SATIR) buyukler.push([d, s]);
  }
  buyukler.sort((a, b) => b[1] - a[1]);
  if (!buyukler.length) cikti.push(`- ${BUYUK_SATIR}+ satırlık kaynak dosya yok.`);
  for (const [d, s] of buyukler.slice(0, 10)) cikti.push(`- ${d} (${s} sat.)`);
  if (buyukler.length > 10) cikti.push(`- … ${buyukler.length - 10} dosya daha`);

  // 5. Sahiplik önerisi için üst düzey klasörler
  cikti.push('', '## Üst düzey klasörler (sahiplik önerisi için ham veri)');
  const sayim = new Map();
  let kokDosya = 0;
  for (const d of dosyalar) {
    const p = parcalar(d);
    if (p.length === 1) { kokDosya++; continue; }
    const anahtar = p[0] === 'src' && p.length > 2 ? `src/${p[1]}` : p[0];
    const o = sayim.get(anahtar) || { dosya: 0, kod: 0 };
    o.dosya++;
    if (KOD.has(extname(d).toLowerCase())) o.kod++;
    sayim.set(anahtar, o);
  }
  for (const [k, o] of [...sayim].sort((a, b) => b[1].dosya - a[1].dosya).slice(0, 25)) {
    cikti.push(`- \`${k}/\`: ${o.dosya} dosya (${o.kod} kod)`);
  }
  cikti.push(`- Kök dosyalar: ${kokDosya} adet (sahibi atanmalı)`);

  process.stdout.write(`${cikti.join('\n')}\n`);
} catch (e) {
  process.stdout.write(`Devralma taraması üretilemedi: ${e.message}\n`);
}
process.exitCode = 0;
