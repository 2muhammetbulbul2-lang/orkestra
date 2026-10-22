#!/usr/bin/env node
// PreToolUse (Bash) hook: git komutlarına üç kapı koyar.
//  1. git commit: gizli dosya (.env, *.pem, *.key, secrets/) varsa engeller.
//  2. git commit: projede lint/test script'i varsa çalıştırır, kırmızıysa engeller (exit 2).
//  3. git push: engellemez, yalnızca "kullanıcıya sor" hatırlatması ekler.
// ORKESTRA_HOOKS=off hepsini kapatır; minimal test kapısını atlar (sadece lint).
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';

const TIMEOUT_MS = 90_000;
const PROFIL = (process.env.ORKESTRA_HOOKS || '').toLowerCase();
const GIZLI = /(^|[\\/])(\.env(\..*)?|[^\\/]*\.(pem|key)|secrets[\\/].*)$/i;

const git = (project, args) =>
  spawnSync('git', args, { cwd: project, encoding: 'utf8', timeout: 15_000 });

function gizliDosyalar(project, komut) {
  const bulunan = [];
  const staged = git(project, ['diff', '--cached', '--name-only']);
  if (staged.status === 0) {
    bulunan.push(...staged.stdout.split('\n').map((s) => s.trim()).filter((s) => GIZLI.test(s)));
  }
  // `git add .env && git commit` gibi aynı komuttaki ekleme henüz staged değildir.
  if (/\bgit\s+add\b/.test(komut)) {
    for (const parca of komut.split(/\s+/)) {
      const temiz = parca.replace(/^["']|["']$/g, '');
      if (temiz && !temiz.startsWith('-') && GIZLI.test(temiz)) bulunan.push(temiz);
    }
  }
  return [...new Set(bulunan)];
}

function testKapisi(project) {
  const pkgPath = join(project, 'package.json');
  if (!existsSync(pkgPath)) return [];
  const scripts = JSON.parse(readFileSync(pkgPath, 'utf8')).scripts || {};
  const hatalar = [];
  for (const name of PROFIL === 'minimal' ? ['lint'] : ['lint', 'test']) {
    if (!scripts[name]) continue;
    const res = spawnSync(`npm run ${name} --silent`, {
      cwd: project,
      env: { ...process.env, CI: 'true' },
      encoding: 'utf8',
      timeout: TIMEOUT_MS,
      shell: true,
    });
    if (res.error?.code === 'ETIMEDOUT') {
      hatalar.push(`npm run ${name}: ${TIMEOUT_MS / 1000} sn içinde bitmedi`);
    } else if (res.status !== 0) {
      const out = `${res.stdout || ''}${res.stderr || ''}`.trim().split('\n').slice(-20).join('\n');
      hatalar.push(`npm run ${name} başarısız (çıkış ${res.status}):\n${out}`);
    }
  }
  return hatalar;
}

function main() {
  if (PROFIL === 'off') return 0;
  const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
  const komut = input.tool_input?.command;
  if (typeof komut !== 'string') return 0;
  const project = resolve(process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd());

  if (/\bgit\s+commit\b/.test(komut)) {
    const gizli = gizliDosyalar(project, komut);
    if (gizli.length) {
      process.stderr.write(
        `[orkestra] Commit engellendi: gizli dosya commit'e giriyor: ${gizli.join(', ')}\n` +
          'Dosyayı çıkar (git restore --staged) ve .gitignore\'a ekle.\n',
      );
      return 2;
    }
    const hatalar = testKapisi(project);
    if (hatalar.length) {
      process.stderr.write(
        `[orkestra] Commit engellendi, önce şunlar yeşil olmalı:\n${hatalar.join('\n\n')}\n`,
      );
      return 2;
    }
    return 0;
  }

  if (/\bgit\s+push\b/.test(komut)) {
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
