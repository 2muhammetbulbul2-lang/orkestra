#!/usr/bin/env node
// Devralma kurulumu: yalnız eksik olanı ekler, hiçbir mevcut dosyanın üzerine yazmaz.
//  - ORKESTRA.md (kurallar ayrı dosyada; projenin CLAUDE.md'sine dokunulmaz)
//  - .claude/settings.json: yoksa oluşturur, varsa yalnız eksik deny kurallarını ekler
// Kullanım: node devral-uygula.mjs [projeKökü]
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const pluginRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const templates = join(pluginRoot, 'templates');
const target = resolve(process.argv[2] || process.cwd());
const report = { kopyalandi: [], atlandi: [], birlestirildi: [] };

const orkestraMd = join(target, 'ORKESTRA.md');
if (existsSync(orkestraMd)) report.atlandi.push('ORKESTRA.md');
else {
  copyFileSync(join(templates, 'ORKESTRA.proje.md'), orkestraMd);
  report.kopyalandi.push('ORKESTRA.md');
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
    } else report.atlandi.push('.claude/settings.json (deny kuralları zaten var)');
  }
}

console.log(`Hedef: ${target}`);
for (const [key, list] of Object.entries(report)) console.log(`${key}: ${list.length ? list.join(', ') : '-'}`);
