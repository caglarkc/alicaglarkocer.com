const state = {
  account: 'user',
  screen: 'profile',
  business: null,
  switcher: false,
  notice: false,
  form: { name: '', category: '', username: '', password: '', show: false, error: '' },
}

const root = document.getElementById('app')

function title() {
  if (state.screen === 'register') return 'İşletme Kaydı'
  if (state.screen === 'user-details') return 'Kullanıcı Bilgilerim'
  if (state.screen === 'business-details') return 'İşletme Bilgilerim'
  return 'Profil'
}

function registerForm() {
  const f = state.form
  return `<div class="scroll form">
    <h2 class="heading">İşletme kaydı</h2>
    <p class="body">Ayrı işletme hesabı için ad, kategori, kullanıcı adı ve şifre gir. Bu bilgiler kaydedilmez.</p>
    <label class="field"><input id="biz-name" placeholder="İşletme adı" value="${f.name}"></label>
    <button class="select" type="button" data-action="category"><span class="${f.category ? '' : 'placeholder'}">${f.category || 'Kategori seçimi'}</span>${icons.chevron}</button>
    <label class="field"><input id="biz-user" placeholder="İşletme kullanıcı adı" value="${f.username}" autocomplete="off"></label>
    <label class="field"><input id="biz-pass" placeholder="İşletme şifresi" type="${f.show ? 'text' : 'password'}" value="${f.password}"><button class="eye" type="button" data-action="toggle-pass">${f.show ? 'Gizle' : 'Göster'}</button></label>
    ${f.error ? `<p class="error">${f.error}</p>` : ''}
    <button class="btn" type="button" data-action="submit">İşletmeyi Oluştur</button>
  </div>`
}

function userDetails() {
  return `<div class="scroll details">
    <div class="center-photo"><div class="photo-wrap"><img class="avatar large" src="assets/avatar.png" alt="Profil fotoğrafı"><button class="camera" type="button" data-action="notice">✎</button></div></div>
    <div class="gap-24">
      <div class="section"><div class="section-title">KİŞİSEL BİLGİLER</div>
        <div class="card">
          <div class="detail-row"><span class="k">Ad Soyad</span><span class="v">${user.name}</span></div>
          <button class="detail-row" type="button" data-action="notice"><span class="k">Doğum Tarihi</span><span class="v">14 Mayıs 1998</span>${icons.chevron}</button>
          <button class="detail-row last" type="button" data-action="notice"><span class="k">Cinsiyet</span><span class="v">Kadın</span>${icons.chevron}</button>
        </div>
      </div>
      <div class="section"><div class="section-title">İLETİŞİM BİLGİLERİ</div>
        <div class="card">
          <div class="contact"><div class="meta"><span class="k">E-posta Adresi</span><span class="v">${user.email}</span></div><span class="verified">✓ Onaylı</span></div>
          <div class="contact"><div class="meta"><span class="k">Cep Telefonu</span><span class="v">${user.phone}</span></div><div class="contact-actions"><button class="btn compact" type="button" data-action="notice">Değiştir</button><button class="btn compact secondary" type="button" data-action="notice">Onayla</button></div></div>
        </div>
      </div>
      <p class="note">Telefonunuzu doğrudan değiştirebilirsiniz. Telefon doğrulama daha sonra kullanıma açılacak.</p>
    </div>
  </div>`
}

function businessDetails() {
  const b = state.business
  return `<div class="scroll">
    ${businessIdentity(b)}
    <div class="section"><div class="section-title">İŞLETME BİLGİLERİ</div>
      <div class="card">
        <div class="detail-row"><span class="k">İşletme adı</span><span class="v">${b.name}</span></div>
        <div class="detail-row"><span class="k">Kategori</span><span class="v">${b.category}</span></div>
        <div class="detail-row last"><span class="k">Kullanıcı adı</span><span class="v">@${b.username}</span></div>
      </div>
    </div>
    <button class="btn secondary" type="button" data-action="notice">Düzenle</button>
  </div>`
}

function profile() {
  if (state.account === 'business' && state.business) {
    return `<div class="scroll">
      ${businessIdentity(state.business)}
      <div class="hint">Bu işletme hesabı bireysel hesaptan ayrıdır. Profil sekmesine basılı tutarak geri dön.</div>
      ${businessMenu()}
    </div>`
  }
  return `<div class="scroll">
    ${identity(!!state.business)}
    <div class="hint">${state.business ? 'Profil sekmesine basılı tutarak işletme hesabına geç.' : 'İşletme Ekle ile ayrı bir işletme hesabı aç. Sonra sağ alttan basılı tutarak değiştir.'}</div>
    ${userMenu(!state.business)}
  </div>`
}

