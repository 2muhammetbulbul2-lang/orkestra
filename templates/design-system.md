# Design System

> Faz A'da `orkestra:tasarim-sistemi` doldurur. Ekranlar sadece buradaki tokenları kullanır.

## Renk tokenları
| Token | Açık tema | Koyu tema | Kullanım |
|---|---|---|---|
| `--color-bg` | #...... | #...... | sayfa zemini |
| `--color-surface` | #...... | #...... | kart zemini |
| `--color-text` | #...... | #...... | ana metin |
| `--color-primary` | #...... | #...... | ana eylem |

Kontrast: metin/zemin ≥ 4.5:1 (ölçülen değerleri yaz).

## Tipografi ölçeği
| Token | Boyut | Satır yüksekliği | Ağırlık |
|---|---|---|---|
| `--text-sm` | | | |
| `--text-base` | | | |
| `--text-lg` | | | |
| `--text-xl` | | | |

## Boşluk ölçeği
`--space-1` … `--space-8` (taban: 4px veya 8px)

## Bileşenler
### Buton
- Varyantlar, durumlar (normal, hover, odak, devre dışı), kullanılan tokenlar.
### Girdi
### Kart

## Kırılım noktaları
| Ad | Min genişlik |
|---|---|
| mobil | 0 |
| tablet | ...px |
| masaüstü | ...px |

## Erişilebilirlik kuralları
- Görünür odak halkası.
- Dokunma hedefi ≥ 44×44px.
- Her girdinin etiketi var; görseller alt metinli.
- Sadece renkle bilgi verilmez.
