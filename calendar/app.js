const API = window.AJANDA_API.replace(/\/$/, "");
const state = {
  token: localStorage.getItem("ajanda_token") || "",
  week: 0,
  boardUser: "",
  me: null,
  productId: "",
  memberId: "",
};

function errText(data, fallback) {
  if (!data) return fallback;
  if (typeof data.detail === "string") return data.detail;
  return fallback;
}

async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }
  const token = state.token;
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(errText(data, "istek başarısız"));
  return data;
}

function show(id) {
  document.querySelectorAll(".screen").forEach((el) => {
    el.hidden = el.id !== id;
  });
}

function card(task, check) {
  const cls = `task focus-${task.priority || task.focus || "medium"}${task.done ? " done" : ""}${task.kind === "assigned" ? " assigned" : ""}${task.warning ? " warning" : ""}`;
  const drag = task.can_schedule && !task.done ? `draggable="true"` : "";
  const canMark = task.can_toggle;
  const mark = canMark
    ? `<button type="button" class="check-btn" data-act="toggle" data-id="${task.id}" title="${task.done ? "Yeniden aç" : "Tamamla"}">${task.done ? "✓" : "○"}</button>`
    : task.done
      ? `<span class="check-mark" title="Tamamlandı">✓</span>`
      : "";
  const del = task.can_edit
    ? `<button type="button" class="ghost-btn" data-act="delete" data-id="${task.id}">×</button>`
    : "";
  const who = (task.assignees || []).map((a) => a.name).filter(Boolean);
  const names = who.length ? who.join(", ") : task.assignee_name || "";
  const chips = [
    task.kind === "assigned" ? `<span class="chip lock">Kurucu işi</span>` : `<span class="chip">Kişisel</span>`,
    names ? `<span class="chip">${esc(names)}</span>` : "",
    task.closed_by ? `<span class="chip closed">${esc(task.closed_by)} kapattı</span>` : "",
    task.deadline_date ? `<span class="chip">En geç ${task.deadline_date}${task.deadline_time ? " " + task.deadline_time : ""}</span>` : "",
    task.estimated_time ? `<span class="chip">${task.estimated_time}</span>` : "",
    `<span class="chip">Öncelik ${esc(task.priority_label || "")}</span>`,
    `<span class="chip">${task.comment_count || 0} açıklama</span>`,
    task.warning ? `<span class="chip late">UYARI</span>` : "",
  ].join("");
  return `<article class="${cls}" ${drag} data-id="${task.id}">
    <div class="task-top">
      ${mark}
      <div class="task-heading">
        ${task.project ? `<p class="task-project">${esc(task.project)}</p>` : ""}
        <p class="task-title">${esc(task.title)}</p>
      </div>
      <div class="task-actions">
        <button type="button" class="text-btn" data-act="open" data-id="${task.id}">Düzenle</button>
        ${del}
      </div>
    </div>
    ${task.description ? `<p class="task-desc">${esc(task.description)}</p>` : ""}
    <div class="meta">${chips}</div>
  </article>`;
}

