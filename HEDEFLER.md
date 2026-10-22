# Hedefler

Sıra: önce gerçek çalıştırma, sonra buradaki maddeler. Hiçbiri kullanıcı onayı olmadan başlamaz.

## 1. Bağımsız bağlam-haritası skill'i (orkestradan ayrı repo)
- Graphify'ın yaptığı işin hafif, bağımlılıksız sürümü. Yol A: Graphify kodu incelenir, mantık anlaşılır, kod **sıfırdan** yazılır (kopyalanmaz).
- Orkestrayla uyumlu bağlanır: `graphify-out/GRAPH_REPORT.md` başlıklarını üretir, `faz-calistir` köprüsü değişmeden okur.
- Başlamadan önce: Graphify lisansı okunur, makinede Python olup olmadığına bakılır (yoksa Node ile yazılır).
- Orkestra "evet, istediğimiz gibi çalışıyor" dedikten sonra yapılır.

## 2. Büyük repolarla karşılaştırmadan çıkan aday boşluklar (2026-10-22)
Kaynak: GSD, spec-kit, gstack, BMAD, wshobson/agents, ECC. Hangileri yapılacağı kullanıcı kararıdır.
- ~~Hedef-geriye doğrulama~~, ~~paket kurulumu kuralı~~, ~~injection taraması~~: v0.3.4'te eklendi (gerçek çalıştırmada etkisi denenecek).
- ~~Faz C için "hedef-geriye" eşdeğeri~~: v0.6.1'de `denetci-tasarim` Faz C'ye eklendi (ekran ulaşılıyor mu, dolu mu, bağlı mı; doğrulanamayan `Belirsiz:` olarak "tarayıcıda dene" listesine gider). Gerçek koşuda etkisi denenecek.
- ~~Görsel teyit~~ → v0.6.0'da yapıldı (Görsel onay kapısı: `ekran` MOD: KANIT + `goster.mjs`, imarmobil'in "ekran görüntüsü göster, onay al" kuralı). Kalan: gerçek Playwright ile uçtan uca koşu, etkileşim/oyun hissi kanıtı.
- ~~Faz A önizleme kalitesi~~ v0.11.0 (Tetris denemesinden): önizleme betiksiz görünür, ayırt edici karakter, `fikir`de zorunlu referans/karakter sorusu. Gerçek koşuda denenecek (Tetris Faz A yeniden).
- ~~Modül tasarım dosyası (Faz 0)~~ v0.12.0: riskli Faz B görevleri için `tasarim/<ID>.md` (seçenek, pre-mortem, vazgeçme, test planı) + onay. Gerçek koşuda denenecek.
- ~~Oyun hissi / geri bildirim~~ v0.10.0'da eklendi (gerçek koşuda denenecek). Eski not: `fikir` "his" soruları tepki hızı ve eylem geri bildirimini (yeme, ölme, vurma) sormadı; Faz C denetçileri "eylem → görsel tepki" aramadı. Eklenecek: `fikir` şablonuna geri bildirim soruları, `denetci-tasarim` Faz C'ye eylem-tepki kontrolü.
- **Headless koşu bulguları:** (1) ~~v0.10.0'da yapıldı~~ (2) hâlâ açık, kullanıcı onayı gerekir. Eski not: (1) `progress.md` bekleyen görevleri (v2 C4/C5) yazmazsa `faz-calistir` "hepsi bitti" der; faz bitiminde ve roadmap revizyonunda progress.md "Şu an"ı güncellemek skill'e yazılmalı. (2) Arka plan ajanı Edit izni olmadan başlarsa durur; yeni proje kurulumunda sahip klasörler için `permissions.allow` eklemek düşünülebilir (kullanıcı onayıyla).
- ~~Küçük işler için hızlı yol~~: v0.4.0 `duzelt` skill'i (gerçek çalıştırmada denenecek).
- Gereksinim → görev izlenebilirliği: bitti ölçütü v0.4.0'da eklendi; fikir.md başarı ölçütü → görev bağı Kapı 1'de kontrol ediliyor, ~~sabit gereksinim kimlikleri (R1, R2...)~~ v0.7.0'da eklendi (fikir.md numaralar, roadmap ölçütünde "(R1)", Kapı 1 eşleşmeyi kontrol eder). Gerçek koşuda denenecek.
- ~~Hook ile zorlanan kurallar~~ (CI kırmızıyken commit yok, gizli dosya commit engeli, push öncesi uyarı): v0.8.0'da `git-kapi.mjs` ile eklendi. Gerçek Claude oturumunda hook'un tetiklenmesi sınanmadı.
- ~~`dagit` CLAUDE.md bölümlerini doldurmuyor~~: v0.9.0'da 2b adımı eklendi (gerçek koşuda denenecek).
- ~~Betikler için otomatik test (`node --test`)~~: v0.7.1'de eklendi (25 test). Playwright ile gerçek ekran görüntüsü ve görüntüleyici açma sınanmadı.
