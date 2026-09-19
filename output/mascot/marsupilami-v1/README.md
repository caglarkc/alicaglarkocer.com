# Marsupilami animasyon çizimleri — v1

Kullanıcının gönderdiği `reference.png`, altı üretim çağrısının tamamında görsel referans olarak kullanıldı. Çizimler yerleşik **image_gen** aracıyla üretildi. Tam üretim tarifleri `prompts.json` içinde bulunur. Ana sitenin dosyaları değiştirilmedi.

## Çizim seti

| Dosya | İçerik | Tasarlanan sıra |
|---|---|---|
| walk-right.png | Sağa yürüyüş | 8 kare, döngü |
| idle-blink.png | Bekleme ve göz kırpma | 8 kare, döngü |
| wave.png | Kolu kaldırma, selamlama, indirme | 8 kare, tek sefer |
| think.png | Eli çeneye götürme ve düşünme | 8 kare, tek sefer; orta pozlar bekletilebilir |
| sleep.png | Çömelme, kıvrılma, uyku | 8 kare; son pozlar uyku döngüsüne temel |
| celebrate.png | Hazırlık, sıçrama, iniş | 8 kare, tek sefer |

Her sayfa 1536 × 1024 pikseldir. Hedef yerleşim 4 sütun × 2 satır, hücre başına 384 × 512 pikseldir. Okuma sırası soldan sağa, üst satır ardından alt satırdır. Sola yürüyüş için sağa yürüyüşün yatay ayna görüntüsü kullanılabilir; ayrı sol çizim üretilmedi.

## Önizleme

`preview.html` dosyasını tarayıcıda aç. Hareket seçimi, oynat/duraklat, 1–16 kare/sn hız, tek kare inceleme ve yatay çevirme bulunur. Önizleme görselleri değiştirmez; kaynak sayfaların eşit hücrelerini gösterir. Oynatma kullanıcı tarafından başlatılır.

## Kontrol sonucu ve kalan iş

Bu dosyalar **animasyon çizim taslaklarıdır**, doğrulanmış üretim sprite'ları değildir.

- İlk altı PNG, RGB çıktı: dama deseni resme işlenmiş; alfa şeffaflığı yok. `image-checks.json` dosya kontrolünü içerir.
- Uyuma sayfası için ek bir arka plan temizliği ve hücre hizalama çağrısı yapıldı. Uzun süre sonuç dönmeyince bekleyen çağrı sonlandırıldı; düzeltme çıktısı alınamadı. Tarifi `prompts.json` içindeki `sleep-cleanup` alanında saklandı. `sleep.png` ilk üretimdir.
- Yüzdeki büyük oval burun, yakın beyaz gözler, sarı/benekli görünüm ve uzun kuyruk referansa dayanıyor. Benek yerleri, kulaklar, baş ölçüsü ve kuyruk biçimi kareler arasında bire bir sabit kalmamış.
- Eşit hücre yerleşimi model tarafından tam uygulanmamış. Özellikle uyuma dizisinin üst satırındaki ayaklar ikinci satır alanına taşıyor. Önizlemede bu kesilmeler görünür.
- Yürüyüşte belirgin bacak hareketleri var; zıt bacakların temasları, yere basan ayağın sabitliği ve ilk/son kare geçişi elle iyileştirilmeli. Kodla ilerleme eklemek bu çizim tutarsızlıklarını tek başına düzeltmez.
- Son sprite üretimi için arka plan temizliği, baş ölçeği ve taban hizası eşleştirmesi, hücre kırpımları ve kare süreleri üzerinde çalışılmalı. Uyku ve zıplamada amaçlı dikey hareket korunmalı.

Mevcut sitede canlı entegrasyon, yayınlama veya bitmiş animasyon iddiası yoktur. Bu klasör, çizimleri değerlendirmek ve bir sonraki düzeltme turunu somutlaştırmak içindir.
