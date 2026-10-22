#!/usr/bin/env node
// Stop hook: progress.md bu oturumda güncellenmediyse hatırlatma yazar. Asla engellemez (her zaman exit 0).
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

try {
  const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
  if (!input.stop_hook_active && (process.env.ORKESTRA_HOOKS || '').toLowerCase() !== 'off') {
    const project = resolve(process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd());
    const progress = join(project, 'progress.md');
    if (existsSync(progress) && input.transcript_path && existsSync(input.transcript_path)) {
      const t = statSync(input.transcript_path);
      const sessionStart = t.birthtimeMs || t.ctimeMs;
      if (statSync(progress).mtimeMs < sessionStart) {
        process.stdout.write(JSON.stringify({
          systemMessage: 'Orkestra: progress.md bu oturumda güncellenmedi. Kapatmadan önce /orkestra:oturum-kapat çalıştırabilirsin.',
        }));
      }
    }
  }
} catch {
  // Sessizce geç.
}
process.exitCode = 0;
