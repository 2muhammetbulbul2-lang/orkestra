#!/usr/bin/env node
// PreToolUse (Bash) hook: git komutlarına üç kapı koyar.
//  1. git commit: gizli dosya (.env, *.pem, *.key, secrets/) commit'e giriyorsa engeller.
//     Staged dosyalara, aynı komuttaki `git add` argümanlarına, `git add .|-A|-u` ile eklenecek
//     dosyalara ve `commit -a` ile eklenecek takipli dosyalara bakar.
//  2. git commit: lint/test komutu varsa (bkz. ortak.mjs) çalıştırır, kırmızıysa engeller (exit 2).
//  3. git push: engellemez, yalnızca "kullanıcıya sor" hatırlatması ekler.
// `git -C dizin commit`, `git -c k=v commit`, `bash -c "git commit"` ve zincirli komutlar da yakalanır.
// ORKESTRA_HOOKS=off hepsini kapatır; minimal test kapısını atlar (sadece lint).
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { PROFIL, kapiKomutlari, kapiCalistir } from './ortak.mjs';

const TIMEOUT_MS = 90_000;
const GIZLI = /(^|[\\/])(\.env(\..*)?|[^\\/]*\.(pem|key)|secrets([\\/].*)?)$/i;
const HEPSINI_EKLER = new Set(['.', '-A', '--all', '-u', '--update', ':/', '*']);
// git [genel seçenekler] <alt komut>; genel seçenek: -C dizin, -c k=v, --uzun[=değer], -p/-P
const GIT_KOMUT =
  /\bgit((?:\s+(?:-C\s+(?:"[^"]*"|'[^']*'|\S+)|-c\s+\S+|--[\w-]+(?:=\S+)?|-[pP]))*)\s+(commit|push|add)\b([^;&|\n]*)/g;

const git = (dizin, args) =>
  spawnSync('git', args, { cwd: dizin, encoding: 'utf8', timeout: 15_000 });

const satirlar = (r) =>
  r.status === 0 ? r.stdout.split('\n').map((s) => s.trim()).filter(Boolean) : [];
const temizle = (s) => s.replace(/^["']|["']$/g, '');

function komutlariAyir(komut, project) {
  const bulunan = [];
  for (const m of komut.matchAll(GIT_KOMUT)) {
    const c = /-C\s+("[^"]*"|'[^']*'|\S+)/.exec(m[1]);
    let dizin = project;
    if (c) {
      const aday = resolve(project, temizle(c[1]));
      if (existsSync(aday) && statSync(aday).isDirectory()) dizin = aday;
    }
    bulunan.push({ alt: m[2], dizin, args: m[3].trim().split(/\s+/).map(temizle).filter(Boolean) });
  }
  return bulunan;
}

function gizliDosyalar(dizin, commitler, addler) {
  const bulunan = [];
  const ekle = (liste) => bulunan.push(...liste.filter((s) => GIZLI.test(s)));
  ekle(satirlar(git(dizin, ['diff', '--cached', '--name-only'])));
  // commit -a / -am / --all: takipli, değişmiş dosyalar da commit'e girer.
  if (commitler.some((c) => c.args.some((a) => a === '--all' || /^-[a-zA-Z]*a[a-zA-Z]*$/.test(a)))) {
    ekle(satirlar(git(dizin, ['diff', '--name-only'])));
  }
  // `git add X && git commit`: ekleme henüz staged değildir.
  for (const ad of addler) {
    const yollar = ad.args.filter((a) => !a.startsWith('-') || HEPSINI_EKLER.has(a));
    ekle(yollar);
    if (yollar.some((a) => HEPSINI_EKLER.has(a)) || ad.args.some((a) => HEPSINI_EKLER.has(a))) {
      // .gitignore'daki dosyalar --exclude-standard ile elenir; git de eklemez.
      ekle(satirlar(git(ad.dizin, ['ls-files', '-o', '-m', '--exclude-standard'])));
    }
  }
  return [...new Set(bulunan)];
}

function main() {
  if (PROFIL === 'off') return 0;
  const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
  const komut = input.tool_input?.command;
  if (typeof komut !== 'string') return 0;
  const project = resolve(process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd());

  const hepsi = komutlariAyir(komut, project);
  const commitler = hepsi.filter((k) => k.alt === 'commit');
  const addler = hepsi.filter((k) => k.alt === 'add');

  if (commitler.length) {
    for (const { dizin } of commitler.filter((c, i, a) => a.findIndex((x) => x.dizin === c.dizin) === i)) {
      const gizli = gizliDosyalar(dizin, commitler.filter((c) => c.dizin === dizin), addler);
      if (gizli.length) {
        process.stderr.write(
          `[orkestra] Commit engellendi: gizli dosya commit'e giriyor: ${gizli.join(', ')}\n` +
            'Dosyayı çıkar (git restore --staged) ve .gitignore\'a ekle.\n',
        );
        return 2;
      }
      const hatalar = kapiCalistir(dizin, kapiKomutlari(dizin, { otomatik: true }), TIMEOUT_MS);
      if (hatalar.length) {
        process.stderr.write(
          `[orkestra] Commit engellendi, önce şunlar yeşil olmalı:\n${hatalar.join('\n\n')}\n`,
        );
        return 2;
      }
    }
    return 0;
  }

  if (hepsi.some((k) => k.alt === 'push')) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          additionalContext:
            '[orkestra] git push: kullanıcı bu push için açıkça onay vermediyse çalıştırma, önce sor.',
        },
      }),
    );
  }
  return 0;
}

try {
  process.exitCode = main();
} catch {
  // Hook'un kendi hatası kullanıcının işini engellememeli.
  process.exitCode = 0;
}