function esc(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function empty(text) {
  return `<p class="empty">${esc(text)}</p>`;
}

function memberChecks(people, selectedIds) {
  const selected = new Set(selectedIds || []);
  return (people || [])
    .map((m) => `<label class="check-line"><input type="checkbox" name="member_ids" value="${m.id}" ${selected.has(m.id) ? "checked" : ""}/> <span>${esc(m.name)}</span></label>`)
    .join("");
}

function crewNames(members) {
  return (members || []).map((u) => u.name).join(", ") || "Görevli yok";
}

function phaseIds(list) {
  return (list || []).map((p) => (p && p.id) || p);
}

function phaseChecks(phases, name, selected, type) {
  const picked = new Set(Array.isArray(selected) ? selected : selected ? [selected] : []);
  return (phases || [])
    .map(
      (p) =>
        `<label class="check-line"><input type="${type}" name="${name}" value="${p.id}" ${picked.has(p.id) ? "checked" : ""}/> <span>${esc(p.label)}</span></label>`
    )
    .join("");
}

function phaseBoard(phases, product) {
  const done = phaseIds(product.done_phases);
  const upcoming = phaseIds(product.upcoming_phases);
  return `<div class="phase-board">
    <div><p class="form-kicker">Tamamlanan</p><div class="member-picks">${phaseChecks(phases, "done_phases", done, "checkbox")}</div></div>
    <div><p class="form-kicker">Şu anki</p><div class="member-picks">${phaseChecks(phases, "phase", product.phase, "radio")}</div></div>
    <div><p class="form-kicker">Gelecek</p><div class="member-picks">${phaseChecks(phases, "upcoming_phases", upcoming, "checkbox")}</div></div>
  </div>`;
}

function phaseView(product) {
  const chips = (items) =>
    (items || []).length
      ? `<ol class="phase-track">${items.map((p) => `<li class="is-on">${esc(p.label)}</li>`).join("")}</ol>`
      : `<p class="empty">—</p>`;
  return `<div class="phase-board">
    <div><p class="form-kicker">Tamamlanan</p>${chips(product.done_phases)}</div>
    <div><p class="form-kicker">Şu anki</p>${chips(product.phase_label ? [{ label: product.phase_label }] : [])}</div>
    <div><p class="form-kicker">Gelecek</p>${chips(product.upcoming_phases)}</div>
  </div>`;
}

function bindPhaseBoard(root) {
  if (!root) return;
  root.addEventListener("change", (event) => {
    const el = event.target;
    if (!el || !["done_phases", "upcoming_phases", "phase"].includes(el.name) || !el.checked) return;
    const val = el.value;
    if (el.name === "phase") {
      root.querySelectorAll(`[name="done_phases"][value="${val}"], [name="upcoming_phases"][value="${val}"]`).forEach((box) => {
        box.checked = false;
      });
      return;
    }
    const other = el.name === "done_phases" ? "upcoming_phases" : "done_phases";
    root.querySelectorAll(`[name="${other}"][value="${val}"], [name="phase"][value="${val}"]`).forEach((box) => {
      box.checked = false;
    });
  });
}

function fillProducts(selected) {
  document.querySelectorAll(".product-pick").forEach((el) => {
    const current = selected || el.value;
    el.innerHTML = [`<option value="">Ürün seç</option>`]
      .concat((state.products || []).map((p) => `<option value="${esc(p.name)}" ${p.name === current ? "selected" : ""}>${esc(p.name)}</option>`))
      .join("");
  });
}

function hideViews() {
  ["view-agenda", "view-ekip", "view-member", "view-task", "view-products", "view-product"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  });
}

function setNav(page) {
  document.querySelectorAll(".nav-link[data-go]").forEach((el) => {
    el.classList.toggle("is-on", el.dataset.go === page);
  });
}

function bindDrop() {
  document.querySelectorAll("[data-drop]").forEach((zone) => {
    zone.ondragover = (event) => {
      if (zone.classList.contains("past")) {
        event.dataTransfer.dropEffect = "none";
        return;
      }
      event.preventDefault();
      zone.classList.add("drag-over");
    };
    zone.ondragleave = () => zone.classList.remove("drag-over");
    zone.ondrop = async (event) => {
      event.preventDefault();
      zone.classList.remove("drag-over");
      if (zone.classList.contains("past")) return;
      const id = event.dataTransfer.getData("text/plain");
      if (!id) return;
      await api(`/api/tasks/${id}/move`, {
        method: "POST",
        body: { status: zone.dataset.drop, scheduled_date: zone.dataset.date || null },
      });
      await loadAgenda();
    };
  });
  document.querySelectorAll(".task[draggable='true']").forEach((el) => {
    el.ondragstart = (event) => {
      event.dataTransfer.setData("text/plain", el.dataset.id);
      event.dataTransfer.effectAllowed = "move";
    };
  });
}

