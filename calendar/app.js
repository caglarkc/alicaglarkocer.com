const API = window.AJANDA_API.replace(/\/$/, "");
const state = {
  token: localStorage.getItem("ajanda_token") || "",
  pending: "",
  pinMode: "enter",
  week: 0,
  boardUser: "",
  me: null,
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
  const token = options.pending ? state.pending : state.token;
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
  const cls = `task focus-${task.focus || "medium"}${task.done ? " done" : ""}${task.kind === "assigned" ? " assigned" : ""}`;
  const drag = task.can_schedule ? `draggable="true"` : "";
  const mark = check && task.can_schedule
    ? `<button type="button" class="check-btn" data-act="toggle" data-id="${task.id}">${task.done ? "✓" : "○"}</button>`
    : "";
  const del = task.can_edit
    ? `<button type="button" class="ghost-btn" data-act="delete" data-id="${task.id}">×</button>`
    : "";
  const chips = [
    task.kind === "assigned" ? `<span class="chip lock">Kurucu işi</span>` : `<span class="chip">Kişisel</span>`,
    task.deadline_date ? `<span class="chip">En geç ${task.deadline_date}${task.deadline_time ? " " + task.deadline_time : ""}</span>` : "",
    task.estimated_time ? `<span class="chip">${task.estimated_time}</span>` : "",
    `<span class="chip">${task.focus_label || ""}</span>`,
    `<span class="chip">${task.comment_count || 0} yorum</span>`,
  ].join("");
  return `<article class="${cls}" ${drag} data-id="${task.id}">
    <div class="task-top">
      ${mark}
      <div class="task-heading">
        ${task.project ? `<p class="task-project">${esc(task.project)}</p>` : ""}
        <p class="task-title">${esc(task.title)}</p>
      </div>
      <div class="task-actions">
        <button type="button" class="ghost-btn" data-act="open" data-id="${task.id}">↪</button>
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

function bindDrop() {
  document.querySelectorAll("[data-drop]").forEach((zone) => {
    zone.ondragover = (event) => {
      event.preventDefault();
      zone.classList.add("drag-over");
    };
    zone.ondragleave = () => zone.classList.remove("drag-over");
    zone.ondrop = async (event) => {
      event.preventDefault();
      zone.classList.remove("drag-over");
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
  document.getElementById("eyebrow").textContent = data.viewing_other
    ? `Ekip · ${data.assignee.name}${data.assignee.title ? " · " + data.assignee.title : ""}`
    : `${data.user.name}${data.user.title ? " · " + data.user.title : " · " + data.user.role_label}`;
  document.getElementById("btn-ekip").hidden = !data.can_manage;
  document.getElementById("week-range").textContent = data.week_range;
  document.getElementById("form-assign").hidden = !data.can_assign;
  document.getElementById("inbox-count").textContent = data.inbox.length;
  document.getElementById("missed-count").textContent = data.missed.length;
  document.getElementById("inbox-list").innerHTML = data.inbox.map((t) => card(t, false)).join("") || empty("Liste boş.");
  document.getElementById("missed-list").innerHTML = data.missed.map((t) => card(t, false)).join("") || empty("Kaçırılan iş yok.");
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
        <span>${esc(item.actor_name)}${item.project ? " · " + esc(item.project) : ""}</span>
      </button>`
    )
    .join("") || empty("Henüz yok.");
  const select = document.getElementById("assign-target");
  select.innerHTML = [
    ...data.members.map((m) => `<option value="user:${m.id}">${esc(m.name)}${m.title ? " · " + esc(m.title) : ""} (${esc(m.role)})</option>`),
    ...data.groups.map((g) => `<option value="group:${g.id}">Grup: ${esc(g.name)}</option>`),
  ].join("");
  bindDrop();
  document.getElementById("view-agenda").hidden = false;
  document.getElementById("view-ekip").hidden = true;
  document.getElementById("view-task").hidden = true;
  document.getElementById("week-nav").hidden = false;
}

