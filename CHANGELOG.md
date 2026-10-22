# Değişiklik günlüğü

## [0.3.1] - 2026-10-22
### Değişti
- `design-yonler.html`: üstte Brif (kim için, yönler hangi eksende ayrışıyor, neden) ve her yönde "Neden bu yön?" gerekçesi (renk, yazı, referans, artı/eksi). Dayanak yoksa "araştırmasız" diye işaretlenir.
- Faz A öncesi kısa görsel referans araştırması (`arastirmaci`, en fazla 3 arama); orkestra yönleri gerekçeleriyle sunar.
- `fikir`: araştırma sorusu net ve kısa sorulur, önerilen seçenek belirtilir.

## [0.3.0] - 2026-10-22
### Eklendi
- Yeni `arastirmaci` ajanı (web araması, kaynaklı `arastirma.md`): benzer ürünler, ücretli/ücretsiz seçenekler, UX ve görsel kalıplar. Fiyat doğrulanamazsa "doğrulanmadı" yazar.
- Faz A'da önce `design-yonler.html`: 3 farklı tasarım yönü yan yana, kullanıcı seçer veya karıştırır; sonra tam tasarım ve `design-preview.html`.
### Değişti
- `fikir`: derinlemesine görüşme (kullanıcı, senaryo, kapsam, veri, his), turda en fazla 4 seçenekli soru, araştırma turu ve "Kararlar" tablosu. "Açık sorular" boşalmadan fikir tamam sayılmaz.
- `fikir.md` şablonuna "Kullanıcı ve senaryo", "Veri ve gizlilik", "His ve görünüm" ve "Kararlar" bölümleri eklendi.
- `dagit`: cevapsız açık soru varsa uyarır; `arastirma.md`yi okur.
- Token dengesi: araştırma en fazla 6 arama ve 60 satır; yön aşamasında denetçi çalışmaz; küçük fikirlerde araştırma atlanabilir.

## [0.2.0] - 2026-10-22
### Düzeltildi
- `faz-calistir` ve `yeni-proje` artık model tarafından çağrılabilir. Komutlar tek mesajda verilince bu skill'ler yüklenmiyordu.
- `fikir`, `dagit` ve `faz-calistir`: projede CLAUDE.md yoksa önce kurulum script'ini çalıştırır.
- Ret limiti kesinleşti: 2. RET'ten sonra üçüncü düzeltme turu yapılmaz.
### Değişti
- Faz sonunda progress.md bir kez yazılır, orkestra durur ve `/clear` + sonraki komutu önerir (token tasarrufu).
- Orkestra tarayıcı veya görsel testi kendisi yapmaz.
- Faz A: `tasarim-sistemi` ek olarak `design-preview.html` üretir. Kullanıcı tek seferde onay veya revize verir.
- README: komutların tek tek çalıştırılması ve `/clear` adımları eklendi.

## [0.1.0] - 2026-10-22
### Eklendi
- Eklenti ve marketplace manifestleri (`orkestra@orkestra`).
- 7 alt ajan: tasarim-sistemi, kod-modul, ekran, denetci-kod, denetci-tasarim, denetci-guvenlik, denetci-hafiza.
- 5 skill: yeni-proje, fikir, dagit, faz-calistir, oturum-kapat.
- Hook'lar: düzenleme sonrası lint/test, Stop'ta progress.md hatırlatması.
- Proje şablonları ve doldurulmuş örnekler.