async function loadAgenda() {
  const q = new URLSearchParams({ w: String(state.week) });
  if (state.boardUser) q.set("user_id", state.boardUser);
  const data = await api(`/api/agenda?${q}`);
  state.me = data.user;
  state.products = data.products || [];
  state.members = data.members || [];
  document.getElementById("eyebrow").textContent = data.viewing_other
    ? `${data.assignee.name}${data.assignee.title ? " · " + data.assignee.title : ""}`
    : `${data.user.name}${data.user.title ? " · " + data.user.title : ""}`;
  document.getElementById("btn-ekip").hidden = !data.can_manage;
  setNav("agenda");
  const boardWrap = document.getElementById("board-wrap");
  const boardPick = document.getElementById("board-pick");
  boardWrap.hidden = !data.can_switch;
  if (data.can_switch && data.members.length) {
    boardPick.innerHTML = data.members
      .map(
        (m) => `<option value="${m.id}" ${m.id === data.assignee.id ? "selected" : ""}>${esc(m.name)}${m.title ? " · " + esc(m.title) : ""}</option>`
      )
      .join("");
  }
  document.getElementById("week-range").textContent = data.week_range;
  document.getElementById("form-assign").hidden = !data.can_assign;
  fillProducts();
  const peopleBox = document.getElementById("assign-people");
  if (peopleBox) {
    peopleBox.innerHTML = data.members
      .map((m) => `<label class="check-line"><input type="checkbox" name="targets" value="${m.id}" ${data.viewing_other && m.id === data.assignee.id ? "checked" : ""}/> <span>${esc(m.name)}</span></label>`)
      .join("");
  }
  document.getElementById("inbox-count").textContent = data.inbox.length;
  document.getElementById("missed-count").textContent = data.missed.length;
  document.getElementById("inbox-list").innerHTML = data.inbox.map((t) => card(t, true)).join("") || empty("Liste boş.");
  document.getElementById("missed-list").innerHTML = data.missed.map((t) => card(t, true)).join("") || empty("Gecikmiş iş yok.");
  document.getElementById("week").innerHTML = data.days
    .map(
      (day) => `<section class="day${day.weekend ? " weekend" : ""}${day.today ? " today" : ""}${day.past ? " past" : ""}" data-drop="scheduled" data-date="${day.iso}">
        <div class="day-head"><span class="day-name">${day.name}</span><span class="day-num">${day.num}</span></div>
        <div class="day-cards">${day.tasks.map((t) => card(t, true)).join("") || empty("Boş")}</div>
      </section>`
    )
    .join("");
  document.getElementById("done-list").innerHTML = data.completed
    .map(
      (item) => `<button type="button" class="done-item" data-act="open" data-id="${item.id}">
        <strong>${esc(item.title)}</strong>
        <span>${item.actor_name ? esc(item.actor_name) + " kapattı" : "Tamamlandı"}${item.project ? " · " + esc(item.project) : ""}</span>
      </button>`
    )
    .join("") || empty("Henüz yok.");
  bindDrop();
  hideViews();
  document.getElementById("view-agenda").hidden = false;
  document.getElementById("week-nav").hidden = false;
}

async function loadEkip() {
  const data = await api("/api/ekip");
  const people = data.people
    .map(
      (p) => `<a class="member-card" href="#" data-member="${p.id}">
        <strong>${esc(p.name)}</strong><span class="role-tag">${esc(p.title || p.role_label || "")}</span>
        <p class="member-stats">${esc(p.username)}<br>
        Bugün ${p.stats.today} açık · ${p.stats.done_today} bitti · kuyruk ${p.stats.inbox} · kaçan ${p.stats.missed}</p>
      </a>`
    )
    .join("");
  document.getElementById("view-ekip").innerHTML = `
    <section class="panel"><div class="panel-head"><h2>Üyeler</h2><span class="count">${data.people.length}</span></div>
      <p class="hint">Üyeye tıklayınca profili, ürünleri ve açık görevleri görünür.</p>
      <div class="team-list">${people}</div></section>
    <section class="panel"><h2>Kullanıcı ekle</h2>
      <form class="new-task" id="form-user">
        <div class="field-row"><input name="username" placeholder="Kullanıcı adı" required /><input name="name" placeholder="İsim" required /></div>
        <div class="field-row"><input name="title" placeholder="Ünvan" required />
          <select name="role"><option value="worker">Worker</option><option value="admin">Admin</option></select>
        </div>
        <button class="primary" type="submit">Oluştur</button>
      </form>
      <pre class="key-banner" id="issued" hidden></pre>
    </section>`;
  hideViews();
  document.getElementById("view-ekip").hidden = false;
  document.getElementById("week-nav").hidden = true;
  setNav("ekip");
}

