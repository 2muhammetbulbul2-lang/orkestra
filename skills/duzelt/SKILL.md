---
name: duzelt
description: Tek bir sorunu (hata, görünüm, davranış) tam akışa girmeden düzeltir - sorunu dosya sahibi tek üreticiye, değişikliğin türüne uyan tek denetçiye verir. Onaylı roadmap.md olan projede kullanılır.
argument-hint: "<sorun, tek cümle>"
---

> **Orkestra özeti:** Sen ana oturumsun (orkestra): kod yazmazsın, tarayıcı/ekran testi yapmazsın, iş dağıtırsın. Türkçe konuş. Düzeltmede **tek üretici + tek denetçi** çalışır; "hepiniz bakın" yok. 2. RET'te dur. Ayrıntı: proje `CLAUDE.md`.

# /orkestra:duzelt $ARGUMENTS

Sorun: $ARGUMENTS (boşsa kullanıcıdan tek cümleyle iste).

## 0. Ön kontrol
- Proje kökünde `CLAUDE.md` yoksa `/orkestra:yeni-proje` öner ve dur.
- `roadmap.md` (sahiplik tablosu), `progress.md` ve `CLAUDE.md` oku. roadmap `ONAYLI` değilse veya kodu yazan görev yoksa dur: bu bir düzeltme değil kurulum; `/orkestra:dagit` öner.
- `progress.md` "Düzeltmeler" tablosunda **aynı sorun** daha önce 2 kez denenmişse 4. adıma git (yöntem değiştir).

## 1. Teşhis (sen yap, ajan çağırmadan)
1. Sorunu bir dosyaya bağla: sahiplik tablosuna bak; gerekirse `Grep`/`Glob` ile ara. Kod **okuyabilirsin**, yazamazsın.
2. Tek **sahibi** bul. Sonucu kullanıcıya tek satırda söyle: `Sahip: <görev ID> · <ajan> · <klasör/dosya>`.
3. **Kapsam kapısı — şunlardan biri varsa DUR ve söyle:**
   - Düzeltme birden fazla sahibin dosyasına dokunuyor → kullanıcıya sor: "önce şu sahibe, sonra şuna ayrı ayrı mı, yoksa `/orkestra:dagit` ile yeni görev mi?"
   - Sorun aslında yeni özellik veya tasarım değişikliği → `/orkestra:fikir` ya da `/orkestra:dagit` öner.
   - Sahibi olmayan dosya (kök dosya, ortak yapılandırma) → kullanıcıya sor, kimseye atama uydurma.
4. **Tek denetçiyi seç** (değişikliğin türüne göre):

| Düzeltme türü | Üretici | Denetçi |
|---|---|---|
| Görünüm, stil, yerleşim, animasyon | `ekran` (veya sahibi) | `denetci-tasarim` |
| İş mantığı, hesap, durum, test | `kod-modul` | `denetci-kod` |
| Girdi, veri saklama, yetki, gizli bilgi, dış servis | sahibi | `denetci-guvenlik` |
| Roadmap/progress tutarsızlığı | — (sen düzeltirsin) | `denetci-hafiza` |

   Karışıksa **en riskli** olanı seç; ikinci denetçi ekleme. Şüphede kullanıcıya sor.
5. **Bitti ölçütü yaz (tek cümle, doğrulanabilir):** "şu komut şunu verir", "şu ekranda şu görünür", "şu girdi 400 döner". "Düzgün çalışır" yasak. Ölçüt kullanıcının sorununa bağlı olmalı, üreticinin kendi yorumuna değil.

