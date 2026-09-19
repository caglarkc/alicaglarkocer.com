const icons = {
  user: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.5" stroke="#0F172A" stroke-width="2"/><path d="M5 19c1.2-2.2 3.4-3.5 7-3.5s5.8 1.3 7 3.5" stroke="#0F172A" stroke-width="2" stroke-linecap="round"/></svg>',
  lock: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="6" y="10" width="12" height="10" rx="2" stroke="#0F172A" stroke-width="2"/><path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="#0F172A" stroke-width="2" stroke-linecap="round"/></svg>',
  heart: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9z" stroke="#0F172A" stroke-width="2" stroke-linejoin="round"/></svg>',
  chat: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 6h14v10H8l-3 3V6z" stroke="#0F172A" stroke-width="2" stroke-linejoin="round"/></svg>',
  settings: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 8h14M5 12h14M5 16h14" stroke="#0F172A" stroke-width="2" stroke-linecap="round"/></svg>',
  help: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="#0F172A" stroke-width="2"/><path d="M9.5 10a2.5 2.5 0 1 1 3.2 2.4c-.7.3-1.2.8-1.2 1.6V15" stroke="#0F172A" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17.2" r=".8" fill="#0F172A"/></svg>',
  logout: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M10 7V5h9v14h-9v-2M13 12H4m0 0 3-3M4 12l3 3" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  store: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 10 L6 5 H18 L21 10 H3" stroke="#0F172A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 10 V20 H19 V10" stroke="#0F172A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 20 V14 H14 V20" stroke="#0F172A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 13 H9 M15 13 H17" stroke="#0F172A" stroke-width="2" stroke-linecap="round"/></svg>',
  plus: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 6 V18" stroke="#0F172A" stroke-width="2" stroke-linecap="round"/><path d="M6 12 H18" stroke="#0F172A" stroke-width="2" stroke-linecap="round"/></svg>',
  home: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 11.5 12 5l8 6.5V20H4v-8.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  compass: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7"/><path d="m14.8 9.2-1.3 4.3-4.3 1.3 1.3-4.3 4.3-1.3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  messages: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 7h14v9H8l-3 3V7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  profile: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="3.2" stroke="currentColor" stroke-width="1.7"/><path d="M6.2 18.2c1.1-2 3.2-3.2 5.8-3.2s4.7 1.2 5.8 3.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  chevron: '<svg width="14" height="22" viewBox="0 0 14 22" fill="none"><path d="M4 6l6 5-6 5" stroke="#9CA3AF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  back: '<svg viewBox="0 0 14 14" fill="none"><path d="M9 2 4 7l5 5" stroke="#111827" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
}

const categories = ['Restoran', 'Kafe', 'Güzellik & Bakım', 'Spor & Fitness', 'Eğitim', 'Sağlık', 'Eğlence', 'Alışveriş', 'Hizmet', 'Diğer']
const user = { name: 'Şeyma Nur Akalın', email: 'snur.akalin@example.com', phone: '+905321234567' }

function row(title, icon, extra = '') {
  const action = extra.replace(/\s*last\s*/g, '').trim() || 'notice'
  return `<button class="row ${extra}" type="button" data-action="${action === 'danger' ? 'logout' : action}">
    ${icons[icon]}<span class="label">${title}</span>${extra === 'danger' ? '' : icons.chevron}
  </button>`
}

function userMenu(withAdd) {
  return `
    <div class="card">
      ${row('Kullanıcı Bilgilerim', 'user', 'details')}
      ${row('Şifre ve Güvenlik', 'lock', 'notice')}
      ${row('Favorilerim', 'heart', 'notice')}
      ${row('Etkileşimlerim', 'chat', 'notice last')}
    </div>
    ${withAdd ? `<div class="card">${row('İşletme Ekle', 'plus', 'add')}</div>` : ''}
    <div class="card">
      ${row('Uygulama Ayarları', 'settings', 'notice')}
      ${row('Yardım, SSS & Sözleşmeler', 'help', 'notice last')}
    </div>
    <div class="card">${row('Çıkış Yap', 'logout', 'danger')}</div>`
}

