#!/usr/bin/env node
// Depo haritası: ajanlara görev bağlamı olarak verilecek kısa dosya listesi.
// Bağımlılık yok, ağ yok, dosya yazmaz (stdout'a basar). Kullanım: node harita.mjs [projeKökü] [altKlasör]
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { extname, join, relative, resolve, sep } from 'node:path';

const MAX_DOSYA = 120;
const MAX_CIKTI = 8000;
const MAX_OKUMA = 200_000;
// templates/settings.proje.json'daki deny kurallarıyla aynı: bu dosyalar listelenmez, okunmaz.
const ATLA_KLASOR = new Set(['node_modules', 'dist', 'build', '.wrangler', '.git', 'secrets', 'graphify-out']);
const ATLA_DOSYA = (ad) => ad === '.env' || ad.startsWith('.env.') || ad.endsWith('.pem') || ad.endsWith('.key');
const KOD_UZANTI = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx']);
const ATLA_UZANTI = new Set(['.lock', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.map']);

const kok = resolve(process.argv[2] || process.env.CLAUDE_PROJECT_DIR || process.cwd());
const alt = process.argv[3] ? resolve(kok, process.argv[3]) : kok;

function izinli(rel) {
  const parcalar = rel.split(/[\\/]/);
  if (parcalar.slice(0, -1).some((p) => ATLA_KLASOR.has(p))) return false;
  const ad = parcalar[parcalar.length - 1];
  return !ATLA_DOSYA(ad) && !ATLA_UZANTI.has(extname(ad).toLowerCase());
}

function gitDosyalari() {
  const res = spawnSync('git', ['-C', kok, 'ls-files', '-co', '--exclude-standard'], { encoding: 'utf8' });
  if (res.status !== 0 || res.error) return null;
  return res.stdout.split('\n').filter(Boolean);
}

function gezDosyalari(dizin, cikti = []) {
  for (const girdi of readdirSync(dizin, { withFileTypes: true })) {
    if (cikti.length > 5000) break;
    const tam = join(dizin, girdi.name);
    if (girdi.isDirectory()) {
      if (!ATLA_KLASOR.has(girdi.name)) gezDosyalari(tam, cikti);
    } else if (girdi.isFile()) {
      cikti.push(relative(kok, tam).split(sep).join('/'));
    }
  }
  return cikti;
}

function ozet(rel) {
  const tam = join(kok, rel);
  let boyut;
  try { boyut = statSync(tam).size; } catch { return null; }
  if (boyut > MAX_OKUMA) return `${rel}  (büyük dosya)`;
  let metin;
  try { metin = readFileSync(tam, 'utf8'); } catch { return `${rel}`; }
  const satir = metin ? metin.split('\n').length : 0;
  let ek = '';
  if (KOD_UZANTI.has(extname(rel).toLowerCase())) {
    const adlar = [...metin.matchAll(/^export\s+(?:default\s+)?(?:async\s+)?(?:function\*?|class|const|let|var|interface|type|enum)\s+([A-Za-z_$][\w$]*)/gm)]
      .map((m) => m[1]);
    if (adlar.length) ek = `  → ${[...new Set(adlar)].slice(0, 6).join(', ')}`;
  }
  return `${rel}  (${satir} sat.)${ek}`;
}

try {
  if (!existsSync(alt)) {
    process.stdout.write(`Depo haritası: ${alt} bulunamadı.\n`);
    process.exit(0);
  }
  const altRel = relative(kok, alt).split(sep).join('/');
  let dosyalar = (gitDosyalari() || gezDosyalari(kok)).filter(izinli);
  if (altRel) dosyalar = dosyalar.filter((d) => d === altRel || d.startsWith(`${altRel}/`));
  dosyalar.sort();

  const satirlar = [`Depo haritası (${dosyalar.length} dosya${altRel ? `, ${altRel}/` : ''}):`];
  let yazilan = 0;
  for (const rel of dosyalar) {
    if (yazilan >= MAX_DOSYA) break;
    const s = ozet(rel);
    if (!s) continue;
    satirlar.push(s);
    yazilan++;
  }
  if (dosyalar.length > yazilan) satirlar.push(`… ${dosyalar.length - yazilan} dosya daha (Grep/Glob ile ara)`);

  let cikti = satirlar.join('\n');
  if (cikti.length > MAX_CIKTI) cikti = `${cikti.slice(0, MAX_CIKTI)}\n… (kısaltıldı)`;
  process.stdout.write(`${cikti}\n`);
} catch (e) {
  process.stdout.write(`Depo haritası üretilemedi: ${e.message}\n`);
}
process.exitCode = 0;
