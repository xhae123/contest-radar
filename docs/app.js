const state = { data: null, cat: "ALL", q: "", visibleList: [] };
const $ = (s) => document.querySelector(s);
const pad = (n) => String(n).padStart(2, "0");
const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function daysUntil(iso) {
  const t = new Date(); t.setHours(0, 0, 0, 0);
  const d = new Date(iso); d.setHours(0, 0, 0, 0);
  return Math.round((d - t) / 86400000);
}

function ddInfo(deadline, status) {
  const dd = daysUntil(deadline);
  if (status === "expired" || dd < 0) return { text: "마감", cls: "expired" };
  if (dd === 0) return { text: "D-DAY", cls: "urgent" };
  if (dd <= 1) return { text: `D-${dd}`, cls: "urgent" };
  if (dd <= 3) return { text: `D-${dd}`, cls: "soon" };
  return { text: `D-${dd}`, cls: "" };
}

function passesFilter(c) {
  if (c.status === "expired") return false;
  if (state.cat !== "ALL" && c.category !== state.cat) return false;
  if (state.q) {
    const hay = (c.title + " " + (c.host || "") + " " + (c.tags || []).join(" ") + " " + (c.ai_take || "")).toLowerCase();
    if (!hay.includes(state.q.toLowerCase())) return false;
  }
  return true;
}

function sortFn(a, b) {
  if (a.is_new !== b.is_new) return a.is_new ? -1 : 1;
  return new Date(b.first_seen) - new Date(a.first_seen);
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
}

/* ── list ── */

function renderList() {
  const upd = new Date(state.data.updated_at);
  $("#updated").textContent = `${isoDate(upd)} ${pad(upd.getHours())}:${pad(upd.getMinutes())} 업데이트`;

  state.visibleList = state.data.contests.filter(passesFilter).sort(sortFn);
  $("#list").innerHTML = state.visibleList.map(cardHTML).join("") ||
    `<div class="empty">해당 조건에 맞는 공모전이 없습니다.</div>`;

  $("#list").querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      location.hash = card.dataset.id;
    });
  });
}

function cardHTML(c) {
  const d = ddInfo(c.deadline, c.status);
  const cls = ["card"];
  if (c.status === "expired") cls.push("expired");

  return `
    <article class="${cls.join(" ")}" data-id="${c.id}">
      <div class="poster">${c.image ? `<img src="${c.image}" alt="" loading="lazy" />` : ""}</div>
      <div class="card-body">
        <div class="card-top">
          <span class="cat-dot c-${c.category}">${c.category}</span>
          <span class="dn-badge ${d.cls}">${d.text}</span>
        </div>
        <h2 class="title">${escapeHTML(c.title)}</h2>
        <div class="host">${c.host ? escapeHTML(c.host) : ""}</div>
      </div>
    </article>
  `;
}

/* ── detail ── */

function renderDetail(id) {
  const c = state.data.contests.find(x => x.id === id);
  if (!c) { showList(); return; }

  const d = ddInfo(c.deadline, c.status);

  $("#detail-page").innerHTML = `
    <div class="dp-header">
      <span class="dp-cat c-${c.category}">${c.category}</span>
      <span class="dp-deadline ${d.cls}">${d.text} · ${c.deadline}</span>
      ${c.is_new ? `<span class="dp-new">NEW</span>` : ""}
    </div>
    <h1 class="dp-title">${escapeHTML(c.title)}</h1>
    <div class="dp-meta">
      ${c.host ? `<div><span class="label">주관</span> <span class="val">${escapeHTML(c.host)}</span></div>` : ""}
      ${c.prize_line ? `<div><span class="label">상금</span> <span class="prize-val">${escapeHTML(c.prize_line)}</span></div>` : ""}
    </div>
    ${c.image ? `<div class="dp-poster"><img src="${c.image}" alt="" /></div>` : ""}
    ${c.ai_take ? `<div class="dp-take">${escapeHTML(c.ai_take)}</div>` : ""}
    <div class="dp-md">${marked.parse(c.detail_markdown || "")}</div>
    <a class="dp-orig" href="${c.url}" target="_blank" rel="noopener">원문 보기</a>
  `;

  const posterEl = $("#detail-page .dp-poster");
  if (posterEl) {
    posterEl.addEventListener("click", () => openLightbox(c));
  }

  showDetail();
}

/* ── view switching ── */

function showList() {
  $("#list-view").hidden = false;
  $("#detail-view").hidden = true;
  window.scrollTo(0, state.scrollY || 0);
}

function showDetail() {
  state.scrollY = window.scrollY;
  $("#list-view").hidden = true;
  $("#detail-view").hidden = false;
  window.scrollTo(0, 0);
}

/* ── lightbox ── */

function openLightbox(c) {
  $("#lb-img").src = c.image;
  $(".lb-prev").style.display = "none";
  $(".lb-next").style.display = "none";
  $("#lightbox").hidden = false;
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  $("#lightbox").hidden = true;
  document.body.style.overflow = "";
}

/* ── routing ── */

function route() {
  const hash = location.hash.slice(1);
  if (hash && hash !== "list") {
    renderDetail(decodeURIComponent(hash));
  } else {
    showList();
  }
}

/* ── init ── */

async function init() {
  const res = await fetch("data.json", { cache: "no-store" });
  state.data = await res.json();

  $("#cats").querySelectorAll("button").forEach(b => {
    b.onclick = () => {
      state.cat = b.dataset.cat;
      $("#cats").querySelectorAll("button").forEach(x => x.classList.toggle("active", x === b));
      renderList();
    };
  });
  $("#q").oninput = (e) => { state.q = e.target.value; renderList(); };
  $("#back").onclick = () => { location.hash = "list"; };

  $(".lb-close").onclick = closeLightbox;
  $("#lightbox").addEventListener("click", (e) => { if (e.target === $("#lightbox")) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#lightbox").hidden) closeLightbox(); });

  window.addEventListener("hashchange", route);

  renderList();
  route();
}

window.addEventListener("DOMContentLoaded", init);