async function loadMember(id) {
  const data = await api(`/api/ekip/users/${id}`);
  const p = data.person;
  const s = p.stats || {};
  const products = (data.products || [])
    .map(
      (item) => `<a class="member-card" href="#" data-product="${item.id}">
        <strong>${esc(item.name)}</strong>
        <p class="member-stats">${esc(item.purpose || item.problem || "")}</p>
      </a>`
    )
    .join("") || empty("Hiçbir ürüne ekli değil.");
  const open = data.tasks || [];
  const agendaBtn = data.can_switch
    ? `<button type="button" class="text-btn" data-board="${p.id}">Ajandasını aç</button>`
    : "";
  document.getElementById("view-member").innerHTML = `
    <p class="eyebrow"><button type="button" class="text-btn" data-go="ekip">← Ekip</button></p>
    <h1>${esc(p.name)}</h1>
    <div class="meta">
      <span class="chip">${esc(p.title || "")}</span>
      <span class="chip">${esc(p.role_label || "")}</span>
      <span class="chip">${esc(p.username || "")}</span>
    </div>
    <p class="hint">Bugün ${s.today || 0} açık · ${s.done_today || 0} bitti · kuyruk ${s.inbox || 0} · kaçan ${s.missed || 0}</p>
    ${agendaBtn}
    <section class="panel">
      <div class="panel-head"><h2>Ürünleri</h2><span class="count">${(data.products || []).length}</span></div>
      <div class="team-list">${products}</div>
    </section>
    <section class="panel">
      <div class="panel-head"><h2>Açık görevler</h2><span class="count">${open.length}</span></div>
      <div class="card-list">${open.map((t) => card(t, true)).join("") || empty("Açık iş yok.")}</div>
    </section>`;
  hideViews();
  document.getElementById("view-member").hidden = false;
  document.getElementById("week-nav").hidden = true;
  setNav("ekip");
  state.memberId = id;
}

