const state = {
  tab: 'personal',
  screen: 'profile',
  business: null,
  notice: false,
  form: { name: '', category: '', error: '' },
}

const root = document.getElementById('app')

function title() {
  if (state.screen === 'register') return 'İşletme Kaydı'
  if (state.screen === 'user-details') return 'Kullanıcı Bilgilerim'
  if (state.screen === 'business-details') return 'İşletme Bilgilerim'
  return 'Profil'
}

function segment() {
  return `<div class="segment">
    <button type="button" class="${state.tab === 'personal' ? 'active' : ''}" data-tab="personal">Bireysel</button>
    <button type="button" class="${state.tab === 'business' ? 'active' : ''}" data-tab="business">İşletmem</button>
  </div>`
}

function registerForm() {
  const f = state.form
  return `<div class="scroll form">
    <h2 class="heading">İşletme kaydı</h2>
    <p class="body">Bağlı işletme için ad ve kategori yeterli. Bu bilgiler kaydedilmez.</p>
    <label class="field"><input id="biz-name" placeholder="İşletme adı" value="${f.name}"></label>
    <button class="select" type="button" data-action="category"><span class="${f.category ? '' : 'placeholder'}">${f.category || 'Kategori seçimi'}</span>${icons.chevron}</button>
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
        <div class="detail-row last"><span class="k">Kategori</span><span class="v">${b.category}</span></div>
      </div>
    </div>
    <button class="btn secondary" type="button" data-action="notice">Düzenle</button>
  </div>`
}

function profile() {
  const head = state.tab === 'business' && state.business ? businessIdentity(state.business) : identity(false)
  const body = state.tab === 'personal'
    ? userMenu(false)
    : state.business
      ? businessMenu()
      : `<div class="empty"><div class="empty-icon">${icons.store}</div><h2>Henüz işletmen yok</h2><p>İşletme adı ve kategori ile kayıt oluştur. Bu önizlemede bilgiler kaydedilmez.</p><button class="btn" type="button" data-action="add">İşletme Ekle</button></div>`
  return `<div class="scroll">${head}${segment()}${body}</div>`
}

function readForm() {
  const name = document.getElementById('biz-name')
  if (name) state.form.name = name.value
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
      <a class="badge" href="index.html">Senaryo B · Bağlı hesap</a>
      <header class="header">${back}<h1>${title()}</h1></header>
      ${body}
      ${nav(false)}
    </div>
  `
  if (state.notice) showNotice(root)
  bind(root)
}

function goProfile(tab = state.tab) {
  state.tab = tab
  state.screen = 'profile'
  render()
}

function bind(node) {
  node.addEventListener('click', event => {
    const close = event.target.closest('[data-close]')
    if (close || event.target.matches('[data-overlay]')) { state.notice = false; render(); return }
    const tab = event.target.closest('[data-tab]')?.dataset.tab
    if (tab) { state.tab = tab; render(); return }
    const action = event.target.closest('[data-action]')?.dataset.action
    if (!action) return
    if (action === 'back' || action === 'profile') { goProfile(); return }
    if (action === 'notice' || action === 'logout') { state.notice = true; render(); return }
    if (action === 'details') { state.screen = 'user-details'; render(); return }
    if (action === 'biz-details') { state.screen = 'business-details'; render(); return }
    if (action === 'add') { state.screen = 'register'; render(); return }
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
      state.business = { name: f.name.trim(), category: f.category }
      goProfile('business')
    }
  })
}

render()