function businessMenu() {
  return `
    <div class="card">
      ${row('İşletme Bilgilerim', 'store', 'biz-details')}
      ${row('Kampanyalarım', 'heart', 'notice')}
      ${row('Etkinliklerim', 'compass', 'notice')}
      ${row('Teklif Talepleri', 'messages', 'notice last')}
    </div>
    <div class="card">
      ${row('Paket ve Haklar', 'lock', 'notice')}
      ${row('Yardım, SSS & Sözleşmeler', 'help', 'notice last')}
    </div>
    <div class="card">${row('Çıkış Yap', 'logout', 'danger')}</div>`
}

function nav(longPress) {
  return `<nav class="nav">
    <button type="button" data-action="notice">${icons.home}<span>Anasayfa</span></button>
    <button type="button" data-action="notice">${icons.compass}<span>Keşfet</span></button>
    <button type="button" data-action="notice">${icons.messages}<span>Mesajlar</span></button>
    <button type="button" class="active" data-action="profile" ${longPress ? 'data-longpress="1"' : ''}>${icons.profile}<span>Profil</span></button>
  </nav>`
}

function identity(mark) {
  return `<div class="identity">
    <div class="avatar-wrap">
      <img class="avatar" src="assets/avatar.png" alt="Profil fotoğrafı">
      ${mark ? `<span class="mark">${icons.store}</span>` : ''}
    </div>
    <div class="identity-text"><div class="name">${user.name}</div><div class="caption">${user.email}</div></div>
  </div>`
}

function businessIdentity(business) {
  const extra = business.username ? ` · @${business.username}` : ''
  return `<div class="identity">
    <div class="biz-avatar">${icons.store}</div>
    <div class="identity-text"><div class="name">${business.name}</div><div class="caption">${business.category}${extra}</div></div>
  </div>`
}

function overlay(html) {
  return `<div class="overlay" data-overlay="1"><div class="sheet"><div class="handle"></div>${html}</div></div>`
}

function bindLongPress(root, onLong) {
  root.querySelectorAll('[data-longpress]').forEach(el => {
    let timer
    let fired = false
    const start = () => { fired = false; timer = setTimeout(() => { timer = null; fired = true; onLong() }, 380) }
    const stop = () => { if (timer) { clearTimeout(timer); timer = null } }
    el.addEventListener('pointerdown', start)
    el.addEventListener('pointerup', stop)
    el.addEventListener('pointerleave', stop)
    el.addEventListener('click', event => { if (fired) event.stopImmediatePropagation() })
  })
}

function showNotice(root) {
  root.insertAdjacentHTML('beforeend', overlay(`
    <div class="sheet-header"><h2 class="heading">Tasarım önizlemesi</h2></div>
    <p class="body" style="padding:0 24px 8px">Bu alanın işlemleri sonraki aşamada eklenecek. Buradaki örnek bilgiler hesaba kaydedilmez.</p>
    <div class="sheet-footer"><button class="btn" type="button" data-close="1">Tamam</button></div>
  `))
}

function showCategory(root, current, onSave) {
  const options = categories.map(item => `<button class="option ${item === current ? 'active' : ''}" type="button" data-cat="${item}"><span>${item}</span><span class="radio">${item === current ? '✓' : ''}</span></button>`).join('')
  root.insertAdjacentHTML('beforeend', overlay(`
    <div class="sheet-header"><h2 class="heading">Kategori seçimi</h2></div>
    <div class="options">${options}</div>
    <div class="sheet-footer"><button class="btn" type="button" data-save-cat="1" ${current ? '' : 'disabled'}>Seçimi Kaydet</button></div>
  `))
  let draft = current
  root.querySelector('[data-overlay]').addEventListener('click', event => {
    const option = event.target.closest('[data-cat]')
    if (option) {
      draft = option.dataset.cat
      root.querySelectorAll('[data-cat]').forEach(node => node.classList.toggle('active', node.dataset.cat === draft))
      root.querySelectorAll('[data-cat] .radio').forEach(node => { node.textContent = node.parentElement.dataset.cat === draft ? '✓' : '' })
      root.querySelector('[data-save-cat]').disabled = !draft
      return
    }
    if (event.target.closest('[data-save-cat]') && draft) { onSave(draft); event.target.closest('[data-overlay]').remove() }
    if (event.target.matches('[data-overlay]')) event.target.remove()
  })
}
