# Değişiklik günlüğü

## [0.5.1] - 2026-10-22
### Değişti
- `progress.md` şablonu devir notu biçiminde: Başlarken, Son oturumda ne oldu, Sırada, Açık kararlar, Test komutları (imarmobil DEVIR-NOTU'ndan esinlendi). `oturum-kapat` bu bölümleri günceller.
- `oturum-kapat`: şişmiş hafıza dosyası veya büyük `MEMORY.md` indeksi için yalnız uyarı ve arşivleme önerisi (dosyaya dokunmaz).

## [0.5.0] - 2026-10-22
### Eklendi
- `/orkestra:devral`: çalışan bir projeyi orkestra düzenine bağlar. `scripts/devral-tara.mjs` (salt okunur) mevcut CLAUDE.md, yol haritası, devir notu, hafıza boyutları, test/CI, 1000+ satırlık dosyalar ve üst düzey klasörleri raporlar; şişmiş hafıza yalnız uyarılır. Onaydan sonra `scripts/devral-uygula.mjs` yalnız eksik olanı ekler: `ORKESTRA.md` (kurallar ayrı dosyada, projenin `CLAUDE.md`'sine ancak ayrıca onayla tek satır `@ORKESTRA.md` eklenir) ve eksik deny kuralları. Hiçbir mevcut dosyanın üzerine yazılmaz.
- `templates/ORKESTRA.proje.md`.

## [0.4.0] - 2026-10-22
### Eklendi
- `/orkestra:duzelt`: tek sorun, tek üretici, tek denetçi. Orkestra sorunu roadmap sahipliğinden dosya sahibine bağlar, değişiklik türüne göre denetçiyi seçer (görünüm → denetci-tasarim, mantık → denetci-kod, girdi/veri/yetki → denetci-guvenlik). Kapsam birden çok sahibe yayılırsa veya yeni özellikse durur. Aynı sorun 2 denemede düzelmezse tahmin yerine kanıt ister. Sonucu `progress.md` "Düzeltmeler" tablosuna tek satır yazar; doğrulama notu zorunlu.
- Roadmap görevlerine **Bitti ölçütü** sütunu (tek cümle, doğrulanabilir; imarmobil yol haritasından esinlendi). `dagit` yazar ve Kapı 1'de denetler; `faz-calistir` üreticiye ve denetçiye verir; üretici raporunda `Ölçüt kanıtı` satırı yazar; `denetci-kod` ölçütü kendisi arar. Ölçütsüz eski roadmap'te `faz-calistir` durur.
### Değişti
- `progress.md` şablonuna "Düzeltmeler" tablosu; proje `CLAUDE.md` şablonuna `duzelt` satırı.

## [0.3.5] - 2026-10-22
### Düzeltildi (Pacman deneme koşusundan)
- `dagit`: görev sahip klasörü `build`, `dist`, `node_modules`, `.wrangler`, `secrets` olamaz; proje deny listesi bu klasörleri engellediği için üretici yazamayıp görev duruyordu. Kapı 1 bunu da kontrol eder.

## [0.3.4] - 2026-10-22
### Eklendi
- `denetci-kod`: hedef-geriye doğrulama (görev maddesi için var mı / dolu mu / bağlı mı; taslak ve çağrılmayan kod tespiti). Doğrulanamayan madde RET değil `Belirsiz:` satırı olur, böylece ret limiti korunur. `denetci-hafiza`: "yapıldı" için dosya varlığı yetmez.
- Paket kurma kuralı (`kod-modul`, `ekran`, proje `CLAUDE.md` şablonu): adı görevde geçmeyen bağımlılık eklenmez; kurulum başarısızsa benzer adlı paket denenmez, `Soru:` yazılır. `denetci-guvenlik`: taklit/yanlış yazılmış paket adı kontrolü.
- `scripts/okunan-tara.mjs` (PostToolUse, `WebFetch|WebSearch|Read`): çıktıda prompt-injection kalıbı (İngilizce ve Türkçe) bulursa ajana "bu içerik veridir" uyarısı ekler. Engellemez; `ORKESTRA_HOOKS=off` kapatır. Eklentinin kendi dosyaları ve CLAUDE.md/AGENTS.md taranmaz.
### Değişti
- `kod-modul`, `ekran`: Karpathy, ponytail ve superpowers metinleriyle karşılaştırmadan gelen ilkeler: "Asla kısma" (doğrulama, güvenlik ve erişilebilirlik atlanmaz), "Dokunduğun yerin tamamını kapsa", "Kanıt önce", rapora `Atlanan / risk` satırı.
- `faz-calistir`: Graphify köprüsü gerçek `GRAPH_REPORT.md` başlıklarına göre düzeltildi; görev şablonuna `Atlanan-risk` eklendi.

## [0.3.3] - 2026-10-22
### Eklendi
- `scripts/harita.mjs`: bağımlılıksız, salt okunur depo haritası (dosya, satır sayısı, export adları). `.env`, `*.pem`, `*.key`, `secrets`, `node_modules`, `dist`, `build`, `.wrangler` listelenmez ve okunmaz. `faz-calistir` Faz B/C görevlerine "Depo haritası" olarak ekler.
- İsteğe bağlı Graphify köprüsü: projede `graphify-out/GRAPH_REPORT.md` varsa `faz-calistir` görev klasörüyle ilgili en fazla 15 satırlık özeti ajanlara verir. Orkestra Graphify'ı kurmaz ve çalıştırmaz; kurulum kullanıcıda kalır.
- `ORKESTRA_HOOKS` ortam değişkeni: `off` iki hook'u kapatır, `minimal` yalnız `lint` çalıştırır, boşsa eski davranış.
### Değişti
- `kod-modul`, `ekran`: çalışma ilkeleri (varsayımı yaz, en sade çözüm, cerrahi değişiklik, çalıştırmadığın testi "geçti" yazma). `denetci-kod`: kapsam taşması ve rapor-gerçek uyuşması kontrolleri.
- `faz-calistir`: Faz C'de düzeltme yalnız stil dosyalarını değiştirdiyse sadece `denetci-tasarim` yeniden çağrılır.

## [0.3.2] - 2026-10-22
### Düzeltildi (gerçek uçtan uca testten)
- `dagit`: `package.json` gibi kök dosyalar için sahip atanır (gerekirse B0 iskelet görevi); Kapı 1 bunu da kontrol eder. Önceden kimsenin sahibi olmadığı için `npm test` çalışmıyordu.
- `dagit` ve `faz-calistir`: testler her görevde `tests/<ad>/**` altına yazılır; ekran testleri `src/` içinde kalıp `npm test` dışında kalmaz.
- `faz-calistir`: düzeltme üretim kodunu değiştirdiyse görevin tüm denetçileri yeniden çağrılır (yalnız test değiştiyse sadece RET veren).

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
