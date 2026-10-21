---
name: faz-calistir
description: Onaylı roadmap.md'deki bir fazı (A, B veya C) yürütür - görevleri üretici alt ajanlara dağıtır, denetçilerden geçirir, ret limitini uygular, sonucu progress.md'ye yazar.
argument-hint: "A | B | C"
disable-model-invocation: true
---

> **Orkestra özeti:** Sen ana oturumsun (orkestra): kod yazmazsın, iş dağıtırsın, sonuçları birleştirirsin. Türkçe konuş. Her üretici sadece kendi klasörüne yazar. Aynı iş 2. kez RET alırsa durur, kullanıcıya gelir. Ayrıntı: proje `CLAUDE.md`.

# /orkestra:faz-calistir $ARGUMENTS

## 0. Ön kontrol
- `roadmap.md`, `progress.md`, `CLAUDE.md` oku. Faz harfi A/B/C değilse sor.
- roadmap.md `ONAYLI` değilse dur, `/orkestra:dagit` öner.
- Önceki faz onaylanmamışsa (B için A, C için B) dur ve söyle.

## 1. Dağıt
Fazın görevlerini bağımlılık sırasına göre al. Her görev için ilgili ajanı çağır:
- A → `orkestra:tasarim-sistemi` · B → `orkestra:kod-modul` · C → `orkestra:ekran`

Görev metni her zaman şunları içerir:
```
Görev ID / modül veya ekran adı:
Sahip olduğun klasör: (sadece buraya yaz)
Yapılacaklar: (roadmap.md'den)
Önceki RET gerekçesi: (varsa)
Çıktı sınırı: Sadece "Değişen dosyalar / Test sonucu / Özet (en fazla 5 madde)" döndür.
```

**Paralellik (Faz B):** aynı paralel gruptaki bağımsız görevleri tek mesajda birden çok ajan çağrısıyla başlat.
İki görev aynı dosyaya dokunabiliyorsa ya **sırala** ya da ajan çağrısında `isolation: "worktree"` kullan
(worktree'de biten işi kullanıcıya branch adıyla bildir; birleştirmeyi onaysız yapma).

## 2. Denetle
Her üretici raporundan sonra fazın denetçilerini (mümkünse paralel) çağır:
- A: `orkestra:denetci-tasarim`
- B: `orkestra:denetci-kod`, `orkestra:denetci-guvenlik`, `orkestra:denetci-hafiza`
- C: `orkestra:denetci-tasarim`, `orkestra:denetci-guvenlik`

Denetçiye: görev ID, sahip klasör, değişen dosyalar ve "Sadece KARAR: ONAY | RET + madde madde gerekçe döndür" yaz.

## 3. Ret limiti
- Tüm denetçiler ONAY → görev tamam.
- Herhangi biri RET → progress.md "Ret sayaçları"nda sayacı 1 artır, gerekçeleri birleştirip **aynı ajana** geri ver.
- Sayaç **2** olursa: o görevi durdur, kullanıcıya gerekçelerle sun, karar bekle. Diğer bağımsız görevler sürebilir.

## 4. Kapanış
- progress.md'yi güncelle: yapılanlar, kalanlar, kararlar, aktif faz.
- Kullanıcıya kısa faz raporu ver: görev tablosu (ONAY/RET/durdu), değişen dosyalar, test durumu.
- Sonraki adımı öner: A → `faz-calistir B`, B → `faz-calistir C`, C → **sonucu kullanıcıyla birlikte değerlendir** ve `/orkestra:oturum-kapat`.

Kodu kendin yazma veya düzeltme; her değişiklik ajan üzerinden yapılır.
