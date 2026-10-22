#!/usr/bin/env node
// PostToolUse (Edit|Write) hook: projede lint/test script'i varsa çalıştırır.
// Script yoksa veya dosya ilgisizse sessizce çıkar. Başarısızlıkta exit 2 ile hatayı Claude'a iletir.
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { extname, join, relative, resolve, isAbsolute } from 'node:path';

const SKIP_DIRS = ['node_modules', 'dist', 'build', '.wrangler', '.git'];
const SKIP_EXT = ['.md', '.json', '.txt', '.lock', '.svg', '.png', '.jpg'];
const TIMEOUT_MS = 60_000;

// ORKESTRA_HOOKS: off = hook çalışmaz · minimal = sadece lint · (boş/diğer) = lint + test
const PROFIL = (process.env.ORKESTRA_HOOKS || '').toLowerCase();

function main() {
  if (PROFIL === 'off') return 0;
  const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
  const project = resolve(process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd());
  const filePath = input.tool_input?.file_path;
  if (!filePath) return 0;

  const rel = relative(project, resolve(project, filePath));
  if (rel.startsWith('..') || isAbsolute(rel)) return 0;
  if (rel.split(/[\\/]/).some((part) => SKIP_DIRS.includes(part))) return 0;
  if (SKIP_EXT.includes(extname(rel).toLowerCase())) return 0;

  const pkgPath = join(project, 'package.json');
  if (!existsSync(pkgPath)) return 0;
  const scripts = JSON.parse(readFileSync(pkgPath, 'utf8')).scripts || {};

  const failures = [];
  for (const name of PROFIL === 'minimal' ? ['lint'] : ['lint', 'test']) {
    if (!scripts[name]) continue;
    // name sabit listeden gelir; shell Windows'ta npm.cmd'yi bulmak için gerekli.
    const res = spawnSync(`npm run ${name} --silent`, {
      cwd: project,
      env: { ...process.env, CI: 'true' },
      encoding: 'utf8',
      timeout: TIMEOUT_MS,
      shell: true,
    });
    if (res.error?.code === 'ETIMEDOUT') {
      failures.push(`npm run ${name}: ${TIMEOUT_MS / 1000} sn içinde bitmedi`);
    } else if (res.status !== 0) {
      const out = `${res.stdout || ''}${res.stderr || ''}`.trim().split('\n').slice(-20).join('\n');
      failures.push(`npm run ${name} başarısız (çıkış ${res.status}):\n${out}`);
    }
  }

  if (failures.length) {
    process.stderr.write(`[orkestra] ${rel} düzenlemesinden sonra:\n${failures.join('\n\n')}\n`);
    return 2;
  }
  return 0;
}

try {
  process.exitCode = main();
} catch {
  // Hook'un kendi hatası kullanıcının işini engellememeli.
  process.exitCode = 0;
}
