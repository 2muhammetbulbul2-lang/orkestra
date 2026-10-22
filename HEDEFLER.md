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
- Küçük işler için hızlı yol (tam akışa girmeden).
- Gereksinim → görev izlenebilirliği (sabit kimlikler).
- Betikler için otomatik test (`node --test`).