async function loadTask(id) {
  const data = await api(`/api/tasks/${id}`);
  const t = data.task;
  const assigned = (t.assignees || []).map((a) => a.name).filter(Boolean).join(", ")
    || (t.assignee_name ? `${t.assignee_name}${t.assignee_title ? " · " + t.assignee_title : ""}` : "Atanmamış");
  const comments = data.comments
    .map(
      (c) => `<article class="comment">
        <div class="comment-top">
          <strong>${esc(c.name)}</strong>
          <span class="muted">${esc(c.created_at)}</span>
          ${c.can_delete ? `<button type="button" class="ghost-btn" data-act="del-note" data-id="${t.id}" data-note="${c.id}">×</button>` : ""}
        </div>
        <p>${esc(c.body)}</p>
      </article>`
    )
    .join("") || empty("Açıklama yok.");
  const priorityOpts = ["low", "medium", "high"]
    .map((key) => `<option value="${key}" ${(t.priority || t.focus) === key ? "selected" : ""}>${esc({ low: "Düşük", medium: "Orta", high: "Yüksek" }[key])}</option>`)
    .join("");
  const productOpts = [`<option value="">Ürün seç</option>`]
    .concat((data.products || []).map((p) => `<option value="${esc(p.name)}" ${t.project === p.name ? "selected" : ""}>${esc(p.name)}</option>`))
    .join("");
  const selectedPeople = new Set(t.bundle_assignee_ids || (t.assignee_id ? [t.assignee_id] : []));
  const peopleChecks = (data.members || [])
    .map((m) => `<label class="check-line"><input type="checkbox" name="targets" value="${m.id}" ${selectedPeople.has(m.id) ? "checked" : ""}/> <span>${esc(m.name)}</span></label>`)
    .join("");
  const fields = t.can_edit
    ? `<form id="form-edit" class="new-task" data-id="${t.id}">
        <div class="field-row">
          <label>Başlık <input name="title" required value="${esc(t.title)}" /></label>
          <label>Ürün <select name="project">${productOpts}</select></label>
        </div>
        <label>Açıklama <textarea name="description" rows="3">${esc(t.description || "")}</textarea></label>
        <div class="field-row">
          <label>En geç <input type="date" name="deadline_date" value="${esc(t.deadline_date || "")}" /></label>
          <label>Saat <input type="time" name="deadline_time" value="${esc(t.deadline_time || "")}" /></label>
        </div>
        <div class="field-row">
          <label>Süre <input name="estimated_time" value="${esc(t.estimated_time || "")}" /></label>
          <label>Öncelik <select name="priority">${priorityOpts}</select></label>
        </div>
        ${data.can_assign ? `<p class="form-kicker">Kişiler</p><div class="member-picks">${peopleChecks}</div>` : ""}
        <button class="primary" type="submit">Kaydet</button>
      </form>`
    : `<div class="info-grid">
        <p><span>Ürün</span>${esc(t.project || "—")}</p>
        <p><span>Açıklama</span>${esc(t.description || "—")}</p>
        <p><span>En geç</span>${esc(t.deadline_date || "—")}${t.deadline_time ? " " + esc(t.deadline_time) : ""}</p>
        <p><span>Süre</span>${esc(t.estimated_time || "—")}</p>
        <p><span>Öncelik</span>${esc(t.priority_label || "—")}</p>
        <p><span>Atanan</span>${esc(assigned)}</p>
      </div>`;
  const closeBtn = t.can_toggle
    ? `<button type="button" class="primary task-close" data-act="toggle" data-id="${t.id}">${t.done ? "Yeniden aç" : "Tamamladım"}</button>`
    : "";
  document.getElementById("view-task").innerHTML = `
    <p class="eyebrow"><button type="button" class="text-btn" data-go="agenda">← Ajanda</button></p>
    <h1>${esc(t.title)}</h1>
    <div class="meta">
      <span class="chip">${t.kind === "assigned" ? "Kurucu işi" : "Kişisel"}</span>
      ${t.warning ? `<span class="chip late">UYARI</span>` : ""}
      ${t.closed_by ? `<span class="chip closed">${esc(t.closed_by)} kapattı</span>` : ""}
      ${t.can_edit ? "" : `<span class="chip">Salt okunur</span>`}
    </div>
    ${closeBtn}
    <section class="panel">
      <div class="panel-head"><h2>İş bilgileri</h2></div>
      ${t.can_edit ? "" : `<p class="hint">Alanları değiştiremezsin. Açıklama ekleyebilir, kendi eklediklerini silebilirsin.</p>`}
      ${fields}
    </section>
    <section class="panel"><h2>Ek açıklamalar</h2>
      <div class="comment-list">${comments}</div>
      <form id="form-comment" class="new-task" data-id="${t.id}">
        <textarea name="body" rows="3" required placeholder="Yeni açıklama"></textarea>
        <button class="primary" type="submit">Açıklama ekle</button>
      </form>
    </section>`;
  hideViews();
  document.getElementById("view-task").hidden = false;
  document.getElementById("week-nav").hidden = true;
}

