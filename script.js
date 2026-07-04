/* =========================================================
   BAYAR DONG — script.js
   Vanilla JS, client-side only, persisted via localStorage
   ========================================================= */
(function(){
"use strict";

/* ---------------------------------------------------------
   0. ICONS (inline SVG, stroke = currentColor)
--------------------------------------------------------- */
const ICONS = {
  home:'<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/></svg>',
  history:'<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 8v4l3 2"/></svg>',
  bolt:'<svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>',
  droplet:'<svg viewBox="0 0 24 24"><path d="M12 3s7 7.4 7 12a7 7 0 0 1-14 0c0-4.6 7-12 7-12Z"/></svg>',
  wifi:'<svg viewBox="0 0 24 24"><path d="M2 8.5a16 16 0 0 1 20 0"/><path d="M5.5 12.5a11 11 0 0 1 13 0"/><path d="M9 16.5a5.5 5.5 0 0 1 6 0"/><circle cx="12" cy="20" r="1"/></svg>',
  heart:'<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.7-10-9.3C.5 8 2 4.5 5.6 4A5 5 0 0 1 12 7a5 5 0 0 1 6.4-3c3.6.5 5 4 3.6 7.7C19.5 16.3 12 21 12 21Z"/></svg>',
  phone:'<svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>',
  signal:'<svg viewBox="0 0 24 24"><path d="M4 20v-3"/><path d="M9 20v-7"/><path d="M14 20v-11"/><path d="M19 20V5"/></svg>',
  wallet:'<svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="19" height="14" rx="2.5"/><path d="M2.5 10h19"/><circle cx="17" cy="15" r="1.2" fill="currentColor" stroke="none"/></svg>',
  plus:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  check:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m8 12.5 2.5 2.5L16 9.5"/></svg>',
  x:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m9 9 6 6M15 9l-6 6"/></svg>',
  tv:'<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 21h8M12 18v3"/></svg>',
  sun:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v3M12 18.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>',
  moon:'<svg viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/></svg>',
  card:'<svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 9.5h19"/><path d="M6 15h4"/></svg>',
  bank:'<svg viewBox="0 0 24 24"><path d="M3 10 12 4l9 6"/><path d="M5 10v9M9.5 10v9M14.5 10v9M19 10v9"/><path d="M3 19h18"/></svg>',
  qr:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20h1"/></svg>',
  logout:'<svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
};
function iconSVG(name){ return ICONS[name] || ""; }
function paintIcons(root){
  (root||document).querySelectorAll("[data-icon]").forEach(el=>{
    if(!el.dataset.painted){ el.innerHTML = iconSVG(el.dataset.icon); el.dataset.painted="1"; }
  });
}

/* ---------------------------------------------------------
   1. HELPERS
--------------------------------------------------------- */
function rupiah(n){
  return "Rp" + Math.round(n).toLocaleString("id-ID");
}
function pad(n){ return n.toString().padStart(2,"0"); }
function formatDate(d){
  const bulan=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  return `${pad(d.getDate())} ${bulan[d.getMonth()]} ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function uid(prefix){
  return (prefix||"TRX")+"-"+Date.now().toString(36).toUpperCase()+"-"+Math.floor(Math.random()*900+100);
}
function hashStr(str){
  let h=0;
  for(let i=0;i<str.length;i++){ h = (h*31 + str.charCodeAt(i)) >>> 0; }
  return h;
}
function pick(arr, seed){ return arr[seed % arr.length]; }
function sleep(ms){ return new Promise(res=>setTimeout(res,ms)); }

/* ---------------------------------------------------------
   2. STATE (persisted in localStorage)
--------------------------------------------------------- */
const LS_SALDO = "bayarDong_saldo";
const LS_RIWAYAT = "bayarDong_riwayat";

let state = {
  saldo: 0,
  riwayat: [],
};

function loadState(){
  const savedSaldo = localStorage.getItem(LS_SALDO);
  const savedRiwayat = localStorage.getItem(LS_RIWAYAT);
  state.saldo = savedSaldo !== null ? Number(savedSaldo) : 250000;
  state.riwayat = savedRiwayat ? JSON.parse(savedRiwayat) : [];
  if(savedSaldo === null) persistSaldo();
}
function persistSaldo(){ localStorage.setItem(LS_SALDO, String(state.saldo)); }
function persistRiwayat(){ localStorage.setItem(LS_RIWAYAT, JSON.stringify(state.riwayat)); }

function addTransaction(trx){
  state.riwayat.unshift(trx);
  persistRiwayat();
}

/* ---------------------------------------------------------
   3. DATA CONFIG — kategori tagihan, provider, nominal
--------------------------------------------------------- */
const NAMES = ["Budi Santoso","Siti Rahayu","Andi Wijaya","Dewi Lestari","Agus Prasetyo",
  "Rina Marlina","Fajar Nugroho","Putri Amelia","Hendra Gunawan","Sri Wahyuni",
  "Bambang Setiawan","Yuli Astuti","Doni Saputra","Lina Kartika","Eko Purnomo"];

const BILLERS = {
  listrik:{
    label:"Listrik PLN", icon:"bolt", admin:2500, min:250000, max:600000,
    idLabel:"Nomor Meter / ID Pelanggan", idPlaceholder:"Contoh: 530211098765",
    idMin:8, idMax:13, itemLabel:"Tagihan Listrik Pascabayar"
  },
  pdam:{
    label:"PDAM / Air", icon:"droplet", admin:2500, min:60000, max:220000,
    idLabel:"Nomor Pelanggan PDAM", idPlaceholder:"Contoh: 11029384",
    idMin:6, idMax:12, itemLabel:"Tagihan Air PDAM"
  },
  internet:{
    label:"Internet & TV Kabel", icon:"wifi", admin:5000, min:250000, max:480000,
    idLabel:"Nomor Pelanggan Internet/TV", idPlaceholder:"Contoh: 120033445",
    idMin:6, idMax:13, itemLabel:"Tagihan Internet & TV Kabel"
  },
  bpjs:{
    label:"BPJS Kesehatan", icon:"heart", admin:2500, premiPerAnggota:42000,
    idLabel:"Nomor Virtual Account / No. Peserta", idPlaceholder:"Contoh: 0001234567890",
    idMin:8, idMax:13, itemLabel:"Iuran BPJS Kesehatan", hasAnggota:true
  }
};

const PROVIDERS = [
  {name:"Telkomsel", color:"#D6002A", bg:"#FCE7EA", prefixes:["0811","0812","0813","0821","0822","0823","0851","0852","0853"]},
  {name:"XL", color:"#0B5FBF", bg:"#E6EFFC", prefixes:["0817","0818","0819","0859","0877","0878"]},
  {name:"Indosat", color:"#B7960B", bg:"#FBF3D9", prefixes:["0814","0815","0816","0855","0856","0857","0858"]},
  {name:"Tri", color:"#5A2D82", bg:"#EFE7F6", prefixes:["0895","0896","0897","0898","0899"]},
  {name:"Smartfren", color:"#D5560C", bg:"#FCEADD", prefixes:["0881","0882","0883","0884","0885","0886","0887","0888","0889"]},
];
function detectProvider(phone){
  const p4 = phone.slice(0,4);
  return PROVIDERS.find(p=>p.prefixes.includes(p4)) || null;
}

const PULSA_ITEMS = [5000,10000,20000,25000,50000,100000,150000,200000].map(v=>({
  value:v, label:rupiah(v), price:v + (v<50000?1000:1500)
}));
const DATA_ITEMS = [
  {label:"1GB / 3 Hari", price:15000},
  {label:"3GB / 7 Hari", price:33000},
  {label:"6GB / 14 Hari", price:49000},
  {label:"10GB / 30 Hari", price:69000},
  {label:"18GB / 30 Hari", price:99000},
  {label:"35GB / 30 Hari", price:149000},
];

const PAYMENT_METHODS = [
  {id:"saldo", label:"Saldo Bayar Dong", icon:"wallet", desc:"Potong langsung dari saldo akun kamu"},
  {id:"debit", label:"Kartu Debit/Kredit", icon:"card", desc:"Visa, Mastercard, GPN"},
  {id:"va", label:"Transfer Bank (Virtual Account)", icon:"bank", desc:"BCA, BRI, Mandiri, BNI"},
  {id:"qris", label:"QRIS", icon:"qr", desc:"Scan pakai e-wallet apa saja"},
];
function methodById(id){ return PAYMENT_METHODS.find(m=>m.id===id) || PAYMENT_METHODS[0]; }

const QUICK_ITEMS = [
  {icon:"bolt", label:"Listrik", view:"tagihan", cat:"listrik"},
  {icon:"droplet", label:"PDAM", view:"tagihan", cat:"pdam"},
  {icon:"wifi", label:"Internet", view:"tagihan", cat:"internet"},
  {icon:"heart", label:"BPJS", view:"tagihan", cat:"bpjs"},
  {icon:"phone", label:"Pulsa", view:"pulsa", mode:"pulsa"},
  {icon:"signal", label:"Paket Data", view:"pulsa", mode:"data"},
];

/* ---------------------------------------------------------
   4. DOM REFS
--------------------------------------------------------- */
const $ = sel => document.querySelector(sel);
const views = {
  home: $("#view-home"),
  tagihan: $("#view-tagihan"),
  pulsa: $("#view-pulsa"),
  riwayat: $("#view-riwayat"),
};
const pageTitleEl = $("#page-title");
const pageSubtitleEl = $("#page-subtitle");

let currentView = "home";
let currentCat = null;      // for tagihan
let currentMode = null;     // "pulsa" | "data"
let billResult = null;      // computed bill after "cek tagihan"
let pulsaSelection = null;  // {value,label,price} or {label,price}
let pendingPayment = null;  // payload waiting confirmation
let lastFailedPayload = null;
let selectedMethod = "saldo"; // metode pembayaran terpilih di modal konfirmasi

/* ---------------------------------------------------------
   5b. MODE MALAM / SIANG (theme toggle)
--------------------------------------------------------- */
const LS_THEME = "bayarDong_theme";
function applyTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  const iconEl = $("#theme-icon");
  if(iconEl){
    iconEl.innerHTML = iconSVG(theme === "dark" ? "moon" : "sun");
  }
  localStorage.setItem(LS_THEME, theme);
}
function initTheme(){
  const saved = localStorage.getItem(LS_THEME);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
}
document.addEventListener("DOMContentLoaded", ()=>{
  const btn = $("#btn-theme-toggle");
  if(btn){
    btn.addEventListener("click", ()=>{
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }
});

/* ---------------------------------------------------------
   5c. LOGIN (simulasi autentikasi, disimpan lokal)
--------------------------------------------------------- */
const LS_AUTH = "bayarDong_auth";
function getAuth(){
  try{ return JSON.parse(localStorage.getItem(LS_AUTH) || "null"); }
  catch(e){ return null; }
}
function setAuth(name){ localStorage.setItem(LS_AUTH, JSON.stringify({name})); }
function clearAuth(){ localStorage.removeItem(LS_AUTH); }
function initialsFrom(name){
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if(parts.length === 0) return "AK";
  if(parts.length === 1) return parts[0].slice(0,2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
function setLoggedInUI(name){
  const avatarEl = document.querySelector(".avatar");
  if(avatarEl) avatarEl.textContent = initialsFrom(name);
  $("#login-overlay").classList.add("hidden");
  $("#btn-logout").classList.remove("hidden");
}
function setLoggedOutUI(){
  const avatarEl = document.querySelector(".avatar");
  if(avatarEl) avatarEl.textContent = "AK";
  $("#login-overlay").classList.remove("hidden");
  $("#btn-logout").classList.add("hidden");
}
function checkAuth(){
  const auth = getAuth();
  if(auth && auth.name) setLoggedInUI(auth.name);
  else setLoggedOutUI();
}

document.addEventListener("DOMContentLoaded", ()=>{
  const formLogin = $("#form-login");
  if(formLogin){
    formLogin.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const nameInput = $("#input-username");
      const passInput = $("#input-password");
      const name = nameInput.value.trim();
      const pass = passInput.value;
      const errName = $("#error-username");
      const errPass = $("#error-password");
      errName.textContent = ""; errPass.textContent = "";
      nameInput.classList.remove("invalid"); passInput.classList.remove("invalid");

      let valid = true;
      if(name.length < 2){
        errName.textContent = "Nama minimal 2 karakter.";
        nameInput.classList.add("invalid");
        valid = false;
      }
      if(pass.length < 4){
        errPass.textContent = "Kata sandi minimal 4 karakter.";
        passInput.classList.add("invalid");
        valid = false;
      }
      if(!valid) return;

      const btnLogin = $("#btn-login");
      const original = btnLogin.textContent;
      btnLogin.disabled = true; btnLogin.textContent = "Memproses…";
      await sleep(600);
      btnLogin.disabled = false; btnLogin.textContent = original;

      setAuth(name);
      setLoggedInUI(name);
      passInput.value = "";
      showToast("success", `Selamat datang, ${name}!`);
    });
  }

  const btnLogout = $("#btn-logout");
  if(btnLogout){
    btnLogout.addEventListener("click", ()=>{
      clearAuth();
      setLoggedOutUI();
      showToast("info", "Kamu berhasil keluar.");
    });
  }
});

/* ---------------------------------------------------------
   5. RENDER: sidebar / navigation
--------------------------------------------------------- */
function setActiveNav(btn){
  document.querySelectorAll(".nav-item").forEach(el=>el.classList.remove("active"));
  if(btn) btn.classList.add("active");
}
function goToView(view, opts){
  opts = opts || {};
  currentView = view;
  Object.values(views).forEach(v=>v.classList.add("hidden"));
  views[view].classList.remove("hidden");

  if(view === "home"){
    pageTitleEl.textContent = "Beranda";
    pageSubtitleEl.textContent = "Selamat datang kembali 👋";
    renderRecent();
  } else if(view === "tagihan"){
    currentCat = opts.cat || currentCat;
    renderTagihanForm(currentCat);
  } else if(view === "pulsa"){
    currentMode = opts.mode || currentMode;
    renderPulsaForm(currentMode);
  } else if(view === "riwayat"){
    pageTitleEl.textContent = "Riwayat Transaksi";
    pageSubtitleEl.textContent = "Semua transaksi kamu tersimpan di perangkat ini";
    renderRiwayat();
  }
  window.scrollTo({top:0, behavior:"instant"});
}

document.querySelectorAll(".nav-item").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    setActiveNav(btn);
    const view = btn.dataset.view;
    goToView(view, {cat: btn.dataset.cat, mode: btn.dataset.mode});
  });
});
document.querySelectorAll("[data-view]").forEach(el=>{
  if(el.classList.contains("nav-item")) return;
  el.addEventListener("click", ()=>{
    const view = el.dataset.view;
    document.querySelectorAll(".nav-item").forEach(n=>{
      n.classList.toggle("active", n.dataset.view===view && !n.dataset.cat && !n.dataset.mode);
    });
    goToView(view);
  });
});

/* ---------------------------------------------------------
   6. RENDER: home (wallet + quick grid + recent)
--------------------------------------------------------- */
function renderWallet(){
  $("#wallet-amount").textContent = rupiah(state.saldo);
  $("#saldo-topbar").textContent = rupiah(state.saldo);
}
function renderQuickGrid(){
  const grid = $("#quick-grid");
  grid.innerHTML = QUICK_ITEMS.map(q=>`
    <div class="quick-item" data-view="${q.view}" data-cat="${q.cat||""}" data-mode="${q.mode||""}">
      <div class="quick-icon" data-icon="${q.icon}"></div>
      <span>${q.label}</span>
    </div>
  `).join("");
  grid.querySelectorAll(".quick-item").forEach(el=>{
    el.addEventListener("click", ()=>{
      goToView(el.dataset.view, {cat: el.dataset.cat || null, mode: el.dataset.mode || null});
      const match = [...document.querySelectorAll(".nav-item")].find(n=>
        n.dataset.view===el.dataset.view &&
        (n.dataset.cat||"")===(el.dataset.cat||"") &&
        (n.dataset.mode||"")===(el.dataset.mode||"")
      );
      if(match) setActiveNav(match);
    });
  });
  paintIcons(grid);
}
function categoryMeta(trx){
  if(trx.category==="topup") return {icon:"wallet", label:"Isi Saldo"};
  if(trx.category==="pulsa") return {icon:"phone", label:"Pulsa"};
  if(trx.category==="data") return {icon:"signal", label:"Paket Data"};
  const b = BILLERS[trx.category];
  return {icon: b ? b.icon : "bolt", label: b ? b.label : trx.category};
}
function renderRecent(){
  const list = $("#recent-list");
  const recent = state.riwayat.slice(0,4);
  if(recent.length===0){
    list.innerHTML = `<p style="color:var(--text-soft); font-size:13.5px;">Belum ada transaksi. Yuk mulai bayar tagihan pertamamu!</p>`;
    return;
  }
  list.innerHTML = recent.map(trx=>{
    const meta = categoryMeta(trx);
    const statusPill = trx.status==="success"
      ? `<span class="pill pill-success">Berhasil</span>`
      : `<span class="pill pill-danger">Gagal</span>`;
    return `
    <div class="recent-item" data-id="${trx.id}">
      <div class="recent-ic" data-icon="${meta.icon}"></div>
      <div class="recent-mid">
        <strong>${meta.label} · ${trx.itemLabel}</strong>
        <small>${formatDate(new Date(trx.date))} ${statusPill}</small>
      </div>
      <div class="recent-amount">${rupiah(trx.total)}</div>
    </div>`;
  }).join("");
  list.querySelectorAll(".recent-item").forEach(el=>{
    el.addEventListener("click", ()=>{
      const trx = state.riwayat.find(t=>t.id===el.dataset.id);
      if(trx) openReceiptFromHistory(trx);
    });
  });
  paintIcons(list);
}

/* ---------------------------------------------------------
   7. TAGIHAN FORM
--------------------------------------------------------- */
function renderTagihanForm(catKey){
  const cfg = BILLERS[catKey];
  if(!cfg) return;
  pageTitleEl.textContent = cfg.label;
  pageSubtitleEl.textContent = "Cek tagihan, lalu bayar dalam hitungan detik.";

  $("#tagihan-title").textContent = "Bayar " + cfg.label;
  $("#tagihan-desc").textContent = `Masukkan ${cfg.idLabel.toLowerCase()} untuk memeriksa tagihan.`;
  $("#label-idpel").textContent = cfg.idLabel;
  $("#input-idpel").placeholder = cfg.idPlaceholder;
  $("#input-idpel").value = "";
  $("#error-idpel").textContent = "";
  $("#input-idpel").classList.remove("invalid");
  $("#field-anggota").classList.toggle("hidden", !cfg.hasAnggota);
  $("#input-anggota").value = 1;
  $("#tagihan-result").classList.add("hidden");
  $("#sum-kategori").textContent = cfg.label;
  $("#sum-tagihan").textContent = "Rp0";
  $("#sum-admin").textContent = "Rp0";
  $("#sum-total").textContent = "Rp0";
  $(".summary-note") && ($("#view-tagihan .summary-note").textContent = "Cek tagihan dulu untuk melihat rincian biaya lengkap.");
  billResult = null;
}

function computeBill(catKey, idpel, anggota){
  const cfg = BILLERS[catKey];
  const seed = hashStr(catKey + idpel);
  const nama = pick(NAMES, seed);
  let amount;
  if(cfg.hasAnggota){
    amount = cfg.premiPerAnggota * anggota;
  } else {
    amount = cfg.min + (seed % (cfg.max - cfg.min));
    amount = Math.round(amount/500)*500;
  }
  const now = new Date();
  const periode = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][now.getMonth()] + " " + now.getFullYear();
  return { nama, amount, periode, admin: cfg.admin, idpel, category: catKey, itemLabel: cfg.itemLabel };
}

$("#form-tagihan").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const cfg = BILLERS[currentCat];
  const idInput = $("#input-idpel");
  const idVal = idInput.value.trim();
  const errEl = $("#error-idpel");
  errEl.textContent = ""; idInput.classList.remove("invalid");

  if(!/^[0-9]+$/.test(idVal) || idVal.length < cfg.idMin || idVal.length > cfg.idMax){
    errEl.textContent = `Masukkan angka ${cfg.idMin}-${cfg.idMax} digit.`;
    idInput.classList.add("invalid");
    return;
  }
  let anggota = 1;
  if(cfg.hasAnggota){
    anggota = parseInt($("#input-anggota").value, 10);
    const errAnggota = $("#error-anggota");
    errAnggota.textContent = "";
    if(!anggota || anggota < 1 || anggota > 10){
      errAnggota.textContent = "Jumlah anggota harus 1-10.";
      return;
    }
  }

  const btn = $("#btn-cek-tagihan");
  const original = btn.textContent;
  btn.disabled = true; btn.textContent = "Mengecek…";
  await sleep(700);
  btn.disabled = false; btn.textContent = original;

  billResult = computeBill(currentCat, idVal, anggota);
  $("#bill-nama").textContent = billResult.nama;
  $("#bill-periode").textContent = billResult.periode;
  $("#tagihan-result").classList.remove("hidden");

  $("#sum-tagihan").textContent = rupiah(billResult.amount);
  $("#sum-admin").textContent = rupiah(billResult.admin);
  $("#sum-total").textContent = rupiah(billResult.amount + billResult.admin);
  document.querySelector("#view-tagihan .summary-note").textContent = "Pastikan nomor pelanggan sudah benar sebelum membayar.";

  showToast("info", "Tagihan ditemukan atas nama " + billResult.nama);
});

$("#btn-cek-ulang").addEventListener("click", ()=>{
  renderTagihanForm(currentCat);
});

$("#btn-bayar-tagihan").addEventListener("click", ()=>{
  if(!billResult) return;
  openConfirm({
    type:"tagihan",
    category: billResult.category,
    categoryLabel: BILLERS[billResult.category].label,
    tujuan: billResult.idpel,
    nama: billResult.nama,
    itemLabel: billResult.itemLabel,
    amount: billResult.amount,
    admin: billResult.admin,
  });
});

/* ---------------------------------------------------------
   8. PULSA / PAKET DATA FORM
--------------------------------------------------------- */
function renderPulsaForm(mode){
  const isData = mode === "data";
  pageTitleEl.textContent = isData ? "Paket Data" : "Pulsa";
  pageSubtitleEl.textContent = "Masukkan nomor HP, provider terdeteksi otomatis.";
  $("#pulsa-title").textContent = isData ? "Beli Paket Data" : "Beli Pulsa";
  $("#pulsa-pick-title").textContent = isData ? "Pilih Paket" : "Pilih Nominal";
  $("#input-phone").value = "";
  $("#error-phone").textContent = "";
  $("#provider-badge").classList.add("hidden");
  pulsaSelection = null;
  resetPulsaSummary();
  renderPulsaGrid(mode);
}
function resetPulsaSummary(){
  $("#sum-nomor").textContent = "-";
  $("#sum-provider").textContent = "-";
  $("#sum-label-item").textContent = currentMode==="data" ? "Paket" : "Nominal";
  $("#sum-item").textContent = "-";
  $("#sum-harga").textContent = "Rp0";
  $("#sum-admin-pulsa").textContent = "Rp0";
  $("#sum-total-pulsa").textContent = "Rp0";
  $("#btn-bayar-pulsa").disabled = true;
}
function renderPulsaGrid(mode){
  const items = mode === "data" ? DATA_ITEMS : PULSA_ITEMS;
  const grid = $("#pulsa-grid");
  grid.innerHTML = items.map((it,i)=>`
    <div class="pulsa-item" data-idx="${i}">
      <strong>${it.label}</strong>
      <small>${rupiah(it.price)}</small>
    </div>
  `).join("");
  grid.querySelectorAll(".pulsa-item").forEach(el=>{
    el.addEventListener("click", ()=>{
      grid.querySelectorAll(".pulsa-item").forEach(n=>n.classList.remove("selected"));
      el.classList.add("selected");
      pulsaSelection = items[Number(el.dataset.idx)];
      updatePulsaSummary();
    });
  });
}
function updatePulsaSummary(){
  const phone = $("#input-phone").value.trim();
  const provider = detectProvider(phone);
  $("#sum-nomor").textContent = phone || "-";
  $("#sum-provider").textContent = provider ? provider.name : "-";
  if(pulsaSelection){
    $("#sum-item").textContent = pulsaSelection.label;
    const admin = 1000;
    $("#sum-harga").textContent = rupiah(pulsaSelection.price);
    $("#sum-admin-pulsa").textContent = rupiah(admin);
    $("#sum-total-pulsa").textContent = rupiah(pulsaSelection.price + admin);
  }
  const valid = /^08[0-9]{8,11}$/.test(phone) && provider && pulsaSelection;
  $("#btn-bayar-pulsa").disabled = !valid;
}
$("#input-phone").addEventListener("input", (e)=>{
  const phone = e.target.value.replace(/[^0-9]/g,"");
  e.target.value = phone;
  const badge = $("#provider-badge");
  const errEl = $("#error-phone");
  errEl.textContent = "";
  e.target.classList.remove("invalid");
  if(phone.length >= 4){
    const provider = detectProvider(phone);
    if(provider){
      badge.classList.remove("hidden");
      badge.style.background = provider.bg;
      badge.style.color = provider.color;
      badge.innerHTML = `<span class="provider-dot" style="background:${provider.color}"></span> ${provider.name}`;
    } else {
      badge.classList.add("hidden");
      if(phone.length >= 6){
        errEl.textContent = "Nomor tidak dikenali oleh provider manapun.";
        e.target.classList.add("invalid");
      }
    }
  } else {
    badge.classList.add("hidden");
  }
  updatePulsaSummary();
});

$("#btn-bayar-pulsa").addEventListener("click", ()=>{
  const phone = $("#input-phone").value.trim();
  const provider = detectProvider(phone);
  if(!pulsaSelection || !provider) return;
  openConfirm({
    type: currentMode,
    category: currentMode,
    categoryLabel: currentMode==="data" ? "Paket Data" : "Pulsa",
    tujuan: phone,
    nama: provider.name,
    itemLabel: pulsaSelection.label,
    amount: pulsaSelection.price,
    admin: 1000,
  });
});

/* ---------------------------------------------------------
   9. KONFIRMASI → PROSES → STRUK
--------------------------------------------------------- */
function renderMethodList(){
  const list = $("#method-list");
  if(!list) return;
  list.innerHTML = PAYMENT_METHODS.map(m=>`
    <div class="method-item${m.id===selectedMethod ? " selected" : ""}" data-method="${m.id}">
      <span class="method-radio"></span>
      <div class="method-ic" data-icon="${m.icon}"></div>
      <div class="method-mid">
        <strong>${m.label}</strong>
        <small>${m.desc}</small>
      </div>
    </div>
  `).join("");
  list.querySelectorAll(".method-item").forEach(el=>{
    el.addEventListener("click", ()=>{
      selectedMethod = el.dataset.method;
      list.querySelectorAll(".method-item").forEach(n=>n.classList.remove("selected"));
      el.classList.add("selected");
    });
  });
  paintIcons(list);
}

function openConfirm(payload){
  pendingPayment = payload;
  selectedMethod = "saldo";
  const total = payload.amount + payload.admin;
  const detail = $("#confirm-detail");
  detail.innerHTML = `
    <div class="bill-row"><span>Kategori</span><strong>${payload.categoryLabel}</strong></div>
    <div class="bill-row"><span>Tujuan</span><strong>${payload.tujuan}</strong></div>
    <div class="bill-row"><span>${payload.type==="tagihan" ? "Atas Nama" : "Provider"}</span><strong>${payload.nama}</strong></div>
    <div class="bill-row"><span>Item</span><strong>${payload.itemLabel}</strong></div>
    <div class="bill-row"><span>Nominal</span><strong>${rupiah(payload.amount)}</strong></div>
    <div class="bill-row"><span>Biaya Admin</span><strong>${rupiah(payload.admin)}</strong></div>
  `;
  $("#confirm-total").textContent = rupiah(total);
  renderMethodList();
  $("#modal-confirm").classList.remove("hidden");
}
$("#btn-cancel-confirm").addEventListener("click", ()=> $("#modal-confirm").classList.add("hidden"));

$("#btn-confirm-pay").addEventListener("click", async ()=>{
  const payload = pendingPayment;
  if(!payload) return;
  const total = payload.amount + payload.admin;
  const method = methodById(selectedMethod);
  const payViaSaldo = method.id === "saldo";

  if(payViaSaldo && total > state.saldo){
    $("#modal-confirm").classList.add("hidden");
    showToast("error", "Saldo tidak cukup. Silakan isi saldo atau pilih metode pembayaran lain.");
    return;
  }

  $("#modal-confirm").classList.add("hidden");
  await runProcessingSequence();

  const failed = Math.random() < 0.08; // simulasi gangguan sistem ~8%
  const trx = {
    id: uid(payload.type==="tagihan" ? "TAG" : "ISI"),
    date: new Date().toISOString(),
    category: payload.category,
    categoryLabel: payload.categoryLabel,
    tujuan: payload.tujuan,
    nama: payload.nama,
    itemLabel: payload.itemLabel,
    amount: payload.amount,
    admin: payload.admin,
    total,
    status: failed ? "failed" : "success",
    type: payload.type,
    method: method.id,
    methodLabel: method.label,
  };

  if(!failed && payViaSaldo){
    state.saldo -= total;
    persistSaldo();
    renderWallet();
  }
  addTransaction(trx);
  lastFailedPayload = failed ? payload : null;
  showReceipt(trx);

  if(currentView === "riwayat") renderRiwayat();
  if(currentView === "home") renderRecent();
});

async function runProcessingSequence(){
  const modal = $("#modal-processing");
  modal.classList.remove("hidden");
  const items = modal.querySelectorAll(".stepper li");
  items.forEach(li=>li.classList.remove("active","done"));
  for(let i=0;i<items.length;i++){
    items[i].classList.add("active");
    await sleep(550);
    items[i].classList.remove("active");
    items[i].classList.add("done");
  }
  await sleep(250);
  modal.classList.add("hidden");
}

function showReceipt(trx){
  const ok = trx.status === "success";
  $("#receipt-status-icon").innerHTML = ok ? ICONS.check : ICONS.x;
  $("#receipt-status-icon").style.color = ok ? "var(--emerald-500)" : "var(--red-500)";
  $("#receipt-status-icon svg").setAttribute("stroke", ok ? "#17A673" : "#E1483D");
  $("#receipt-status-icon svg").setAttribute("fill", "none");
  $("#receipt-status-text").textContent = ok ? "Pembayaran Berhasil" : "Pembayaran Gagal";
  $("#receipt-status-sub").textContent = ok
    ? "Struk ini adalah bukti transaksi kamu."
    : "Terjadi gangguan saat menghubungi biller. Saldo kamu tidak terpotong.";

  $("#rc-id").textContent = trx.id;
  $("#rc-date").textContent = formatDate(new Date(trx.date));
  $("#rc-kategori").textContent = trx.categoryLabel;
  $("#rc-tujuan").textContent = trx.tujuan;
  $("#rc-nama").textContent = trx.nama;
  $("#rc-row-nama").classList.toggle("hidden", trx.type!=="tagihan");
  $("#rc-item").textContent = trx.itemLabel;
  $("#rc-metode").textContent = trx.methodLabel || "Saldo Bayar Dong";
  $("#rc-tagihan").textContent = rupiah(trx.amount);
  $("#rc-admin").textContent = rupiah(trx.admin);
  $("#rc-total").textContent = rupiah(trx.total);

  $("#btn-retry-receipt").classList.toggle("hidden", ok);
  $("#modal-receipt").classList.remove("hidden");

  if(ok) showToast("success", "Pembayaran berhasil! Struk sudah tersimpan di riwayat.");
  else showToast("error", "Pembayaran gagal. Silakan coba lagi.");
}

function openReceiptFromHistory(trx){
  showReceipt(trx);
  $("#btn-retry-receipt").classList.add("hidden"); // riwayat lama: tidak retry otomatis dari sini
}

$("#btn-done-receipt").addEventListener("click", ()=>{
  $("#modal-receipt").classList.add("hidden");
  goToView("home");
  setActiveNav(document.querySelector('.nav-item[data-view="home"]'));
});
$("#btn-print-receipt").addEventListener("click", ()=> window.print());
$("#btn-retry-receipt").addEventListener("click", ()=>{
  $("#modal-receipt").classList.add("hidden");
  if(lastFailedPayload) openConfirm(lastFailedPayload);
});

/* ---------------------------------------------------------
   10. RIWAYAT
--------------------------------------------------------- */
let riwayatFilter = "semua";
document.querySelectorAll(".tab").forEach(tab=>{
  tab.addEventListener("click", ()=>{
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    tab.classList.add("active");
    riwayatFilter = tab.dataset.filter;
    renderRiwayat();
  });
});
$("#riwayat-search").addEventListener("input", renderRiwayat);

function renderRiwayat(){
  const q = $("#riwayat-search").value.trim().toLowerCase();
  let list = state.riwayat.slice();
  if(riwayatFilter==="berhasil") list = list.filter(t=>t.status==="success");
  if(riwayatFilter==="gagal") list = list.filter(t=>t.status==="failed");
  if(q){
    list = list.filter(t =>
      (t.tujuan||"").toLowerCase().includes(q) ||
      (t.categoryLabel||"").toLowerCase().includes(q) ||
      (t.itemLabel||"").toLowerCase().includes(q)
    );
  }
  const container = $("#riwayat-list");
  const empty = $("#riwayat-empty");

  if(state.riwayat.length === 0){
    container.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  if(list.length === 0){
    container.innerHTML = `<p style="color:var(--text-soft); font-size:13.5px; padding:20px 0;">Tidak ada transaksi yang cocok dengan pencarian/filter.</p>`;
    return;
  }

  container.innerHTML = list.map(trx=>{
    const meta = categoryMeta(trx);
    const statusPill = trx.status==="success"
      ? `<span class="pill pill-success">Berhasil</span>`
      : `<span class="pill pill-danger">Gagal</span>`;
    return `
    <div class="recent-item" data-id="${trx.id}">
      <div class="recent-ic" data-icon="${meta.icon}"></div>
      <div class="recent-mid">
        <strong>${meta.label} · ${trx.tujuan}</strong>
        <small>${formatDate(new Date(trx.date))} · ${trx.id} ${statusPill}</small>
      </div>
      <div class="recent-amount">${rupiah(trx.total)}</div>
    </div>`;
  }).join("");
  container.querySelectorAll(".recent-item").forEach(el=>{
    el.addEventListener("click", ()=>{
      const trx = state.riwayat.find(t=>t.id===el.dataset.id);
      if(trx) openReceiptFromHistory(trx);
    });
  });
  paintIcons(container);
}

/* ---------------------------------------------------------
   11. ISI SALDO (top up simulasi)
--------------------------------------------------------- */
const TOPUP_AMOUNTS = [50000,100000,200000,300000,500000,1000000];
function renderTopupGrid(){
  const grid = $("#topup-grid");
  grid.innerHTML = TOPUP_AMOUNTS.map(v=>`<div class="topup-item" data-v="${v}">${rupiah(v)}</div>`).join("");
  grid.querySelectorAll(".topup-item").forEach(el=>{
    el.addEventListener("click", async ()=>{
      const v = Number(el.dataset.v);
      $("#modal-topup").classList.add("hidden");
      state.saldo += v;
      persistSaldo();
      renderWallet();
      addTransaction({
        id: uid("TOP"),
        date: new Date().toISOString(),
        category:"topup",
        categoryLabel:"Isi Saldo",
        tujuan:"Saldo Bayar Dong",
        nama:"-",
        itemLabel:"Isi Saldo",
        amount:v, admin:0, total:v,
        status:"success", type:"topup",
        method:"saldo", methodLabel:"Saldo Bayar Dong",
      });
      if(currentView==="home") renderRecent();
      if(currentView==="riwayat") renderRiwayat();
      showToast("success", `Saldo berhasil ditambahkan ${rupiah(v)}`);
    });
  });
}
$("#btn-topup").addEventListener("click", ()=> $("#modal-topup").classList.remove("hidden"));
$("#btn-cancel-topup").addEventListener("click", ()=> $("#modal-topup").classList.add("hidden"));

/* ---------------------------------------------------------
   12. TOAST NOTIFICATIONS
--------------------------------------------------------- */
function showToast(type, message){
  const container = $("#toast-container");
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  const icon = type==="success" ? "✓" : type==="error" ? "✕" : "ℹ";
  el.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(el);
  setTimeout(()=>{
    el.style.transition = "opacity .3s ease, transform .3s ease";
    el.style.opacity = "0";
    el.style.transform = "translateX(20px)";
    setTimeout(()=> el.remove(), 300);
  }, 3200);
}

/* close modals by clicking backdrop */
document.querySelectorAll(".modal-overlay").forEach(ov=>{
  ov.addEventListener("click", (e)=>{
    if(e.target === ov && ov.id !== "modal-processing"){
      ov.classList.add("hidden");
    }
  });
});

/* ---------------------------------------------------------
   13. INIT
--------------------------------------------------------- */
function init(){
  loadState();
  initTheme();
  checkAuth();
  renderWallet();
  renderQuickGrid();
  renderTopupGrid();
  paintIcons(document);
  goToView("home");
}
document.addEventListener("DOMContentLoaded", init);

})();