async function loadEkip() {
  const data = await api("/api/ekip");
  const people = data.people
    .map(
      (p) => `<a class="member-card" href="#" data-board="${p.id}">
        <strong>${esc(p.name)}</strong><span class="role-tag">${esc(p.title || "—")}</span>
        <p class="member-stats">${esc(p.username)} · ${esc(p.role)}<br>
        Bugün ${p.stats.today} açık · ${p.stats.done_today} bitti · kuyruk ${p.stats.inbox} · kaçan ${p.stats.missed}</p>
      </a>`
    )
    .join("");
  const checks = (ids) =>
    data.people
      .map(
        (p) => `<label class="check-line"><input type="checkbox" name="member_id" value="${p.id}" ${ids.includes(p.id) ? "checked" : ""}/> ${esc(p.name)}</label>`
      )
      .join("");
  const groups = data.groups
    .map(
      (g) => `<form class="new-task group-edit" data-group="${g.id}">
        <input name="name" value="${esc(g.name)}" required />
        <div class="member-picks">${checks(g.member_ids)}</div>
        <button class="secondary" type="submit">Grubu kaydet</button>
      </form>`
    )
    .join("");
  document.getElementById("view-ekip").innerHTML = `
    <section class="panel"><div class="panel-head"><h2>Üyeler</h2><span class="count">${data.people.length}</span></div>
      <div class="team-list">${people}</div></section>
    <section class="panel"><h2>Kullanıcı ekle</h2>
      <form class="new-task" id="form-user">
        <div class="field-row"><input name="username" placeholder="Kullanıcı adı" required /><input name="name" placeholder="İsim" required /></div>
        <div class="field-row"><input name="title" placeholder="Ünvan" required />
          <select name="role"><option value="worker">Worker</option><option value="admin">Admin</option></select>
        </div>
        <label>6 haneli PIN <input name="pin" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" required /></label>
        <button class="primary" type="submit">Oluştur</button>
      </form>
      <pre class="key-banner" id="issued" hidden></pre>
    </section>
    <section class="panel"><h2>Gruplar</h2>
      <form class="new-task" id="form-group">
        <input name="name" placeholder="Grup adı" required />
        <div class="member-picks">${checks([])}</div>
        <button class="primary" type="submit">Grup kur</button>
      </form>
      ${groups}
    </section>`;
  document.getElementById("view-agenda").hidden = true;
  document.getElementById("view-task").hidden = true;
  document.getElementById("view-ekip").hidden = false;
  document.getElementById("week-nav").hidden = true;
}

async function loadTask(id) {
  const data = await api(`/api/tasks/${id}`);
  const t = data.task;
  const comments = data.comments
    .map((c) => `<article class="comment"><strong>${esc(c.name)}</strong><span class="muted">${esc(c.created_at)}</span><p>${esc(c.body)}</p></article>`)
    .join("") || empty("Yorum yok.");
  const dist = data.group
    ? `<section class="panel"><h2>Gruba dağıt</h2>
        <form id="form-dist" class="new-task">${data.group.members
          .map((m) => `<label class="check-line"><input type="checkbox" name="member_id" value="${m.id}" checked /> ${esc(m.name)}</label>`)
          .join("")}<button class="primary" type="submit">Dağıt</button></form></section>`
    : "";
  document.getElementById("view-task").innerHTML = `
    <p class="eyebrow"><button type="button" class="text-btn" data-go="agenda">← Ajanda</button></p>
    <h1>${esc(t.title)}</h1>
    <div class="meta"><span class="chip">${t.kind === "assigned" ? "Kurucu işi" : "Kişisel"}</span></div>
    ${t.can_edit ? "" : `<section class="panel"><p class="hint">Bu işi yalnızca kurucu değiştirir.</p><p class="task-desc">${esc(t.description)}</p></section>`}
    ${dist}
    <section class="panel"><h2>Yorumlar</h2>
      <div class="comment-list">${comments}</div>
      <form id="form-comment" class="new-task" data-id="${t.id}">
        <textarea name="body" rows="3" required placeholder="Not / açıklama"></textarea>
        <button class="primary" type="submit">Yorum ekle</button>
      </form>
    </section>`;
  document.getElementById("view-agenda").hidden = true;
  document.getElementById("view-ekip").hidden = true;
  document.getElementById("view-task").hidden = false;
  document.getElementById("week-nav").hidden = true;
}

