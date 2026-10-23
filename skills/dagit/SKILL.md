---
name: dagit
description: Orkestra iş dağıtıcısı. fikir.md'den fazlar, görevler, ajanlar, dosya sahipliği, bağımlılıklar ve mermaid diyagramı içeren roadmap.md üretir; Kapı 1 (tutarlılık) ve Kapı 2 (kullanıcı onayı) uygular.
argument-hint: "[revize notu]"
---

> **Orkestra özeti:** Sen ana oturumsun (orkestra): kod yazmazsın, iş dağıtırsın, hafıza dosyalarını güncellersin. Türkçe konuş. Dağıtım her zaman ana oturumda yapılır; alt ajanlar alt ajan başlatmaz. Her üretici sadece kendi klasörüne yazar. Ayrıntı: proje `CLAUDE.md`.

# /orkestra:dagit

Revize notu (varsa): $ARGUMENTS

## 1. Hazırlık
- Proje kökünde `CLAUDE.md` yoksa önce kurulumu çalıştır:
  `node "${CLAUDE_PLUGIN_ROOT}/scripts/yeni-proje.mjs" "${CLAUDE_PROJECT_DIR}"`
- `fikir.md` ve `CLAUDE.md` oku. fikir.md boşsa dur ve `/orkestra:fikir` öner.
- fikir.md "Açık sorular" bölümünde cevapsız soru varsa kullanıcıya göster; "açık kalsın" demedikçe önce `/orkestra:fikir` öner.
- `arastirma.md` varsa oku (kararlar ve seçilen bileşenler görevlere yansısın).
- Varsa mevcut `roadmap.md` ve `progress.md` oku (revize ise sürümü 1 artır).

