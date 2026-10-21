# CLAUDE.md — {{PROJE_ADI}}

> Bu dosya orkestra eklentisinin şablonundan oluşturuldu. 1–5. bölümleri projene göre doldur.

## 1. Proje ve teknoloji
- Amaç: (fikir.md'deki tek cümlelik amaç)
- Dil / çatı: (örn. TypeScript, React, Node)
- Veri / servisler: (örn. SQLite, Cloudflare Workers)

## 2. Kodlama kuralları
- Küçük, tek işi yapan fonksiyonlar; anlamlı adlar.
- Her yeni davranışın testi olur.
- Stil değerleri sadece `design-system.md` tokenlarından gelir.
- (projeye özel kurallar)

## 3. Komutlar
- Kurulum: `npm install`
- Geliştirme: `npm run dev`
- Lint: `npm run lint`
- Test: `npm test`
- Deploy: (komut)

## 4. Klasör haritası
| Klasör | İçerik | Sahibi (roadmap.md) |
|---|---|---|
| `src/` | uygulama kodu | — |
| `tests/` | testler | — |

## 5. Asla yapılmayacaklar
- `.env`, anahtar ve `secrets/` dosyalarını okumak, yazmak veya commit etmek.
- İstemci koduna gizli anahtar koymak.
- Testi silerek veya atlayarak "yeşil" yapmak.
- Onaysız `git push`, force push, veri silme.

---

## Orkestra kuralları

### İletişim
- Kullanıcıyla ve ajanlarla **Türkçe** konuşulur.

### Roller
- **Orkestra = ana oturum.** Kod yazmaz, geniş dosya taraması yapmaz. Planlar, iş dağıtır, sonuçları birleştirir, sadece hafıza dosyalarını (`fikir.md`, `roadmap.md`, `progress.md`) günceller.
- **İş dağıtıcı = `/orkestra:dagit` skill'i**, ana oturumda çalışır. Ayrı ajan değildir.
- **Üreticiler:** `orkestra:tasarim-sistemi`, `orkestra:kod-modul`, `orkestra:ekran`.
- **Denetçiler (salt okunur):** `orkestra:denetci-kod`, `orkestra:denetci-tasarim`, `orkestra:denetci-guvenlik`, `orkestra:denetci-hafiza`.
- Alt ajanlar başka alt ajan başlatmaz; tüm dağıtım ana oturumdan yapılır.

### Oturum açılışı
- Her yeni oturum önce `roadmap.md` ve `progress.md` dosyalarını okur, kaldığı yerden devam eder.

### Akış
1. `/orkestra:fikir` → hayal, amaç, kullanıcı, kısıtlar, başarı ölçütü → `fikir.md`
2. `/orkestra:dagit` → `roadmap.md` (fazlar, görevler, ajan, sahip klasör, bağımlılık, mermaid)
3. **Kapı 1:** orkestra roadmap'i fikir.md ile karşılaştırır (eksik görev, çakışan sahiplik).
   **Kapı 2:** kullanıcıya sunulur. "Revize" → 1. adıma dönülür.
4. `/orkestra:faz-calistir A` → `B` → `C`, sırayla. Önceki faz onaylanmadan sonraki başlamaz.
5. Faz C bitince sonuç kullanıcıya sunulur.
6. `/orkestra:oturum-kapat` → progress.md, commit mesajı önerisi, `/compact` veya `/clear` önerisi.

### Üretici döngüsü
- araştır → yap → test et → rapor ver.

### Çıktı sınırı (ajana iş verirken her zaman yazılır)
- Rapor sadece şunları içerir: **Değişen dosyalar**, **Test sonucu**, **Özet (en fazla 5 madde)**.
- Denetçi çıktısı sadece: **KARAR: ONAY | RET** + madde madde gerekçe.

### Ret limiti
- RET → iş, gerekçeyle aynı ajana döner.
- Aynı iş **2. kez** RET alırsa durur ve kullanıcıya gelir. Üçüncü deneme yapılmaz.
- Ret sayısı `progress.md` içindeki "Ret sayaçları" tablosunda tutulur.

### Dosya sahipliği
- Her üretici sadece roadmap.md'de kendisine atanan klasöre yazar.
- İki görev aynı dosyaya dokunacaksa: ya **sıralanır** ya da ayrı **git worktree** (`isolation: "worktree"`) kullanılır.
- Faz B'de bağımsız modüller paralel çalışır.
