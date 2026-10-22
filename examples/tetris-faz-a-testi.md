# Tetris: Faz A gerçek koşu testi (HAZIR, ÇALIŞTIRILMADI)

Amaç: `fikir` → `dagit` → `faz-calistir A` zincirini küçük bir oyunla denemek. v0.10.0 geri bildirim soruları ve `denetci-tasarim` Faz A denetimi burada sınanır. Kota sıfırlanınca ya da kullanıcı onay verince başlar.

## Hazırlık
1. Boş bir klasör aç (örn. `~/orkestra-tetris`), Claude Code'u orada başlat, eklentiyi `--plugin-dir` ile yükle.
2. `/orkestra:yeni-proje` çalıştır.

## Adımlar ve beklenen sonuç
| Adım | Komut | Neye bakılır |
|---|---|---|
| 1 | `/orkestra:fikir tetris oyunu, tarayıcıda, tek kişilik` | "Geri bildirim ve tepki" sorusu soruldu mu? `fikir.md` "His ve görünüm > Geri bildirim" doldu mu? R numaraları var mı? |
| 2 | `/orkestra:dagit` | `roadmap.md` oluştu mu, ölçütlerde (R1) var mı, CLAUDE.md 1-4. bölümleri dolduruldu mu (2b)? Kapı 1 ve 2 işledi mi? |
| 3 | `/orkestra:faz-calistir A` | `design-system.md` + `design-preview.html` üretildi mi, `denetci-tasarim` Faz A kararı geldi mi, progress.md "Şu an" yazıldı mı? |

## Önerilen fikir cevapları (soruldukça kullan)
- Kullanıcı: bilgisayarda kısa mola veren yetişkin. Cihaz: masaüstü, klavye.
- Özellikler: 7 parça, döndürme, satır silme, skor, seviye hızı, oyun bitti ekranı.
- Kapsam dışı: çok oyunculu, hesap, çevrimiçi skor tablosu.
- Veri: yalnız cihazda en yüksek skor (localStorage).
- His: sakin, koyu tema. Geri bildirim: satır silinince kısa parlama + skor artışı, parça yerleşince hafif ses, oyun bitince ekran kararır.
- R1: Satır silme tepkisi 200 ms içinde görünür. R2: Klavye ile tam oynanır.

## Maliyet notu
Yalnız Faz A: hafif-orta (tek üretici + tek denetçi). Faz B ve C bu testin dışında.
