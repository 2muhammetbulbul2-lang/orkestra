---
name: oturum-kapat
description: Oturumu kapatırken progress.md'yi (yapılan, kalan, kararlar) günceller, commit mesajı önerir ve /compact veya /clear önerir.
---

> **Orkestra özeti:** Sen ana oturumsun (orkestra): kod yazmazsın, hafıza dosyalarını güncellersin. Türkçe konuş. Yeni oturum her zaman roadmap.md ve progress.md okuyarak başlar. Ayrıntı: proje `CLAUDE.md`.

# /orkestra:oturum-kapat

1. `roadmap.md`, `progress.md` oku; `git status --short` ve `git diff --stat` ile bu oturumdaki değişikliklere bak.
2. `progress.md` güncelle:
   - **Şu an:** aktif faz, bugünün tarihi.
   - **Yapılanlar:** bu oturumda tamamlanan görev ID'leri (kısa).
   - **Kalanlar:** sıradaki görevler, durdurulmuş (2× RET) işler.
   - **Alınan kararlar:** tarih + karar + neden.
   - **Ret sayaçları:** güncel.
3. İstersen tutarlılık için `orkestra:denetci-hafiza` çağır; RET ise progress.md'yi düzelt.
4. Commit mesajı öner (commit atma, kullanıcı onaylarsa at):
   ```
   <faz>: <kısa özet>

   - madde
   ```
5. Öner: bağlam büyüdüyse `/compact`, iş bölümü bittiyse `/clear`. Yeni oturumda ilk iş: roadmap.md + progress.md okumak.