function switcher() {
  const b = state.business
  return overlay(`
    <div class="sheet-header"><h2 class="heading">Hesaplar</h2></div>
    <p class="switch-hint">Profil sekmesine basılı tutarak bireysel ve işletme hesapları arasında geç.</p>
    <button class="account-row" type="button" data-switch="user">
      <img class="avatar" src="assets/avatar.png" alt="">
      <div class="identity-text"><div class="name">${user.name}</div><div class="caption">Bireysel hesap</div></div>
      ${state.account === 'user' ? '<span class="check">✓</span>' : ''}
    </button>
    ${b ? `<button class="account-row" type="button" data-switch="business">
      <div class="biz-avatar">${icons.store}</div>
      <div class="identity-text"><div class="name">${b.name}</div><div class="caption">İşletme hesabı</div></div>
      ${state.account === 'business' ? '<span class="check">✓</span>' : ''}
    </button>` : `<button class="account-row" type="button" data-action="add">
      <div class="add-avatar">${icons.plus}</div>
      <div class="identity-text"><div class="name">İşletme ekle</div><div class="caption">Ayrı işletme hesabı oluştur</div></div>
    </button>`}
  `)
}

function readForm() {
  const name = document.getElementById('biz-name')
  const username = document.getElementById('biz-user')
  const password = document.getElementById('biz-pass')
  if (name) state.form.name = name.value
  if (username) state.form.username = username.value
  if (password) state.form.password = password.value
}

function render() {
  const back = state.screen === 'profile' ? '' : `<button class="back" type="button" data-action="back">${icons.back}</button>`
  const body = state.screen === 'register' ? registerForm()
    : state.screen === 'user-details' ? userDetails()
    : state.screen === 'business-details' ? businessDetails()
    : profile()
  root.innerHTML = `
    <div class="status"></div>
    <div class="phone-body">
      <a class="badge" href="index.html">Senaryo A · Ayrı hesaplar</a>
      <header class="header">${back}<h1>${title()}</h1></header>
      ${body}
      ${nav(true)}
    </div>
    ${state.switcher ? switcher() : ''}
  `
  if (state.notice) showNotice(root)
  bind(root)
}

function goProfile(account = state.account) {
  state.account = account
  state.screen = 'profile'
  state.switcher = false
  render()
}

function bind(node) {
  bindLongPress(node, () => { state.switcher = true; render() })
  node.addEventListener('click', event => {
    const close = event.target.closest('[data-close]')
    if (close || event.target.matches('[data-overlay]')) { state.notice = false; state.switcher = false; render(); return }
    const sw = event.target.closest('[data-switch]')
    if (sw) { goProfile(sw.dataset.switch); return }
    const action = event.target.closest('[data-action]')?.dataset.action
    if (!action) return
    if (action === 'back' || action === 'profile') { goProfile(); return }
    if (action === 'notice' || action === 'logout') { state.notice = true; render(); return }
    if (action === 'details') { state.screen = 'user-details'; render(); return }
    if (action === 'biz-details') { state.screen = 'business-details'; render(); return }
    if (action === 'add') { state.switcher = false; state.screen = 'register'; render(); return }
    if (action === 'toggle-pass') { readForm(); state.form.show = !state.form.show; render(); return }
    if (action === 'category') {
      readForm()
      showCategory(node, state.form.category, value => { state.form.category = value; render() })
      return
    }
    if (action === 'submit') {
      readForm()
      const f = state.form
      if (!f.name.trim()) { f.error = 'İşletme adı zorunludur.'; render(); return }
      if (!f.category) { f.error = 'Kategori seçimi zorunludur.'; render(); return }
      if (!f.username.trim()) { f.error = 'İşletme kullanıcı adı zorunludur.'; render(); return }
      if (f.password.length < 8) { f.error = 'İşletme şifresi en az 8 karakter olmalıdır.'; render(); return }
      state.business = { name: f.name.trim(), category: f.category, username: f.username.trim() }
      goProfile('business')
    }
  })
}

render()
