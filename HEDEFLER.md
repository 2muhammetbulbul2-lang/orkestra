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
- Faz C için "hedef-geriye" eşdeğeri: ekran gerçekten bağlı ve çalışıyor mu (şimdilik yalnız denetci-kod/hafiza bakıyor).
- **Görsel teyit (kullanıcı isteği, Pacman denemesi):** tasarım ve ekran ajanları sayfayı görmeden onay veriyor; sonuç görsel kanıtla (ekran görüntüsü) teyit edilip sunulmalı. Çakışma: orkestra şu an tarayıcı/görsel test yapmıyor. Çözüm tasarlanacak (görsel doğrulama adımı, hangi araç, hangi ajan).
- **Oyun hissi / geri bildirim (Pacman denemesi, kullanıcı oynadıktan sonra):** `fikir` "his" soruları tepki hızı ve eylem geri bildirimini (yeme, ölme, vurma) sormadı; Faz C denetçileri "eylem → görsel tepki" aramadı. Eklenecek: `fikir` şablonuna geri bildirim soruları, `denetci-tasarim` Faz C'ye eylem-tepki kontrolü.
- **Headless koşu bulguları:** (1) `progress.md` bekleyen görevleri (v2 C4/C5) yazmazsa `faz-calistir` "hepsi bitti" der; faz bitiminde ve roadmap revizyonunda progress.md "Şu an"ı güncellemek skill'e yazılmalı. (2) Arka plan ajanı Edit izni olmadan başlarsa durur; yeni proje kurulumunda sahip klasörler için `permissions.allow` eklemek düşünülebilir (kullanıcı onayıyla).
- ~~Küçük işler için hızlı yol~~: v0.4.0 `duzelt` skill'i (gerçek çalıştırmada denenecek).
- Gereksinim → görev izlenebilirliği: bitti ölçütü v0.4.0'da eklendi; fikir.md başarı ölçütü → görev bağı Kapı 1'de kontrol ediliyor, sabit gereksinim kimlikleri (R1, R2...) kaldı.
- Betikler için otomatik test (`node --test`).
