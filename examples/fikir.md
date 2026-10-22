# Fikir

## Hayal
İnsanlar günlük işlerini tek ekranda, dikkat dağıtmadan görür ve bitirdikçe rahatlar.

## Amaç
Tek kişilik, çevrimdışı çalışan, sade bir yapılacaklar uygulaması.

## Kullanıcı ve senaryo
- Birincil kullanıcı: günlük işlerini telefondan takip eden bireyler
- Kullanım anı / bağlam: sabah plan, gün içinde hızlı işaretleme
- Bugün nasıl çözüyor: telefon notları ve kâğıt liste
- Cihaz: öncelik mobil, masaüstünde de çalışır

## Temel özellikler (ilk sürüm)
1. Görev ekle, düzenle, sil
2. Tamamlandı olarak işaretle, filtrele (tümü / aktif / biten)
3. Veriler tarayıcıda (localStorage) kalıcı

## Kapsam dışı
- Hesap, senkronizasyon, paylaşım, bildirim

## Veri ve gizlilik
- Ne saklanır, nerede: görevler, yalnız cihazda (localStorage)
- Hesap / hassas veri: yok

## Kısıtlar
- Teknoloji: TypeScript + Vite, framework yok; test: Vitest
- Süre / bütçe: 1 hafta sonu, ücretli servis yok
- Hukuki: veri cihazdan çıkmaz

## His ve görünüm
- Benzesin / benzemesin: sade ve sakin; kalabalık, rozetli uygulamalara benzemesin
- Ton: sakin

## Kararlar
| Konu | Seçenekler | Seçilen | Neden |
|---|---|---|---|
| Depolama | localStorage / ücretli bulut | localStorage | Ücretsiz, veri cihazdan çıkmaz |
| Koyu tema | var / yok | var | İlk sürümde istendi |

## Başarı ölçütü
- Yeni kullanıcı ilk görevini 10 saniyede ekleyebiliyor.
- Lighthouse erişilebilirlik puanı ≥ 95, mobilde yatay kaydırma yok.

## Açık sorular
- (yok)
