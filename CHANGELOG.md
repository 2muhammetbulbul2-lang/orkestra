# Değişiklik günlüğü

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
