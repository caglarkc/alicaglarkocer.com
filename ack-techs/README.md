# ACK Techs

Bu uygulama kişisel siteden bağımsız derlenir. Böylece iki site farklı
yayınlarda ve alan adlarında çalışırken birbirlerinin bağımlılıklarını veya
rotalarını etkilemez.

## Yerel çalışma

Node.js 22.13 veya üzeriyle:

```bash
npm ci
npm run dev
```

## Yayın seçenekleri

### Kişisel siteden alt yol

ACK uygulamasını `/ack-techs/` altında yayınlamak için derleme ortamına
`ACK_BASE_PATH=/ack-techs` ekleyin. Kişisel sitenin `/ack-techs/*` istekleri
bu uygulamanın yayınlandığı servise proxy/rewrite edilmelidir. Kişisel sitenin
kaynak kodundaki ACK Techs bağlantısı ve sitemap kaydı hazırdır.

### Bağımsız ACK alan adı

ACK Techs'in tarayıcı adresinde `alicaglarkocer.com` görünmemesi için uygulamayı
kendi alan adına (örneğin `acktechs.com`) bağlayın ve `ACK_BASE_PATH` tanımlamayın.
Bu iki adres aynı anda tek bir sayfanın adres çubuğunda görünemez; `/ack-techs/`
adresinden bağımsız alan adına 308 yönlendirme yapılırsa arama motorları da
bağımsız alan adını kanonik adres olarak kullanır.

Cloudflare Workers için üretim yayını:

```bash
npm run deploy
```
