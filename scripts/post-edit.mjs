#!/usr/bin/env node
// PostToolUse (Edit|Write) hook: projede lint/test komutu varsa çalıştırır (bkz. ortak.mjs).
// Komut yoksa veya dosya ilgisizse sessizce çıkar. Başarısızlıkta exit 2 ile hatayı Claude'a iletir.
import { readFileSync } from 'node:fs';
import { extname, relative, resolve, isAbsolute } from 'node:path';
import { PROFIL, kapiKomutlari, kapiCalistir } from './ortak.mjs';

const SKIP_DIRS = ['node_modules', 'dist', 'build', '.wrangler', '.git'];
const SKIP_EXT = ['.md', '.json', '.txt', '.lock', '.svg', '.png', '.jpg'];
const TIMEOUT_MS = 60_000;

// ORKESTRA_HOOKS: off = hook çalışmaz · minimal = sadece lint · (boş/diğer) = lint + test
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

  const failures = kapiCalistir(project, kapiKomutlari(project), TIMEOUT_MS);
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
