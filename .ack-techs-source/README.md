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

## Vercel'de yayınlama

Ana repo Vercel'de statik yayınlandığı için, ACK Techs uygulaması derlenerek
ana projedeki `ack-techs/` klasörüne HTML, CSS ve JavaScript çıktısı olarak
aktarılır. Bu klasör Vercel tarafından doğrudan `https://alicaglarkocer.com/ack-techs/`
adresinde sunulur.

İlk aktarım için iki terminal kullanın:

```bash
# Terminal 1
ACK_BASE_PATH=/ack-techs npm run build
npx wrangler dev --config dist/server/wrangler.json --port 8790
```

```bash
# Terminal 2
npm run export:static
```

`ack-techs/` içeriğini Git'e ekleyip ana dalı Vercel'e gönderin. Vercel için
ek bir build ayarı gerekmez.
