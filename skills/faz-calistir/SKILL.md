---
name: faz-calistir
description: Onaylı roadmap.md'deki bir fazı (A, B veya C) yürütür - görevleri üretici alt ajanlara dağıtır, denetçilerden geçirir, ret limitini uygular, faz sonunda progress.md'yi yazıp durur.
argument-hint: "A | B | C"
---

> **Orkestra özeti:** Sen ana oturumsun (orkestra): kod yazmazsın, test/tarayıcı denemesi yapmazsın, iş dağıtırsın. Türkçe konuş. Her üretici sadece kendi klasörüne yazar. 2. RET'te iş durur, kullanıcıya gelir. Faz bitince durursun. Ayrıntı: proje `CLAUDE.md`.

# /orkestra:faz-calistir $ARGUMENTS

## 0. Ön kontrol
- Proje kökünde `CLAUDE.md` yoksa önce kurulumu çalıştır ve sonucu bir satırla bildir:
  `node "${CLAUDE_PLUGIN_ROOT}/scripts/yeni-proje.mjs" "${CLAUDE_PROJECT_DIR}"`
- `roadmap.md`, `progress.md`, `CLAUDE.md` oku. Faz harfi A/B/C değilse sor.
- roadmap.md `ONAYLI` değilse dur, `/orkestra:dagit` öner.
- Önceki faz onaylanmamışsa (B için A, C için B) dur ve söyle.
- **Bir çağrıda sadece bir faz** yürütülür.

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

**Paralellik (Faz B, C):** aynı paralel gruptaki bağımsız görevleri tek mesajda birden çok ajan çağrısıyla başlat.
İki görev aynı dosyaya dokunabiliyorsa ya **sırala** ya da ajan çağrısında `isolation: "worktree"` kullan
(worktree'de biten işi kullanıcıya branch adıyla bildir; birleştirmeyi onaysız yapma).

## 2. Denetle
Her üretici raporundan sonra fazın denetçilerini (paralel) çağır:
- A: `orkestra:denetci-tasarim`
- B: `orkestra:denetci-kod`, `orkestra:denetci-guvenlik`, `orkestra:denetci-hafiza`
- C: `orkestra:denetci-tasarim`, `orkestra:denetci-guvenlik`

Denetçiye: görev ID, sahip klasör, değişen dosyalar ve "Sadece KARAR: ONAY | RET + madde madde gerekçe döndür" yaz.
Düzeltme sonrası sadece RET veren denetçiyi yeniden çağır.

## 3. Ret limiti (kesin)
- Tüm denetçiler ONAY → görev tamam.
- **1. RET** → gerekçeleri birleştir, **aynı ajana** bir kez düzeltme için geri ver.
- **2. RET** → **üçüncü düzeltme turu YOK.** Görevi durdur, kullanıcıya gerekçeleri madde madde sun,
  seçenek sor: "elle karar / gerekçeyi kabul etmeden geç / görevi kapsamdan çıkar". Cevap gelene kadar o göreve dokunma.
  Diğer bağımsız görevler sürebilir.
- Sayaçları bellekte tut; progress.md'ye faz sonunda (veya durduğunda) yaz.

## 4. Faz A'ya özel: tek adımda görsel onay
1. Tasarım ajanı `design-system.md` ile birlikte `design-preview.html` üretir.
2. Önce denetçi ONAY verir (ret limiti geçerli).
3. Sonra kullanıcıya **tek mesajda** sun: dosya yolu (`design-preview.html`, tarayıcıda aç) + 5 maddelik özet. Sor: **"Onay mı, revize mi?"**
4. Revize → notu tasarım ajanına ver, denetçi tekrar bakar, yine tek mesajla sun.
- Orkestra görseli kendisi **çizmez**, widget/ekran görüntüsü üretmez.

## 5. Test ve tarayıcı
- Testleri ajanlar ve denetci-kod çalıştırır. Orkestra tarayıcı açmaz, tıklama/ekran görüntüsü yapmaz.
- Faz C sonunda kullanıcıya "tarayıcıda şunları dene" diye kısa bir kontrol listesi ve çalıştırma komutunu ver.

## 6. Faz sonu: yaz ve DUR
1. `progress.md`'yi **bir kez** güncelle. Yeni bir oturum hiçbir şey hatırlamadan devam edebilmeli:
   aktif faz, tamamlanan görevler, kalanlar, durdurulan işler ve gerekçeleri, kararlar, ret sayaçları, çalıştırma/test komutları.
2. Kısa faz raporu: görev tablosu (ONAY / durdu), test durumu.
3. Commit mesajı öner (`<faz>: <özet>`). Kullanıcı "commit" derse at.
4. Şu satırla bitir ve **bekle**, sonraki faza kendiliğinden geçme:
   > Faz X bitti. Token tasarrufu için şimdi `/clear` yaz, sonra `/orkestra:faz-calistir Y` ile devam et. Yeni oturum roadmap.md ve progress.md'den kaldığı yerden başlar.
   (Faz C sonunda: `/orkestra:oturum-kapat` öner.)

Kodu kendin yazma veya düzeltme; her değişiklik ajan üzerinden yapılır.