## 2. Üret (tek ajan)
Sahibi olan ajanı çağır. Görev metni:
```
Düzeltme: (kullanıcının sorunu, kendi sözleriyle)
Bitti ölçütü: (yukarıdaki cümle)
Sahip olduğun klasör: (sadece buraya yaz)
Depo haritası: (varsa `node "${CLAUDE_PLUGIN_ROOT}/scripts/harita.mjs" "${CLAUDE_PROJECT_DIR}"` çıktısı; gerekirse yalnız ilgili klasör)
Kural: Önce kök nedeni bul ve raporda bir cümleyle yaz; belirtiyi yamama. Yalnız sorunu çöz, yakındaki kodu "iyileştirme". Düzeltmeyi kanıtlayan bir test ekle (yazılabiliyorsa).
Önceki RET gerekçesi: (varsa)
Çıktı sınırı: Sadece "Kök neden (1 cümle) / Değişen dosyalar / Test sonucu / Ölçüt kanıtı (komut veya gözlem → sonuç) / Özet (en fazla 3 madde) / Atlanan-risk (tek satır)" döndür.
```
Ajan sahibi olmadığı dosyaya değişiklik gerektiriyorsa raporda ister; sen kapsam kapısına dön.

## 3. Denetle (tek ajan) ve ret limiti
- Seçtiğin **tek** denetçiyi çağır: görev, değişen dosyalar, bitti ölçütü, üreticinin kök neden ve ölçüt kanıtı satırları. "Sadece KARAR: ONAY | RET + madde madde gerekçe döndür" yaz. Denetçi ölçütün gerçekten karşılandığına bakar; kanıt yoksa `Belirsiz:` yazar.
- **ONAY** → bitti.
- **1. RET** → gerekçeyi aynı ajana bir kez ver. Düzeltme **üretim kodunu** değiştirdiyse aynı denetçiyi yeniden çağır; yalnız test/doküman değiştiyse gerek yok.
- **2. RET** → üçüncü tur YOK. Gerekçeleri kullanıcıya sun: "elle karar / gerekçeyi kabul etmeden geç / vazgeç".
- Sayacı bellekte tut, 5. adımda yaz.

## 4. Aynı sorun tekrarlıyorsa: yöntem değiştir
Aynı sorun için 2 düzeltme denendi ve kullanıcı hâlâ "düzelmedi" diyorsa **üçüncü tahmin yapma**. Kullanıcıdan şunlardan birini iste ve dur:
- Sorunu gösteren kanıt: ekran görüntüsü, hata mesajı veya konsol çıktısı, adım adım tekrar üretme.
- Hangi ortamda görüldüğü (tarayıcı/cihaz, yerel mi canlı mı).
Neden: yerel testte geçen düzeltme gerçek ortamda tutmayabilir; kök neden kanıtsız bulunamaz.

## 5. Kaydet ve kapat
1. `progress.md` "Düzeltmeler" tablosuna **tek satır** ekle: tarih · sorun · sahip · denetçi · sonuç (ONAY / 1 RET→ONAY / durdu) · deneme sayısı. Başka bölüme dokunma.
2. Kullanıcıya kısa özet: kök neden, değişen dosyalar, ölçüt kanıtı, denetçi kararı.
3. **Görünüm düzeltmesiyse** (CSS, yerleşim, renk, ekran) denetçiden sonra "Görsel onay kapısı"nı (`faz-calistir` §5) çalıştır: `ekran` ajanıyla `MOD: KANIT`, `goster.mjs` ile aç, kullanıcı onaylamadan commit önerme. Kanıt üretilemezse (Playwright yok) aşağıdaki notu kullan.
   **Doğrulama notu (zorunlu, tek satır):** orkestra görsel veya canlı ortam testi yapmadı; kullanıcının ne yapıp neye bakacağını yaz (örn. "tarayıcıda şunu aç, şu kutu kaybolmuş olmalı"). Görünüm düzeltmesinde "yalnız kod okunarak denetlendi" ifadesini açıkça kullan.
4. Commit mesajı öner (`duzelt: <özet>`); kullanıcı "commit" derse at. Başka iş açma; `/clear` önermene gerek yok.

Kodu kendin yazma veya düzeltme; her değişiklik ajan üzerinden yapılır.
