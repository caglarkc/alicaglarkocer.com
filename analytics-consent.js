(() => {
  const id = 'G-4ST47EMWV6';
  const key = 'analytics-consent-v1';
  let started = false;
  function start() {
    if (started) return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { allow_google_signals: false, page_location: location.origin + location.pathname });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(script);
  }
  const style = document.createElement('style');
  style.textContent = `.analytics-settings{position:fixed;bottom:12px;left:12px;z-index:9998;min-height:44px;padding:9px 12px;border:1px solid #9ca3af;border-radius:6px;background:#171a1b;color:#fff;font:12px/1.4 sans-serif;cursor:pointer}.analytics-consent{position:fixed;bottom:12px;right:12px;z-index:9999;width:min(440px,calc(100% - 24px));box-sizing:border-box;padding:20px;border:1px solid #8b9590;border-radius:12px;background:#171a1b;color:#fff;box-shadow:0 8px 32px #0008;font:14px/1.55 sans-serif}.analytics-consent p{margin:0 0 16px}.analytics-consent a{color:#c9ff45;text-decoration:underline}.analytics-consent div{display:flex;flex-wrap:wrap;gap:10px}.analytics-consent button{min-height:44px;padding:10px 18px;border:1px solid #c9ff45;border-radius:6px;background:transparent;color:#fff;cursor:pointer}.analytics-consent button:last-child{background:#c9ff45;color:#101510}.analytics-consent :focus-visible,.analytics-settings:focus-visible{outline:3px solid #fff;outline-offset:3px}`;
  document.head.appendChild(style);
  const settings = document.createElement('button');
  settings.className = 'analytics-settings';
  settings.textContent = 'Çerez tercihleri';
  const panel = document.createElement('section');
  panel.className = 'analytics-consent';
  panel.setAttribute('aria-label', 'Analiz çerezleri');
  panel.innerHTML = '<p><strong>Analiz çerezleri</strong><br>İzninizle Google Analytics kullanarak ziyaretleri ve site etkileşimlerini ölçüyoruz. Veriler Google ile paylaşılır. Tercihinizi istediğiniz zaman değiştirebilirsiniz. <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google gizlilik politikası</a></p><div><button type="button">Reddet</button><button type="button">Kabul et</button></div>';
  function select(value) {
    try { localStorage.setItem(key, value); } catch {}
    panel.hidden = true;
    if (value === 'accepted') start();
    else if (started) {
      document.cookie.split(';').forEach((cookie) => {
        const name = cookie.trim().split('=')[0];
        if (name === '_ga' || name.startsWith('_ga_')) {
          document.cookie = name + '=; Max-Age=0; path=/';
          document.cookie = name + '=; Max-Age=0; path=/; domain=.alicaglarkocer.com';
        }
      });
      location.reload();
    }
  }
  settings.addEventListener('click', () => { panel.hidden = false; panel.querySelector('button').focus(); });
  panel.querySelectorAll('button')[0].addEventListener('click', () => select('rejected'));
  panel.querySelectorAll('button')[1].addEventListener('click', () => select('accepted'));
  let saved = null;
  try { saved = localStorage.getItem(key); } catch {}
  panel.hidden = saved === 'accepted' || saved === 'rejected';
  document.body.append(settings, panel);
  if (saved === 'accepted') start();
})();
