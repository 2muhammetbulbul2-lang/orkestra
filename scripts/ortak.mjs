// post-edit.mjs ve git-kapi.mjs için ortak: projenin lint/test komutlarını bulur ve çalıştırır.
// Öncelik: .orkestra/komutlar.json > package.json script'leri > (yalnız commit kapısında) Cargo/Go.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

export const PROFIL = (process.env.ORKESTRA_HOOKS || '').toLowerCase();

function okuJson(yol) {
  try {
    return JSON.parse(readFileSync(yol, 'utf8'));
  } catch {
    return null;
  }
}

// otomatik: package.json olmayan projede Cargo.toml/go.mod'dan komut türet (yalnız commit kapısı;
// her düzenlemede cargo/go çalıştırmak çok yavaş olur).
export function kapiKomutlari(project, { otomatik = false } = {}) {
  const adlar = PROFIL === 'minimal' ? ['lint'] : ['lint', 'test'];
  const ozel = okuJson(join(project, '.orkestra', 'komutlar.json')) || {};
  const pkg = existsSync(join(project, 'package.json')) ? okuJson(join(project, 'package.json')) : null;
  const scripts = pkg?.scripts || {};
  const varsayilan = {};
  if (!pkg && otomatik) {
    if (existsSync(join(project, 'Cargo.toml'))) {
      varsayilan.lint = 'cargo clippy --quiet -- -D warnings';
      varsayilan.test = 'cargo test --quiet';
    } else if (existsSync(join(project, 'go.mod'))) {
      varsayilan.lint = 'go vet ./...';
      varsayilan.test = 'go test ./...';
    }
  }
  const sonuc = [];
  for (const ad of adlar) {
    if (typeof ozel[ad] === 'string' && ozel[ad].trim()) sonuc.push({ ad, komut: ozel[ad] });
    else if (scripts[ad]) sonuc.push({ ad, komut: `npm run ${ad} --silent` });
    else if (varsayilan[ad]) sonuc.push({ ad, komut: varsayilan[ad] });
  }
  return sonuc;
}

// Başarısız olanların açıklamasını döndürür (boş dizi = hepsi yeşil).
export function kapiCalistir(project, komutlar, timeoutMs) {
  const hatalar = [];
  for (const { ad, komut } of komutlar) {
    // shell Windows'ta npm.cmd'yi bulmak için gerekli; komut proje dosyasından (package.json,
    // .orkestra/komutlar.json) veya sabit listeden gelir, kullanıcı girdisinden değil.
    const res = spawnSync(komut, {
      cwd: project,
      env: { ...process.env, CI: 'true' },
      encoding: 'utf8',
      timeout: timeoutMs,
      shell: true,
    });
    if (res.error?.code === 'ETIMEDOUT') {
      hatalar.push(`${ad} (${komut}): ${timeoutMs / 1000} sn içinde bitmedi`);
    } else if (res.error) {
      hatalar.push(`${ad} (${komut}) çalıştırılamadı: ${res.error.message}`);
    } else if (res.status !== 0) {
      const out = `${res.stdout || ''}${res.stderr || ''}`.trim().split('\n').slice(-20).join('\n');
      hatalar.push(`${ad} (${komut}) başarısız (çıkış ${res.status}):\n${out}`);
    }
  }
  return hatalar;
}
