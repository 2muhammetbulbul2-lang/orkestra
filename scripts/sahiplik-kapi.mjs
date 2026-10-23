#!/usr/bin/env node
// PreToolUse (Edit|Write) hook: üretici ajanların (kod-modul, ekran, tasarim-sistemi) yazabileceği
// yerleri roadmap.md'deki "Sahip klasör / dosya" sütununa göre sınırlar.
//  - Hafıza dosyaları (roadmap/progress/kararlar/fikir/arastirma/CLAUDE/ORKESTRA .md, .claude/, .git/,
//    .orkestra/) üreticiye her zaman kapalıdır; bunları yalnız orkestra (ana oturum) günceller.
//  - Diğer yollar, o ajan türüne atanmış görevlerin sahip yollarından birine uymalıdır. Aynı türden
//    paralel ajanlar ayırt edilemediği için sahip yollar birleşim olarak değerlendirilir.
//  - Ek izinler: kod-modul → tasarim/, tests/ · ekran → kanit/, tests/.
//  - Ana oturum ve denetçiler etkilenmez. roadmap.md yoksa veya o ajan için görev bulunamazsa
//    (örn. /devral) yalnız hafıza dosyası kuralı uygulanır.
// Sınır: Bash ile dosya yazmak bu kapıdan geçmez; o yolu denetçiler yakalar.
// ORKESTRA_HOOKS=off kapatır.
import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';

const URETICILER = new Set(['kod-modul', 'ekran', 'tasarim-sistemi']);
const EK_IZIN = { 'kod-modul': ['tasarim/', 'tests/'], ekran: ['kanit/', 'tests/'], 'tasarim-sistemi': [] };
const KORUNAN = [
  /^(roadmap|progress|kararlar|fikir|arastirma|CLAUDE|ORKESTRA)\.md$/i,
  /^\.claude\//,
  /^\.git\//,
  /^\.orkestra\//,
];

const duz = (s) => s.replace(/\\/g, '/');

function eslesir(rel, desen) {
  const d = duz(desen).replace(/^\.\//, '');
  if (!/[*?]/.test(d)) {
    const t = d.replace(/\/+$/, '');
    return rel === t || rel.startsWith(`${t}/`);
  }
  const kacis = (s) => s.replace(/[.+^${}()|[\]\\?]/g, '\\$&');
  const re = d.split('**').map((p) => p.split('*').map(kacis).join('[^/]*')).join('.*');
  return new RegExp(`^${re}$`).test(rel);
}

// roadmap.md görev tablosundan, bu ajana atanmış görevlerin sahip yollarını çıkarır.
function sahipYollar(roadmapMetni, ajan) {
  const satirlar = roadmapMetni.split('\n').filter((s) => s.trim().startsWith('|'));
  const hucre = (s) => s.trim().replace(/^\||\|$/g, '').split('|').map((h) => h.trim());
  const baslikIdx = satirlar.findIndex((s) => /ajan/i.test(s) && /sahip/i.test(s));
  if (baslikIdx < 0) return null;
  const baslik = hucre(satirlar[baslikIdx]);
  const aj = baslik.findIndex((h) => /^ajan/i.test(h));
  const sa = baslik.findIndex((h) => /^sahip/i.test(h));
  if (aj < 0 || sa < 0) return null;
  const yollar = [];
  for (const satir of satirlar.slice(baslikIdx + 1)) {
    const h = hucre(satir);
    if (!h[aj] || !h[aj].includes(ajan) || !h[sa]) continue;
    const kodlu = [...h[sa].matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    const liste = kodlu.length ? kodlu : h[sa].split(/[,;]/).map((s) => s.trim());
    yollar.push(...liste.filter((y) => y && !/[()]/.test(y) && !/^[—-]+$/.test(y)));
  }
  return yollar.length ? yollar : null;
}

function karar(input) {
  const ajan = String(input.agent_type || '').split(':').pop();
  if (!URETICILER.has(ajan)) return null;
  const hedef = input.tool_input?.file_path;
  if (!hedef) return null;

  const project = resolve(process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd());
  // worktree'de yollar proje yerine oturumun cwd'sine göredir.
  const kokler = [...new Set([project, input.cwd && resolve(input.cwd)].filter(Boolean))];
  let rel = null;
  let kok = project;
  for (const k of kokler) {
    const r = duz(relative(k, resolve(k, hedef)));
    if (!r.startsWith('..') && !isAbsolute(r)) {
      rel = r;
      kok = k;
      break;
    }
  }
  if (rel === null) {
    const gecici = input.scratchpad_dir && resolve(input.scratchpad_dir);
    if (gecici && !relative(gecici, resolve(hedef)).startsWith('..')) return null;
    return `${hedef} proje dışında; ${ajan} yalnız proje içine yazabilir.`;
  }

  if (KORUNAN.some((re) => re.test(rel))) {
    return `${rel} hafıza/yapılandırma dosyasıdır; ${ajan} yazamaz. Gerekiyorsa raporda "Dışarıda gereken değişiklik:" olarak iste, orkestra günceller.`;
  }

  const roadmap = [join(kok, 'roadmap.md'), join(project, 'roadmap.md')].find(existsSync);
  if (!roadmap) return null;
  const sahipler = sahipYollar(readFileSync(roadmap, 'utf8'), ajan);
  if (!sahipler) return null;
  if (EK_IZIN[ajan].some((p) => rel.startsWith(p))) return null;
  if (sahipler.some((d) => eslesir(rel, d))) return null;
  return `${rel} ${ajan} görevlerinin sahip yollarında değil (${sahipler.join(', ')}). ` +
    'Sahip olmadığın yere yazma; gerekiyorsa raporda "Dışarıda gereken değişiklik:" yaz.';
}

function main() {
  if ((process.env.ORKESTRA_HOOKS || '').toLowerCase() === 'off') return 0;
  const sebep = karar(JSON.parse(readFileSync(0, 'utf8') || '{}'));
  if (!sebep) return 0;
  process.stderr.write(`[orkestra] Yazma engellendi: ${sebep}\n`);
  return 2;
}

try {
  process.exitCode = main();
} catch {
  // Hook'un kendi hatası kullanıcının işini engellememeli.
  process.exitCode = 0;
}
