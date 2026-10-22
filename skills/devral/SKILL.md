---
name: devral
description: Zaten çalışan (kodu, hafızası, yol haritası olan) bir projeyi orkestra düzenine bağlar. Projenin kendi CLAUDE.md, hafıza ve devir notlarına dokunmadan tarar, riskleri ve sahiplik önerisini raporlar; onayla yalnız eksik dosyaları (ORKESTRA.md, deny kuralları) ekler.
---

> **Orkestra özeti:** Sen ana oturumsun (orkestra): kod yazmazsın, ajan çağırmazsın, tarayıcı açmazsın. Türkçe konuş. Bu skill **salt okunur tarama + onaylı ekleme**dir; mevcut hiçbir dosyanın üzerine yazılmaz. Push, commit, deploy yok.

# /orkestra:devral

## 0. Ön kontrol
- Proje boşsa (kod, `CLAUDE.md`, `package.json` yok) dur ve `/orkestra:yeni-proje` öner.
- Proje GitHub'da ve yerel kopya eski olabilirse bunu raporun başında söyle. Uzak depo okumak için `gh api` ile **yalnız okuma** yap; kullanıcı vermediği depoya bakma.
- `.env*`, `*.pem`, `*.key`, `.dev.vars`, `secrets/`, `node_modules`, `dist`, `build`, `.wrangler` okunmaz.

## 1. Tara (salt okunur)
```
node "${CLAUDE_PLUGIN_ROOT}/scripts/devral-tara.mjs" "${CLAUDE_PROJECT_DIR}"
node "${CLAUDE_PLUGIN_ROOT}/scripts/harita.mjs" "${CLAUDE_PROJECT_DIR}"
```
Çıktıdan ayrıca şunları oku (varsa, ilk 120 satırı): projenin `CLAUDE.md`'si, yol haritası ve devir notu dosyaları. Hafıza dosyalarının **içini değil**, yalnız taramadaki boyutlarını kullan.

## 2. Raporu sun (tek mesaj, en fazla ~40 satır)
1. **Bulundu:** CLAUDE.md, yol haritası, devir notu, hafıza, test ve CI komutları.
2. **Riskler:** 1000+ satırlık dosyalar; şişmiş hafıza dosyaları ve büyük `MEMORY.md` indeksi (yalnız **uyar**: arşivleme önerisi yaz, dosyaya dokunma); `.dev.vars` gibi gizli dosya varsa deny listesine eklenmesini öner; CI yoksa veya kapalıysa söyle.
3. **Sahiplik önerisi:** üst düzey klasörleri `kod-modul` (arka uç, veri, betik, testler) ve `ekran` (istemci arayüzü) arasında böl; kök dosyalar için tek sahip ata. Yalnız öneridir.
4. **Mevcut hafıza köprüsü:** projenin kendi devir notu / yol haritası varsa orkestra onları kullanır, `progress.md` ve `roadmap.md` kopyası açılmaz; alanlar şöyle eşlenir: Başlarken, Dün ne oldu, Sırada, Açık kararlar, Test komutları. Yol haritasında **Bitti ölçütü** yoksa eksik satırları listele (yazma, sadece göster).
5. **Eklenecekler:** `ORKESTRA.md` (kurallar), `.claude/settings.json` deny kuralları (varsa yalnız eksikler), `CLAUDE.md`'ye tek satır `@ORKESTRA.md`.

Sor: **"Ekleyeyim mi? (ORKESTRA.md + deny kuralları; `CLAUDE.md`'ye `@ORKESTRA.md` satırı için ayrıca onay istiyorum.)"**

## 3. Onaydan sonra uygula
```
node "${CLAUDE_PLUGIN_ROOT}/scripts/devral-uygula.mjs" "${CLAUDE_PROJECT_DIR}"
```
- Çıktıyı kısa tablo olarak göster (kopyalanan, atlanan, birleştirilen).
- `CLAUDE.md`'ye `@ORKESTRA.md` satırını **yalnız kullanıcı ayrıca onayladıysa** dosyanın sonuna ekle; başka satıra dokunma. Onaylamadıysa satırı ona ver.
- Kullanıcı `.dev.vars` gibi ek deny kuralı isterse `.claude/settings.json`'a yalnız o kuralı ekle.

## 4. Dur
Şu satırla bitir ve **bekle**:
> Devralma bitti. Token tasarrufu için şimdi `/clear` yaz. İlk iş için küçük bir sorun varsa `/orkestra:duzelt <sorun>`, yeni özellik/faz için `/orkestra:fikir` ve `/orkestra:dagit` ile devam et.

## Kurallar
- Ajan çağırma, ürün kodu yazma, test koşma, commit/push yapma.
- Gizli değer asla rapora yazılmaz.
- Mevcut `CLAUDE.md`, hafıza, devir notu ve yol haritası dosyalarını değiştirme veya taşıma; sorun gördüysen öner.
