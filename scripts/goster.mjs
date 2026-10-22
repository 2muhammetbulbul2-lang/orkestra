#!/usr/bin/env node
// Görsel onay kapısı: kanıt dosyalarını (PNG/JPG/HTML) kullanıcının varsayılan görüntüleyicisinde açar.
// Bir görüntüyü Read ile okumak yalnız ajana gösterir; kullanıcının görmesi için bu betik gerekir.
// Yalnız proje kökü içindeki .png/.jpg/.jpeg/.html dosyalarını açar. Dosya yazmaz, ağ yok.
// Kullanım: node goster.mjs <projeKökü> <dosya> [dosya...]
import { spawn } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { extname, isAbsolute, relative, resolve } from 'node:path';

const IZINLI = new Set(['.png', '.jpg', '.jpeg', '.html']);
const [kokArg, ...dosyalar] = process.argv.slice(2);
if (!kokArg || !dosyalar.length) {
  console.error('Kullanım: node goster.mjs <projeKökü> <dosya> [dosya...]');
  process.exit(1);
}
const kok = resolve(kokArg);

function ac(yol) {
  const [komut, args] =
    process.platform === 'win32' ? ['cmd', ['/c', 'start', '', yol]]
    : process.platform === 'darwin' ? ['open', [yol]]
    : ['xdg-open', [yol]];
  const cocuk = spawn(komut, args, { stdio: 'ignore', detached: true, windowsHide: true });
  cocuk.on('error', () => {});
  cocuk.unref();
}

let sorun = 0;
for (const d of dosyalar) {
  const tam = resolve(kok, d);
  const gorece = relative(kok, tam);
  if (gorece.startsWith('..') || isAbsolute(gorece)) { console.log(`ATLANDI (proje dışı): ${d}`); sorun++; continue; }
  if (!IZINLI.has(extname(tam).toLowerCase())) { console.log(`ATLANDI (tür izinli değil): ${d}`); sorun++; continue; }
  if (!existsSync(tam) || !statSync(tam).isFile()) { console.log(`ATLANDI (yok): ${d}`); sorun++; continue; }
  ac(tam);
  console.log(`AÇILDI: ${gorece.split('\\').join('/')}`);
}
process.exitCode = sorun ? 2 : 0;
