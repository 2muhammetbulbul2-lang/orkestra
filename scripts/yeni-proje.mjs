#!/usr/bin/env node
// Orkestra şablonlarını hedef proje köküne kopyalar.
// Var olan dosyanın üzerine yazmaz; .claude/settings.json varsa permissions.deny listesini birleştirir.
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const pluginRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const templates = join(pluginRoot, 'templates');
const target = resolve(process.argv[2] || process.cwd());

const files = [
  ['CLAUDE.proje.md', 'CLAUDE.md'],
  ['fikir.md', 'fikir.md'],
  ['roadmap.md', 'roadmap.md'],
  ['progress.md', 'progress.md'],
  ['design-system.md', 'design-system.md'],
];

const report = { kopyalandi: [], atlandi: [], birlestirildi: [] };

for (const [src, dest] of files) {
  const out = join(target, dest);
  if (existsSync(out)) {
    report.atlandi.push(dest);
    continue;
  }
  if (src === 'CLAUDE.proje.md') {
    const text = readFileSync(join(templates, src), 'utf8').replaceAll('{{PROJE_ADI}}', basename(target));
    writeFileSync(out, text);
  } else {
    copyFileSync(join(templates, src), out);
  }
  report.kopyalandi.push(dest);
}

const settingsPath = join(target, '.claude', 'settings.json');
const templateSettings = JSON.parse(readFileSync(join(templates, 'settings.proje.json'), 'utf8'));

if (!existsSync(settingsPath)) {
  mkdirSync(dirname(settingsPath), { recursive: true });
  writeFileSync(settingsPath, JSON.stringify(templateSettings, null, 2) + '\n');
  report.kopyalandi.push('.claude/settings.json');
} else {
  let current;
  try {
    current = JSON.parse(readFileSync(settingsPath, 'utf8'));
  } catch (err) {
    console.error(`HATA: .claude/settings.json okunamadı (geçersiz JSON), dokunulmadı: ${err.message}`);
    process.exitCode = 1;
  }
  if (current) {
    current.permissions ??= {};
    const deny = current.permissions.deny ?? [];
    const added = templateSettings.permissions.deny.filter((rule) => !deny.includes(rule));
    if (added.length) {
      current.permissions.deny = [...deny, ...added];
      writeFileSync(settingsPath, JSON.stringify(current, null, 2) + '\n');
      report.birlestirildi.push(`.claude/settings.json (+${added.length} deny kuralı)`);
    } else {
      report.atlandi.push('.claude/settings.json (deny kuralları zaten var)');
    }
  }
}

console.log(`Hedef: ${target}`);
for (const [key, list] of Object.entries(report)) {
  console.log(`${key}: ${list.length ? list.join(', ') : '-'}`);
}