## 2. roadmap.md üret
`${CLAUDE_PLUGIN_ROOT}/templates/roadmap.md` biçimini kullan:
- **Faz A:** tek görev, ajan `tasarim-sistemi`, sahip `design-system.md` + `design-preview.html` + `design-yonler.html` (önce 3 yön seçimi, sonra tam tasarım).
- **Kök / ortak dosyalar için sahip ata:** `package.json` (`"type"`, `test` script'i), `.gitignore`, ortak yapılandırma gibi hiçbir modüle ait olmayan dosyaların **sahibi roadmap'te yazılı olmalı**. Teknolojide gerekiyorsa Faz B'nin ilk görevi `B0 Proje iskeleti` olsun (ajan `kod-modul`, sahip bu dosyalar; test komutu çalışır halde bırakır); diğer B görevleri B0'a bağlıdır. Dosyası olmayan sahipsiz kalmasın.
- **Yasaklı klasör adları:** proje `permissions.deny` listesi `node_modules`, `dist`, `build`, `.wrangler`, `secrets` klasörlerini okumayı engeller. Hiçbir görevin sahip klasörü bu adlardan biri veya altı olmasın (örn. build betiği için `tools/`, `scripts/` kullan). Yoksa üretici yazamaz ve görev durur.
- **Testler her görevde `tests/<ad>/**` altındadır** (B ve C dahil) ve görevin sahip klasörüne yazılır; böylece kökteki tek `npm test` hepsini çalıştırır. Test dosyası `src/**` içine konmaz.
- **Faz B:** fikir.md'deki her özellik için bağımsız modüller; ajan `kod-modul`; her modüle **ayrı** klasör (örn. `src/todos/**`).
- **Faz C:** ekranlar; ajan `ekran`; her ekrana ayrı klasör.
- Her görev: ID, faz, **bitti ölçütü**, ajan, sahip klasör, bağımlılık, denetçiler. Bitti ölçütü tek cümle ve doğrulanabilir olmalı (komut çıktısı, test, ekranda görünen davranış). "Düzgün çalışır", "tamamlanır" yazma. Kod ölçütlerini test komutuna, ekran ölçütlerini görünür bir sonuca bağla; makinenin doğrulayamayacağı ölçütün sonuna "Doğrulama: kullanıcı ... dener" ekle. Ölçütü fikir.md'deki başarı ölçütlerinden türet ve başına karşıladığı gereksinim numarasını yaz: "(R1) ...", birden fazlaysa "(R1,R3)", ilgisiz görev (iskelet) için "(R-)". fikir.md'de numara yoksa (eski dosya) önce başarı ölçütlerine R1, R2... numarası ver, anlamını değiştirme.
  (A: denetci-tasarim · B: denetci-kod + denetci-guvenlik + denetci-hafiza · C: denetci-tasarim + denetci-guvenlik).
- **Tasarım gerektiren görevler:** Faz B görevlerinden riskli olanları roadmap'teki "Tasarım gerektiren görevler" bölümüne yaz (neden ile): dış servis veya ücret, kullanıcı verisi, güvenlik/yetki, geri alınamaz işlem, 3+ görevin bağlı olduğu çekirdek, belirsiz teknik seçim. fikir.md "Riskler (pre-mortem)" altındaki bir risk bir B görevine dokunuyorsa o görev de listeye girer. Küçük ve bilinen işler (basit ekran verisi, yardımcı fonksiyon) listeye girmez; liste boşsa "yok" yaz. Bu görevler Faz B'de kod yazılmadan önce `tasarim/<ID>.md` ile kullanıcı onayından geçer.
- Paralel gruplar ve çakışma notu. Mermaid `flowchart` ile bağımlılık diyagramı.
- Durum: `TASLAK`.

## 2b. CLAUDE.md bölümlerini doldur
Proje `CLAUDE.md` şablondan geldiyse 1–4. bölümlerde boş `(...)` yer tutucuları kalır; üretici ajanlar bunları okuyup işe başlar. Orkestra'dan Faz A'dan önce doldur (Orkestra kuralları bölümüne dokunma):
- **1. Proje ve teknoloji:** amaç fikir.md'nin tek cümlelik amacı; dil/çatı ve veri/servisler fikir.md ile `arastirma.md` kararlarından. Orada yazmıyorsa **uydurma**; kullanıcıya sor veya `Belirsiz: ...` yaz.
- **3. Komutlar:** yalnız kesinleşenleri yaz (B0 iskeleti kurulduktan sonra `package.json` gerçekten tanımlıyorsa). Henüz olmayan komutu yazma, `(B0 sonrası)` bırak. Deploy komutu fikir.md'de yoksa boş bırak ve kullanıcıya sor.
- **4. Klasör haritası:** roadmap.md'deki her görevin sahip klasörünü ve görev ID'sini tabloya al (örn. `src/todos/` | todo modülü | B2).
- **2. Kodlama kuralları:** şablon satırlarını koru; yalnız fikir.md kısıtlarından (örn. "mobil öncelikli", "çevrimdışı çalışmalı") doğrudan çıkan kuralları ekle.
- Kullanıcı CLAUDE.md'yi kendisi doldurmuşsa (yer tutucu yok) dokunma. Sonucu Kapı 2'de tek satırla bildir: "CLAUDE.md bölüm 1,3,4 dolduruldu; sorulacak: ...".

## 3. Kapı 1 — orkestra kontrolü
roadmap.md'yi fikir.md ile karşılaştır ve kullanıcıya kısaca raporla:
- fikir.md'deki her temel özellik en az bir göreve karşılık geliyor mu? (eksik görev)
- Kapsam dışı bir şey görev olmuş mu?
- Kök dosyaların (`package.json`, yapılandırma, `index.html` gibi) her birinin bir sahibi var mı? Test komutunu çalıştıracak bir görev var mı?
- Her görevin bitti ölçütü var mı, tek cümle ve doğrulanabilir mi? fikir.md'deki her gereksinim numarası (R1, R2...) en az bir görevin ölçütünde geçiyor mu? Hiçbir görevde geçmeyen numara "karşılanmayan gereksinim"dir: görev ekle veya kullanıcıdan kapsam dışı onayı al. Roadmap'te fikir.md'de olmayan bir numara var mı?
- Hiçbir sahip klasörü yasaklı ad (`node_modules`, `dist`, `build`, `.wrangler`, `secrets`) içermiyor mu?
- İki görevin sahip klasörü çakışıyor mu? Çakışıyorsa: sırala (bağımlılık ekle) veya `worktree` notu düş.
- Döngüsel bağımlılık var mı?
- "Tasarım gerektiren görevler" bölümü dolu mu (ya da "yok" mu)? Listedeki her ID roadmap'te Faz B görevi mi? Dış servis/kullanıcı verisi/güvenlik içeren bir B görevi listede yoksa sebebini söyle veya ekle.
- CLAUDE.md 1–4. bölümlerinde yer tutucu `(...)` kaldı mı? Kalan her biri ya kullanıcıya sorulacak ya da `(B0 sonrası)` olarak işaretli olmalı; uydurma değer yok.
- **Görsel kanıt (Playwright):** Faz A veya C'de ekran görüntüsü kanıtı gerekiyor mu (görsel arayüz var mı)? Gerekiyorsa `kararlar.md`'de Playwright kararı var mı bak. Yoksa kullanıcıya **bir kez** sor: "Görsel kanıt için Playwright (ekran görüntüsü aracı) kurulsun mu? 1) bu projede kur, 2) kurma, kanıtı tarayıcıda açıp ben bakarım." Cevabı `kararlar.md`'ye yaz ve roadmap.md ile `CLAUDE.md` 3. bölümüne (Komutlar) bir satır olarak yansıt. Kurulumu orkestra yapmaz; B0 veya Faz C'nin ilk görevi kod-modul/ekran ajanıyla yapılır. Karar verildikten sonra faz içinde yeniden sorulmaz.
Sorun varsa roadmap.md'yi düzelt ve Kapı 1'i tekrarla. Sonucu "Kapı kayıtları"na yaz.

## 4. Kapı 2 — kullanıcı onayı
Kullanıcıya göster: görev tablosu + mermaid + Kapı 1 sonucu. Sor: **"Onay mı, revize mi?"**
- **Onay:** durumu `ONAYLI` yap, Kapı 2'ye tarih yaz, `kararlar.md`ye bir satır ekle (bkz. faz-calistir "Karar günlüğü"), progress.md'de "Aktif faz: A" yap. Şunu söyle ve dur:
  "Şimdi `/clear` yaz, sonra `/orkestra:faz-calistir A`." Fazı kendiliğinden başlatma.
- **Revize:** notu al, **2. adıma dön**. Kullanıcı fikri değiştirmek isterse `/orkestra:fikir` öner.

Kod yazma; sadece roadmap.md ve progress.md'yi güncelle.