async function loadProducts() {
  const data = await api("/api/products");
  const cards = data.products
    .map(
      (p) => `<a class="member-card" href="#" data-product="${p.id}">
        <strong>${esc(p.name)}</strong><span class="role-tag">${esc(p.phase_label || "—")}</span>
        <p class="member-stats">${p.purpose ? `${esc(p.purpose)}<br>` : ""}${p.active_count} açık iş · Görevliler: ${esc(crewNames(p.members))}</p>
      </a>`
    )
    .join("") || empty("Henüz ürün yok.");
  const peopleBox = data.can_add
    ? `<p class="form-kicker">Görevliler</p><div class="member-picks">${memberChecks(data.people, [])}</div>`
    : "";
  document.getElementById("view-products").innerHTML = `
    <section class="panel"><div class="panel-head"><h2>Ürünler</h2><span class="count">${data.products.length}</span></div>
      <p class="hint">Ürüne girince fazı, amacı, teknolojileri, görevliler ve görev geçmişi görünür.</p>
      <div class="team-list">${cards}</div></section>
    ${data.can_add ? `<section class="panel"><h2>Ürün ekle</h2>
      <form class="new-task" id="form-product">
        <input name="name" placeholder="Ürün adı" required />
        ${phaseBoard(data.phases, { phase: "planning", done_phases: [], upcoming_phases: (data.phases || []).filter((p) => p.id !== "planning") })}
        <textarea name="problem" rows="2" placeholder="Çözdüğü sorun"></textarea>
        <textarea name="purpose" rows="2" placeholder="Kısaca amacı"></textarea>
        <input name="tech" placeholder="Kullanılan teknolojiler" />
        ${peopleBox}
        <button class="primary" type="submit">Ekle</button>
      </form></section>` : ""}`;
  hideViews();
  document.getElementById("view-products").hidden = false;
  document.getElementById("week-nav").hidden = true;
  setNav("products");
  bindPhaseBoard(document.getElementById("form-product"));
}

async function loadProduct(id) {
  const data = await api(`/api/products/${id}`);
  const p = data.product;
  const crew = (p.members || [])
    .map((u) => {
      const open = (p.people || []).find((x) => x.id === u.id);
      return `<li><strong>${esc(u.name)}</strong>${u.title ? ` <span class="muted">${esc(u.title)}</span>` : ""}${open ? ` <span class="muted">· ${open.open_tasks} açık iş</span>` : ""}</li>`;
    })
    .join("");
  const open = data.tasks.filter((t) => !t.done);
  const done = data.tasks.filter((t) => t.done);
  const edit = data.can_edit
    ? `<section class="panel"><h2>Ürün bilgileri</h2>
        <form class="new-task" id="form-product-edit" data-id="${p.id}">
          <input name="name" required value="${esc(p.name)}" />
          ${phaseBoard(data.phases, p)}
          <label>Çözdüğü sorun <textarea name="problem" rows="2">${esc(p.problem || "")}</textarea></label>
          <label>Kısaca amacı <textarea name="purpose" rows="2">${esc(p.purpose || "")}</textarea></label>
          <label>Teknolojiler <input name="tech" value="${esc(p.tech || "")}" /></label>
          <p class="form-kicker">Görevliler</p>
          <div class="member-picks">${memberChecks(data.people, p.member_ids)}</div>
          <button class="primary" type="submit">Kaydet</button>
        </form></section>`
    : `<section class="panel info-grid">
        <p><span>Çözdüğü sorun</span>${esc(p.problem || "—")}</p>
        <p><span>Kısaca amacı</span>${esc(p.purpose || "—")}</p>
        <p><span>Teknolojiler</span>${esc(p.tech || "—")}</p>
      </section>`;
  const notes = (data.notes || [])
    .map(
      (n) => `<article class="comment">
        <div class="comment-top">
          <span class="muted">${esc(n.created_at)}</span>
          ${n.can_delete ? `<button type="button" class="ghost-btn" data-act="del-phase-note" data-id="${p.id}" data-note="${n.id}">×</button>` : ""}
        </div>
        <p>${esc(n.body)}</p>
      </article>`
    )
    .join("") || empty("Henüz faz notu yok.");
  const noteForm = data.can_note
    ? `<form id="form-phase-note" class="new-task" data-id="${p.id}">
        <textarea name="body" rows="3" required placeholder="Faz notu"></textarea>
        <button class="primary" type="submit">Not bırak</button>
      </form>`
    : "";
  const crewPanel = `<section class="panel">
        <div class="panel-head"><h2>Görevliler</h2><span class="count">${(p.members || []).length}</span></div>
        ${crew ? `<ul class="crew-list">${crew}</ul>` : empty("Henüz görevli yok.")}
      </section>`;
  document.getElementById("view-product").innerHTML = `
    <p class="eyebrow"><button type="button" class="text-btn" data-go="products">← Ürünler</button></p>
    <h1>${esc(p.name)}</h1>
    ${data.can_edit ? "" : phaseView(p)}
    ${edit}
    <section class="panel">
      <div class="panel-head"><h2>${esc(data.note_heading || "Faz Notu")}</h2><span class="count">${(data.notes || []).length}</span></div>
      <div class="comment-list">${notes}</div>
      ${noteForm}
    </section>
    ${crewPanel}
    <section class="panel"><div class="panel-head"><h2>Açık görevler</h2><span class="count">${open.length}</span></div>
      <div class="card-list">${open.map((t) => card(t, true)).join("") || empty("Açık iş yok.")}</div>
    </section>
    <section class="panel"><div class="panel-head"><h2>Geçmiş</h2><span class="count">${done.length}</span></div>
      <p class="hint">Tamamlanan görevler.</p>
      <div class="card-list">${done.map((t) => card(t, true)).join("") || empty("Henüz tamamlanan iş yok.")}</div>
    </section>`;
  hideViews();
  document.getElementById("view-product").hidden = false;
  document.getElementById("week-nav").hidden = true;
  setNav("products");
  state.productId = id;
  bindPhaseBoard(document.getElementById("form-product-edit"));
}

