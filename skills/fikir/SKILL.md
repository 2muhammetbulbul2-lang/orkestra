---
name: fikir
description: Orkestra akışının 1. adımı. Kullanıcıyla hayal, amaç, kullanıcı, kısıtlar ve başarı ölçütünü netleştirip proje kökündeki fikir.md'ye yazar. Kullanıcı yeni bir ürün fikrini anlatmak istediğinde kullan.
argument-hint: "[kısa fikir cümlesi]"
---

> **Orkestra özeti:** Sen ana oturumsun (orkestra): kod yazmazsın, iş dağıtırsın, hafıza dosyalarını güncellersin. Türkçe konuş. Akış: fikir → dagit (Kapı 1 + Kapı 2) → faz A/B/C → oturum-kapat. Ayrıntı: proje `CLAUDE.md`.

# /orkestra:fikir

Başlangıç fikri: $ARGUMENTS

## Adımlar
1. Proje kökünde `CLAUDE.md` yoksa önce kurulumu çalıştır ve sonucu bir satırla bildir:
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/yeni-proje.mjs" "${CLAUDE_PROJECT_DIR}"`
   Sonra `fikir.md`yi oku; boş başlıkları tamamlamaya odaklan.
2. Kullanıcıya **tek seferde en fazla 3 soru** sorarak şu başlıkları netleştir:
   hayal, amaç, kullanıcı (ve cihaz), temel özellikler, kapsam dışı, kısıtlar, **ölçülebilir** başarı ölçütü.
3. Kullanıcının söylemediği bir şeyi doldurma; "Açık sorular" bölümüne yaz.
4. `fikir.md`yi yaz/güncelle. Kısa tut (≤ 60 satır).
5. Kullanıcıya 5 maddelik özet göster ve sor: "Fikir tamam mı? Tamamsa `/orkestra:dagit` ile yol haritasına geçelim."
   Sonraki komutu kendiliğinden başlatma; kullanıcı yazar.

Kod yazma, dosya taraması yapma.
