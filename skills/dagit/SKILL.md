---
name: dagit
description: Orkestra iş dağıtıcısı. fikir.md'den fazlar, görevler, ajanlar, dosya sahipliği, bağımlılıklar ve mermaid diyagramı içeren roadmap.md üretir; Kapı 1 (tutarlılık) ve Kapı 2 (kullanıcı onayı) uygular.
argument-hint: "[revize notu]"
---

> **Orkestra özeti:** Sen ana oturumsun (orkestra): kod yazmazsın, iş dağıtırsın, hafıza dosyalarını güncellersin. Türkçe konuş. Dağıtım her zaman ana oturumda yapılır; alt ajanlar alt ajan başlatmaz. Her üretici sadece kendi klasörüne yazar. Ayrıntı: proje `CLAUDE.md`.

# /orkestra:dagit

Revize notu (varsa): $ARGUMENTS

## 1. Hazırlık
- `fikir.md` ve `CLAUDE.md` oku. fikir.md yoksa dur ve `/orkestra:fikir` öner.
- Varsa mevcut `roadmap.md` ve `progress.md` oku (revize ise sürümü 1 artır).

## 2. roadmap.md üret
`${CLAUDE_PLUGIN_ROOT}/templates/roadmap.md` biçimini kullan:
- **Faz A:** tek görev, ajan `tasarim-sistemi`, sahip `design-system.md`.
- **Faz B:** fikir.md'deki her özellik için bağımsız modüller; ajan `kod-modul`; her modüle **ayrı** klasör (örn. `src/todos/**`).
- **Faz C:** ekranlar; ajan `ekran`; her ekrana ayrı klasör.
- Her görev: ID, faz, ajan, sahip klasör, bağımlılık, denetçiler
  (A: denetci-tasarim · B: denetci-kod + denetci-guvenlik + denetci-hafiza · C: denetci-tasarim + denetci-guvenlik).
- Paralel gruplar ve çakışma notu. Mermaid `flowchart` ile bağımlılık diyagramı.
- Durum: `TASLAK`.

## 3. Kapı 1 — orkestra kontrolü
roadmap.md'yi fikir.md ile karşılaştır ve kullanıcıya kısaca raporla:
- fikir.md'deki her temel özellik en az bir göreve karşılık geliyor mu? (eksik görev)
- Kapsam dışı bir şey görev olmuş mu?
- İki görevin sahip klasörü çakışıyor mu? Çakışıyorsa: sırala (bağımlılık ekle) veya `worktree` notu düş.
- Döngüsel bağımlılık var mı?
Sorun varsa roadmap.md'yi düzelt ve Kapı 1'i tekrarla. Sonucu "Kapı kayıtları"na yaz.

## 4. Kapı 2 — kullanıcı onayı
Kullanıcıya göster: görev tablosu + mermaid + Kapı 1 sonucu. Sor: **"Onay mı, revize mi?"**
- **Onay:** durumu `ONAYLI` yap, Kapı 2'ye tarih yaz, progress.md'de "Aktif faz: A" yap. `/orkestra:faz-calistir A` öner.
- **Revize:** notu al, **2. adıma dön**. Kullanıcı fikri değiştirmek isterse `/orkestra:fikir` öner.

Kod yazma; sadece roadmap.md ve progress.md'yi güncelle.