function formFields(form) {
  const d = new FormData(form);
  return Object.fromEntries(d.entries());
}

function checkedValues(form, name) {
  return [...form.querySelectorAll(`[name="${name}"]:checked`)].map((el) => el.value);
}

document.getElementById("login-form").onsubmit = async (event) => {
  event.preventDefault();
  const err = document.getElementById("login-error");
  err.hidden = true;
  try {
    const fields = formFields(event.target);
    const data = await api("/api/login", { method: "POST", body: fields });
    state.token = data.token;
    localStorage.setItem("ajanda_token", data.token);
    show("screen-app");
    await loadAgenda();
  } catch (e) {
    err.textContent = e.message;
    err.hidden = false;
  }
};

document.getElementById("btn-logout").onclick = async () => {
  try {
    await api("/api/logout", { method: "POST" });
  } catch {}
  state.token = "";
  localStorage.removeItem("ajanda_token");
  show("screen-login");
};
document.getElementById("prev-week").onclick = async () => {
  state.week -= 1;
  await loadAgenda();
};
document.getElementById("next-week").onclick = async () => {
  state.week += 1;
  await loadAgenda();
};
document.getElementById("this-week").onclick = async () => {
  state.week = 0;
  await loadAgenda();
};

document.body.addEventListener("click", async (event) => {
  const go = event.target.closest("[data-go]");
  if (go) {
    if (go.dataset.go === "agenda") {
      state.boardUser = "";
      await loadAgenda();
    }
    if (go.dataset.go === "ekip") await loadEkip();
    if (go.dataset.go === "products") await loadProducts();
  }
  const member = event.target.closest("[data-member]");
  if (member) {
    event.preventDefault();
    await loadMember(member.dataset.member);
  }
  const board = event.target.closest("[data-board]");
  if (board) {
    event.preventDefault();
    state.boardUser = board.dataset.board;
    await loadAgenda();
  }
  const product = event.target.closest("[data-product]");
  if (product) {
    event.preventDefault();
    await loadProduct(product.dataset.product);
  }
  const act = event.target.closest("[data-act]");
  if (!act) return;
  const id = act.dataset.id;
  if (act.dataset.act === "open") await loadTask(id);
  if (act.dataset.act === "toggle") {
    await api(`/api/tasks/${id}/toggle`, { method: "POST" });
    if (!document.getElementById("view-task").hidden) await loadTask(id);
    else if (!document.getElementById("view-product").hidden && state.productId) await loadProduct(state.productId);
    else if (!document.getElementById("view-member").hidden && state.memberId) await loadMember(state.memberId);
    else await loadAgenda();
  }
  if (act.dataset.act === "delete") {
    if (!confirm("Bu işi silmek istediğine emin misin?")) return;
    await api(`/api/tasks/${id}/delete`, { method: "POST" });
    await loadAgenda();
  }
  if (act.dataset.act === "del-note") {
    if (!confirm("Bu açıklamayı silmek istediğine emin misin?")) return;
    await api(`/api/tasks/${id}/comment/${act.dataset.note}/delete`, { method: "POST" });
    await loadTask(id);
  }
  if (act.dataset.act === "del-phase-note") {
    if (!confirm("Bu faz notunu silmek istediğine emin misin?")) return;
    await api(`/api/products/${id}/notes/${act.dataset.note}/delete`, { method: "POST" });
    await loadProduct(id);
  }
});