function formFields(form) {
  const d = new FormData(form);
  return Object.fromEntries(d.entries());
}

document.getElementById("login-form").onsubmit = async (event) => {
  event.preventDefault();
  const err = document.getElementById("login-error");
  err.hidden = true;
  try {
    const fields = formFields(event.target);
    const data = await api("/api/login", { method: "POST", body: fields });
    state.pending = data.token;
    state.pinMode = data.need_pin;
    document.getElementById("pin-title").textContent = data.need_pin === "set" ? "6 haneli PIN belirle" : "PIN";
    document.getElementById("pin2-wrap").hidden = data.need_pin !== "set";
    document.getElementById("pin-form").pin2.required = data.need_pin === "set";
    show("screen-pin");
  } catch (e) {
    err.textContent = e.message;
    err.hidden = false;
  }
};

document.getElementById("pin-form").onsubmit = async (event) => {
  event.preventDefault();
  const err = document.getElementById("pin-error");
  err.hidden = true;
  try {
    const fields = formFields(event.target);
    const data = await api("/api/pin", {
      method: "POST",
      body: { token: state.pending, pin: fields.pin, pin2: fields.pin2 || "" },
    });
    state.token = data.token;
    localStorage.setItem("ajanda_token", data.token);
    state.pending = "";
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
  }
  const board = event.target.closest("[data-board]");
  if (board) {
    event.preventDefault();
    state.boardUser = board.dataset.board;
    await loadAgenda();
  }
  const act = event.target.closest("[data-act]");
  if (!act) return;
  const id = act.dataset.id;
  if (act.dataset.act === "open") await loadTask(id);
  if (act.dataset.act === "toggle") {
    await api(`/api/tasks/${id}/toggle`, { method: "POST" });
    await loadAgenda();
  }
  if (act.dataset.act === "delete") {
    await api(`/api/tasks/${id}/delete`, { method: "POST" });
    await loadAgenda();
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
    box.textContent = `kullanıcı: ${data.issued.username}\nünvan: ${data.issued.title}\nşifre: ${data.issued.password}\nPIN: ${data.issued.pin}\nrol: ${data.issued.role}`;
    await loadEkip();
    document.getElementById("issued").hidden = false;
    document.getElementById("issued").textContent = box.textContent;
  }
  if (event.target.id === "form-group") {
    const member_ids = [...event.target.querySelectorAll("[name=member_id]:checked")].map((el) => el.value);
    await api("/api/ekip/groups", { method: "POST", body: { name: event.target.name.value, member_ids } });
    await loadEkip();
  }
  if (event.target.dataset.group) {
    const member_ids = [...event.target.querySelectorAll("[name=member_id]:checked")].map((el) => el.value);
    await api(`/api/ekip/groups/${event.target.dataset.group}`, {
      method: "POST",
      body: { name: event.target.name.value, member_ids },
    });
    await loadEkip();
  }
});

document.getElementById("view-task").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (event.target.id === "form-comment") {
    await api(`/api/tasks/${event.target.dataset.id}/comment`, {
      method: "POST",
      body: { body: event.target.body.value },
    });
    await loadTask(event.target.dataset.id);
  }
  if (event.target.id === "form-dist") {
    const member_ids = [...event.target.querySelectorAll("[name=member_id]:checked")].map((el) => el.value);
    const id = document.querySelector("#form-comment").dataset.id;
    await api(`/api/tasks/${id}/distribute`, { method: "POST", body: { member_ids } });
    state.boardUser = "";
    await loadAgenda();
  }
});

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
