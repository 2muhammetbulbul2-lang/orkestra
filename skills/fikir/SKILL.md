---
name: fikir
description: Orkestra akışının 1. adımı. Kullanıcıyla derinlemesine görüşüp (kullanıcı, kapsam, veri, his), gerekirse araştırmacıya benzer ürün ve ücretli/ücretsiz alternatifleri araştırtıp seçenekler sunar; sonucu proje kökündeki fikir.md'ye yazar. Kullanıcı yeni bir ürün fikrini anlatmak istediğinde kullan.
argument-hint: "[kısa fikir cümlesi]"
---

> **Orkestra özeti:** Sen ana oturumsun (orkestra): kod yazmazsın, iş dağıtırsın, hafıza dosyalarını güncellersin. Türkçe konuş. Akış: fikir → dagit (Kapı 1 + Kapı 2) → faz A/B/C → oturum-kapat. Ayrıntı: proje `CLAUDE.md`.

# /orkestra:fikir

Başlangıç fikri: $ARGUMENTS

Amaç: kullanıcının aklındakini **tahmin etmeden** öğrenmek ve seçimleri ona göstermek. Cevaplanmamış hiçbir şeyi varsayma.

## Adımlar
1. Proje kökünde `CLAUDE.md` yoksa önce kurulumu çalıştır ve sonucu bir satırla bildir:
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/yeni-proje.mjs" "${CLAUDE_PROJECT_DIR}"`
   Sonra `fikir.md`yi oku; boş başlıkları tamamlamaya odaklan.

2. **Tur 1 — görüşme.** Aşağıdaki başlıkları turlar halinde sor, **her turda en fazla 4 soru**. Mümkün olan her yerde cevabı **seçenekli** sor (`AskUserQuestion`; seçenek yoksa kısa açık soru). Kullanıcı "bilmiyorum" derse "Açık sorular"a yaz, uydurma.
   - **Kullanıcı ve senaryo:** kim, hangi anda, hangi cihazda, bugün bunu nasıl çözüyor?
   - **Temel özellikler ve kapsam dışı:** ilk sürümde mutlaka olacaklar, bilerek dışarıda bırakılanlar.
   - **Veri ve gizlilik:** ne saklanıyor, nerede (cihaz / sunucu), hesap gerekir mi, hassas veri var mı?
   - **Platform ve kısıtlar:** web / mobil / masaüstü, çevrimdışı çalışma, süre, bütçe, mevcut teknoloji.
   - **His ve görünüm (zorunlu, geçilmez):** (a) en az bir **benzesin** referansı (uygulama/oyun/site adı veya görsel) ve gerekirse **benzemesin**; (b) ürünün karakterini taşıyan en az bir soru: "Bu ürün tek kelimeyle nasıl hissettirmeli? Ekranda akılda kalacak tek şey ne olsun (renk, şekil, yazı, hareket)?". "Sade, sakin" tek başına yeterli cevap sayılmaz; "neye benzesin" diye bir kez daha sor. Cevap yoksa "Açık sorular"a yaz ve Faz A'da araştırmacıdan görsel referans iste.
   - **Geri bildirim ve tepki** (oyun, animasyon, etkileşimli ürün varsa mutlaka sor): kullanıcı bir eylem yapınca (dokunma, tuş, yeme, vurma, ölme, kaydetme, hata) ne görmeli/duymalı/hissetmeli? Tepki ne kadar hızlı olmalı (anında / kısa animasyon)? Başarı ve hata için ayrı geri bildirim var mı (görsel, ses, titreşim)? Cevapları fikir.md "His ve görünüm > Geri bildirim" altına eylem → tepki biçiminde yaz; bilinmiyorsa "Açık sorular"a.
   - **Ön-ölüm analizi (pre-mortem):** "Bu ürün 6 ay sonra başarısız olduysa en olası neden ne olurdu?" diye sor; kullanıcının cevaplarına senin gördüğün riskleri ekle (kullanıcı, veri, maliyet, teknik, bakım). En az 3 neden; her biri için önlem veya erken uyarı işareti. fikir.md "Riskler (pre-mortem)" altına yaz; `dagit` yüksek riskli özellikleri "Tasarım gerektiren görevler"e almak için bunu kullanır.
   - **Başarı ölçütü:** ölçülebilir olmalı. Her maddeyi fikir.md'de sabit numarayla yaz (R1, R2...). Sonradan numara değiştirme; madde silinirse numarası boş kalır.

3. **Araştırma turu.** Konu benzer ürünler, hazır bileşen/servis seçimi (ücretsiz mi ücretli mi) veya görsel referans gerektiriyorsa `orkestra:arastirmaci` ajanını çağır. Görev metni:
   ```
   Fikir: (fikir.md'den 2 cümle)
   Araştırılacak konular: (3-4 madde: benzer ürünler, seçilecek bileşenler, UX/görsel kalıplar)
   Çıktı sınırı: Sadece "Değişen dosyalar / Özet (en fazla 5 madde)" döndür.
   ```
   - Araştırmayı kullanıcıya **net ve kısa** sor, belirsiz sorular sorma. Örnek: "Benzer ürünlere ve ücretli/ücretsiz seçeneklere bakıp 1 sayfalık, kaynaklı bir özet çıkarayım mı? (yaklaşık 1-2 dk). Önerim: evet." Seçenekler: Evet (önerilen) / Hayır.
   - Kullanıcı "hayır" derse veya fikir çok küçükse bu adımı atla, bir satırla söyle ve `fikir.md` "Kararlar"a "Araştırma: yapılmadı" yaz. (Faz A'da yalnız kısa bir görsel referans araştırması yine önerilir.)
   - Orkestra web'de kendisi aramaz; sonucu `arastirma.md`den okur.

4. **Tur 2 — seçimler.** `arastirma.md`deki "Kullanıcıya sorulacaklar"ı ve tabloları kullanıcıya **kısa** sun: seçenekler, ücretsiz/ücretli farkı, artı/eksi, kaynak. Seçenekli sor. Verilen kararları `fikir.md` "Kararlar" tablosuna yaz (karar, seçilen, neden).

5. `fikir.md`yi yaz/güncelle (≤ 80 satır). Kullanıcının söylemediğini doldurma.
   **"Açık sorular" boşalmadan "tamam" önerme**: kalan soruları sor veya kullanıcıdan "açık kalsın" onayı al.

6. Kullanıcıya 5 maddelik özet göster ve sor: "Fikir tamam mı? Tamamsa `/orkestra:dagit` ile yol haritasına geçelim."
   Sonraki komutu kendiliğinden başlatma; kullanıcı yazar.

Kod yazma, dosya taraması yapma. Soruları kısa tut; aynı şeyi iki kez sorma.
