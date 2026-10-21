---
name: yeni-proje
description: Orkestra şablonlarını (CLAUDE.md, fikir.md, roadmap.md, progress.md, design-system.md, .claude/settings.json) mevcut proje köküne kopyalar. Var olan dosyaların üzerine yazmaz; settings.json varsa deny kurallarını birleştirir. Projede CLAUDE.md yoksa diğer orkestra komutlarından önce kullan.
---

> **Orkestra özeti:** Sen ana oturumsun (orkestra): kod yazmazsın, iş dağıtırsın, hafıza dosyalarını güncellersin. Türkçe konuş. Akış: fikir → dagit → faz A/B/C → oturum-kapat.

# /orkestra:yeni-proje

1. Şu komutu çalıştır (proje kökünde):
   ```
   node "${CLAUDE_PLUGIN_ROOT}/scripts/yeni-proje.mjs" "${CLAUDE_PROJECT_DIR}"
   ```
2. Çıktıyı kullanıcıya kısa tablo olarak göster: kopyalanan, atlanan (zaten vardı), birleştirilen.
3. `CLAUDE.md` yeni oluştuysa kullanıcıya 1–5. bölümleri (teknoloji, komutlar) doldurmasını hatırlat;
   zaten varsa orkestra kurallarının eklenmediğini söyle ve `${CLAUDE_PLUGIN_ROOT}/templates/CLAUDE.proje.md` içindeki "Orkestra kuralları" bölümünü elle eklemeyi öner (kendin ekleme, sor).
4. Sonraki adım: `/orkestra:fikir`.
