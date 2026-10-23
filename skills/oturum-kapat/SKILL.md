---
name: oturum-kapat
description: Oturumu kapatırken progress.md'yi (yapılan, kalan, kararlar) günceller, commit mesajı önerir ve /compact veya /clear önerir.
---

> **Orkestra özeti:** Sen ana oturumsun (orkestra): kod yazmazsın, hafıza dosyalarını güncellersin. Türkçe konuş. Yeni oturum her zaman roadmap.md ve progress.md okuyarak başlar. Ayrıntı: proje `CLAUDE.md`.

# /orkestra:oturum-kapat

1. `roadmap.md`, `progress.md` oku; `git status --short` ve `git diff --stat` ile bu oturumdaki değişikliklere bak.
2. `progress.md` güncelle:
   - **Başlarken / Şu an:** aktif faz, bugünün tarihi.
   - **Son oturumda ne oldu:** en fazla 5 madde.
   - **Sırada:** yeni oturumun ilk işi en üstte, numaralı.
   - **Açık kararlar:** kullanıcıdan cevap bekleyenler.
   - **Test ve çalıştırma komutları:** değiştiyse güncelle.
   - **Yapılanlar:** bu oturumda tamamlanan görev ID'leri (kısa).
   - **Kalanlar:** sıradaki görevler, durdurulmuş (2× RET) işler.
   - **Alınan kararlar:** tarih + karar + neden.
   - **Ret sayaçları:** güncel.
3. **Hafıza boyutu:** proje içinde hafıza klasörü varsa (örn. `docs/claude-memory`, `memory`) `node "${CLAUDE_PLUGIN_ROOT}/scripts/devral-tara.mjs" "${CLAUDE_PROJECT_DIR}"` çıktısındaki "Hafıza" bölümüne bak. ŞİŞMİŞ veya İNDEKS BÜYÜK uyarısı varsa kullanıcıya tek satırla bildir ve arşivleme öner; dosyalara dokunma. Hafıza klasörü yoksa atla. `progress.md` 300 satırı geçtiyse eski "Yapılanlar" maddelerini özetlemeyi öner.
4. İstersen tutarlılık için `orkestra:denetci-hafiza` çağır; RET ise progress.md'yi düzelt.
5. Commit mesajı öner (commit atma, kullanıcı onaylarsa at). **`progress.md` ve `kararlar.md` bu commit'e dahildir**; bu adımda güncellediğin hafıza dosyaları commit dışı kalmasın. `git status --short` ile bekleyen hafıza dosyası kalmadığını commit sonrası kontrol et. `kanit/` dışarıda kalır.
   ```
   <faz>: <kısa özet>

   - madde
   ```
6. Öner: bağlam büyüdüyse `/compact`, iş bölümü bittiyse `/clear`. Yeni oturumda ilk iş: roadmap.md + progress.md okumak.