document.getElementById("form-personal").onsubmit = async (event) => {
  event.preventDefault();
  const body = formFields(event.target);
  body.kind = "personal";
  await api("/api/tasks", { method: "POST", body });
  event.target.reset();
  await loadAgenda();
};
document.getElementById("form-assign").onsubmit = async (event) => {
  event.preventDefault();
  const body = formFields(event.target);
  body.kind = "assigned";
  body.targets = checkedValues(event.target, "targets");
  await api("/api/tasks", { method: "POST", body });
  event.target.reset();
  await loadAgenda();
};

document.getElementById("view-ekip").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (event.target.id === "form-user") {
    const body = formFields(event.target);
    const data = await api("/api/ekip/users", { method: "POST", body });
    const box = document.getElementById("issued");
    box.hidden = false;
    box.textContent = `kullanıcı: ${data.issued.username}\nünvan: ${data.issued.title}\nşifre: ${data.issued.password}\nrol: ${data.issued.role}`;
    await loadEkip();
    document.getElementById("issued").hidden = false;
    document.getElementById("issued").textContent = box.textContent;
  }
});

document.getElementById("view-task").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (event.target.id === "form-edit") {
    const body = formFields(event.target);
    body.targets = checkedValues(event.target, "targets");
    try {
      const data = await api(`/api/tasks/${event.target.dataset.id}`, { method: "POST", body });
      if (data.deleted) {
        await loadAgenda();
        return;
      }
      await loadTask(event.target.dataset.id);
    } catch (e) {
      alert(e.message);
    }
  }
  if (event.target.id === "form-comment") {
    await api(`/api/tasks/${event.target.dataset.id}/comment`, {
      method: "POST",
      body: { body: event.target.body.value },
    });
    await loadTask(event.target.dataset.id);
  }
});

document.getElementById("view-products").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (event.target.id === "form-product") {
    const body = formFields(event.target);
    body.member_ids = checkedValues(event.target, "member_ids");
    body.done_phases = checkedValues(event.target, "done_phases");
    body.upcoming_phases = checkedValues(event.target, "upcoming_phases");
    await api("/api/products", { method: "POST", body });
    await loadProducts();
  }
});

document.getElementById("view-product").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (event.target.id === "form-product-edit") {
    const body = formFields(event.target);
    body.member_ids = checkedValues(event.target, "member_ids");
    body.done_phases = checkedValues(event.target, "done_phases");
    body.upcoming_phases = checkedValues(event.target, "upcoming_phases");
    await api(`/api/products/${event.target.dataset.id}`, { method: "POST", body });
    await loadProduct(event.target.dataset.id);
  }
  if (event.target.id === "form-phase-note") {
    await api(`/api/products/${event.target.dataset.id}/notes`, {
      method: "POST",
      body: { body: event.target.body.value },
    });
    await loadProduct(event.target.dataset.id);
  }
});

document.getElementById("board-pick").onchange = async (event) => {
  const id = event.target.value || "";
  state.boardUser = state.me && id === state.me.id ? "" : id;
  await loadAgenda();
};

(async function boot() {
  if (!state.token) {
    show("screen-login");
    return;
  }
  try {
    await api("/api/me");
    show("screen-app");
    await loadAgenda();
  } catch {
    state.token = "";
    localStorage.removeItem("ajanda_token");
    show("screen-login");
  }
})();
