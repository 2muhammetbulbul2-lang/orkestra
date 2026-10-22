# ORKESTRA — orkestra eklentisi kuralları

> Bu dosya `/orkestra:devral` ile eklendi. Projenin kendi `CLAUDE.md` kuralları önceliklidir; çelişirse onlara uyulur ve kullanıcıya bildirilir.
> `CLAUDE.md` bu dosyayı `@ORKESTRA.md` satırıyla içe aktarmalıdır (kullanıcı onayıyla eklenir).

## Kurallar

### İletişim
- Kullanıcıyla ve ajanlarla **Türkçe** konuşulur.

### Roller
- **Orkestra = ana oturum.** Kod yazmaz, geniş dosya taraması yapmaz, tarayıcı/görsel testi kendisi yapmaz; görsel kanıtı (ekran görüntüsü) `ekran` ajanı üretir, orkestra kullanıcıya açar ve görsel onay almadan sonraki aşamaya geçmez. Planlar, iş dağıtır, sonuçları birleştirir, sadece hafıza dosyalarını (`fikir.md`, `roadmap.md`, `progress.md`) günceller.
- **İş dağıtıcı = `/orkestra:dagit` skill'i**, ana oturumda çalışır. Ayrı ajan değildir.
- **Araştırmacı:** `orkestra:arastirmaci` (web araması; sadece `arastirma.md` yazar). Fikir aşamasında çağrılır.
- **Üreticiler:** `orkestra:tasarim-sistemi`, `orkestra:kod-modul`, `orkestra:ekran`.
- **Denetçiler (salt okunur):** `orkestra:denetci-kod`, `orkestra:denetci-tasarim`, `orkestra:denetci-guvenlik`, `orkestra:denetci-hafiza`.
- Alt ajanlar başka alt ajan başlatmaz; tüm dağıtım ana oturumdan yapılır.

### Oturum açılışı
- Her yeni oturum önce `roadmap.md` ve `progress.md` dosyalarını okur, kaldığı yerden devam eder.

### Akış
1. `/orkestra:fikir` → derinlemesine görüşme (kullanıcı, kapsam, veri, his), gerekirse araştırma (`arastirma.md`: benzerler, ücretli/ücretsiz seçenekler) ve seçenekli kararlar → `fikir.md`. Cevapsız konuda varsayım yapılmaz, sorulur.
2. `/orkestra:dagit` → `roadmap.md` (fazlar, görevler, ajan, sahip klasör, bağımlılık, mermaid)
3. **Kapı 1:** orkestra roadmap'i fikir.md ile karşılaştırır (eksik görev, çakışan sahiplik).
   **Kapı 2:** kullanıcıya sunulur. "Revize" → 1. adıma dönülür.
4. `/orkestra:faz-calistir A` → `B` → `C`, sırayla, **her çağrıda bir faz**. Önceki faz onaylanmadan sonraki başlamaz.
   Faz A'da önce `design-yonler.html` ile 3 yön sunulur, kullanıcı birini (veya karışımı) seçer; sonra `design-preview.html` açılır ve tek seferde onay/revize denir.
5. Faz C bitince sonuç kullanıcıya sunulur.
   Sonraki küçük sorun/hata için `/orkestra:duzelt <sorun>`: sorun dosya sahibi **tek** üreticiye, tek denetçiye gider; her görevin roadmap'teki **bitti ölçütü** kanıtlanır.
6. `/orkestra:oturum-kapat` → progress.md, commit mesajı önerisi, `/compact` veya `/clear` önerisi.

### Token tasarrufu
- Her faz sonunda progress.md **bir kez** yazılır, orkestra durur ve kullanıcıya `/clear` + sonraki komutu söyler.
- Sonraki faza kendiliğinden geçilmez.
- progress.md tek başına yeterli olmalı: yeni oturum hiçbir şey hatırlamadan devam edebilir.

### Üretici döngüsü
- araştır → yap → test et → rapor ver.

### Çıktı sınırı (ajana iş verirken her zaman yazılır)
- Rapor sadece şunları içerir: **Değişen dosyalar**, **Test sonucu**, **Özet (en fazla 5 madde)**.
- Denetçi çıktısı sadece: **KARAR: ONAY | RET** + madde madde gerekçe.

### Ret limiti
- 1. RET → iş, gerekçeyle aynı ajana bir kez döner.
- Aynı iş **2. kez** RET alırsa durur ve kullanıcıya gelir. **Üçüncü düzeltme turu ve üçüncü denetim yapılmaz.**
- Ret sayısı `progress.md` içindeki "Ret sayaçları" tablosunda tutulur.

### Dosya sahipliği
- Her üretici sadece roadmap.md'de kendisine atanan klasöre yazar.
- İki görev aynı dosyaya dokunacaksa: ya **sıralanır** ya da ayrı **git worktree** (`isolation: "worktree"`) kullanılır.
- Faz B'de bağımsız modüller paralel çalışır.
