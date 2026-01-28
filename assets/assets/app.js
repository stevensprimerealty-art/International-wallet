// International Wallet (local-only) app logic

const STORE_KEY = "iwallet_v1";

// Default account seeded (editable on Open Account page)
const DEFAULT_STATE = {
  lang: "en",
  account: {
    accountNo: "IW-10030001",
    pin: "1234",
    name: "Primary Wallet",
    createdAt: new Date().toISOString().slice(0,10),
  },
  wallet: {
    balanceKRW: 1260530586, // opening balance
    frozen: true,
    showBalance: false,
  },
  usage: {
    // simple gauge percentage + breakdown (editable)
    internationalPercent: 68,
    regions: [
      { name: "Asia", value: 44 },
      { name: "Europe", value: 18 },
      { name: "Americas", value: 6 }
    ]
  },
  tx: [
    { date: "2026-01-20", type: "Deposit", amount: 1500000, note: "Manual entry" },
    { date: "2026-01-18", type: "Deposit", amount: 250000, note: "Manual entry" }
  ]
};

function loadState(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return { ...structuredClone(DEFAULT_STATE), ...parsed };
  }catch{
    return structuredClone(DEFAULT_STATE);
  }
}
function saveState(state){
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}
function fmtKRW(n){
  const x = Math.round(Number(n || 0));
  return "₩" + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const DICT = {
  en: {
    nav_home:"Home", nav_open:"Create Account", nav_loans:"Loans", nav_about:"About", nav_contact:"Contact", nav_dash:"Dashboard",
    hero_title:"International Wallet",
    hero_sub:"A private wallet dashboard to track deposits and held (frozen) funds across regions.",
    kpi1:"Wallets", kpi2:"Regions", kpi3:"Security",
    kpi1v:"1 Primary", kpi2v:"Worldwide", kpi3v:"PIN Access",
    gauge_title:"International usage",
    features_title:"What you can do",
    f1:"Deposit tracking", f2:"Frozen funds status", f3:"Masked balance view", f4:"Statements history",
    disclaimer:"This is a private wallet/ledger interface for tracking. It does not execute real bank transfers.",
    login_title:"Sign in",
    acct_no:"Account number", pin:"PIN", sign_in:"Sign in",
    dash_title:"Dashboard",
    status_frozen:"Frozen", status_unfrozen:"Unfrozen",
    available:"Balance", held:"Held status",
    deposit:"Deposit", amount:"Amount (KRW)", note:"Note", add_deposit:"Add deposit",
    transfer:"Transfer", transfer_blocked:"Transfers are blocked while funds are frozen.",
    toggle_freeze:"Toggle freeze",
    logout:"Log out",
    loans_title:"Loans",
    open_title:"Create an account with us",
    about_title:"About us",
    contact_title:"Contact us",
    send:"Send message",
  },
  ko: {
    nav_home:"홈", nav_open:"계정 만들기", nav_loans:"대출", nav_about:"회사 소개", nav_contact:"문의", nav_dash:"대시보드",
    hero_title:"International Wallet",
    hero_sub:"입금 및 동결(보류) 자금을 지역별로 추적하는 개인 지갑 대시보드입니다.",
    kpi1:"지갑", kpi2:"지역", kpi3:"보안",
    kpi1v:"기본 1개", kpi2v:"전 세계", kpi3v:"PIN 로그인",
    gauge_title:"국제 사용량",
    features_title:"가능한 기능",
    f1:"입금 기록", f2:"동결 상태", f3:"잔액 마스킹", f4:"내역 보기",
    disclaimer:"개인 지갑/장부용 화면입니다. 실제 은행 이체를 실행하지 않습니다.",
    login_title:"로그인",
    acct_no:"계정 번호", pin:"PIN", sign_in:"로그인",
    dash_title:"대시보드",
    status_frozen:"동결", status_unfrozen:"해제",
    available:"잔액", held:"보류 상태",
    deposit:"입금", amount:"금액 (KRW)", note:"메모", add_deposit:"입금 추가",
    transfer:"이체", transfer_blocked:"자금이 동결 상태이면 이체가 차단됩니다.",
    toggle_freeze:"동결 전환",
    logout:"로그아웃",
    loans_title:"대출",
    open_title:"계정 만들기",
    about_title:"회사 소개",
    contact_title:"문의하기",
    send:"메시지 보내기",
  },
  es: {
    nav_home:"Inicio", nav_open:"Crear cuenta", nav_loans:"Préstamos", nav_about:"Nosotros", nav_contact:"Contacto", nav_dash:"Panel",
    hero_title:"International Wallet",
    hero_sub:"Un panel privado para registrar depósitos y fondos congelados por regiones.",
    kpi1:"Billeteras", kpi2:"Regiones", kpi3:"Seguridad",
    kpi1v:"1 Principal", kpi2v:"Global", kpi3v:"Acceso PIN",
    gauge_title:"Uso internacional",
    features_title:"Qué puedes hacer",
    f1:"Registro de depósitos", f2:"Estado congelado", f3:"Saldo oculto", f4:"Historial",
    disclaimer:"Interfaz privada tipo billetera/registro. No ejecuta transferencias bancarias reales.",
    login_title:"Iniciar sesión",
    acct_no:"Número de cuenta", pin:"PIN", sign_in:"Entrar",
    dash_title:"Panel",
    status_frozen:"Congelado", status_unfrozen:"Descongelado",
    available:"Saldo", held:"Estado retenido",
    deposit:"Depósito", amount:"Monto (KRW)", note:"Nota", add_deposit:"Agregar depósito",
    transfer:"Transferir", transfer_blocked:"Las transferencias están bloqueadas mientras los fondos estén congelados.",
    toggle_freeze:"Cambiar congelado",
    logout:"Salir",
    loans_title:"Préstamos",
    open_title:"Crea una cuenta con nosotros",
    about_title:"Sobre nosotros",
    contact_title:"Contáctanos",
    send:"Enviar mensaje",
  }
};

function t(state, key){
  const lang = state.lang || "en";
  return (DICT[lang] && DICT[lang][key]) || DICT.en[key] || key;
}

function setText(id, text){
  const el = document.getElementById(id);
  if(el) el.textContent = text;
}

function applyTranslations(state){
  // Common nav
  const navMap = {
    nav_home:"nav_home", nav_open:"nav_open", nav_loans:"nav_loans", nav_about:"nav_about", nav_contact:"nav_contact", nav_dash:"nav_dash"
  };
  for(const [key, id] of Object.entries(navMap)) setText(id, t(state, key));

  // Page-specific keys by presence
  const keys = [
    "hero_title","hero_sub","kpi1","kpi2","kpi3","kpi1v","kpi2v","kpi3v",
    "gauge_title","features_title","f1","f2","f3","f4","disclaimer",
    "login_title","acct_no","pin","sign_in",
    "dash_title","status_frozen","status_unfrozen","available","held",
    "deposit","amount","note","add_deposit","transfer","transfer_blocked",
    "toggle_freeze","logout",
    "loans_title","open_title","about_title","contact_title","send"
  ];
  keys.forEach(k => {
    const id = k;
    const el = document.getElementById(id);
    if(el) el.textContent = t(state, k);
  });
}

function renderGauge(state){
  const pct = Math.max(0, Math.min(100, Number(state.usage?.internationalPercent ?? 0)));
  const arc = document.getElementById("gaugeArc");
  const big = document.getElementById("gaugePct");
  const sub = document.getElementById("gaugeSub");

  if(big) big.textContent = `${pct}%`;
  if(sub) sub.textContent = state.usage?.regions?.map(r => `${r.name} ${r.value}%`).join(" · ") || "";

  // SVG arc uses stroke-dasharray and dashoffset
  // Semi-circle path length approx 282 (for our path)
  if(arc){
    const length = 282;
    const filled = (pct/100) * length;
    arc.style.strokeDasharray = `${filled} ${length - filled}`;
  }
}

function requireAuth(state){
  const ok = sessionStorage.getItem("iwallet_authed") === "1";
  if(!ok){
    window.location.href = "./dashboard.html";
  }
}

function renderDashboard(state){
  // Status pill
  const status = document.getElementById("statusPill");
  if(status){
    status.textContent = state.wallet.frozen ? t(state,"status_frozen") : t(state,"status_unfrozen");
    status.className = "pill " + (state.wallet.frozen ? "red" : "green");
  }

  const amt = document.getElementById("balanceAmt");
  if(amt){
    amt.textContent = state.wallet.showBalance ? fmtKRW(state.wallet.balanceKRW) : "••••••••••";
  }

  const transferBtn = document.getElementById("transferBtn");
  const transferMsg = document.getElementById("transferMsg");
  if(transferBtn) transferBtn.disabled = true; // always disabled per your request
  if(transferMsg) transferMsg.textContent = t(state,"transfer_blocked");

  // Transactions
  const tbody = document.getElementById("txBody");
  if(tbody){
    tbody.innerHTML = "";
    const tx = (state.tx || []).slice().sort((a,b)=> (a.date < b.date ? 1 : -1));
    for(const row of tx){
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.date}</td>
        <td>${row.type}</td>
        <td>${fmtKRW(row.amount)}</td>
        <td>${(row.note || "")}</td>
      `;
      tbody.appendChild(tr);
    }
  }
}

function setupLang(state){
  const sel = document.getElementById("langSelect");
  if(sel){
    sel.value = state.lang || "en";
    sel.addEventListener("change", ()=>{
      state.lang = sel.value;
      saveState(state);
      applyTranslations(state);
      renderGauge(state);
      // Dashboard changes too
      if(document.getElementById("balanceAmt")) renderDashboard(state);
    });
  }
}

function setupLogin(state){
  const form = document.getElementById("loginForm");
  if(!form) return;

  const acct = document.getElementById("accountNo");
  const pin = document.getElementById("pinInput");
  const msg = document.getElementById("loginMsg");

  // Prefill
  if(acct) acct.value = state.account.accountNo;
  if(pin) pin.value = "";

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const ok = (acct?.value || "").trim() === state.account.accountNo && (pin?.value || "").trim() === state.account.pin;
    if(ok){
      sessionStorage.setItem("iwallet_authed","1");
      window.location.href = "./dashboard.html#app";
    }else{
      if(msg) msg.textContent = "Invalid account number or PIN.";
    }
  });
}

function setupDashboardActions(state){
  const eye = document.getElementById("eyeBtn");
  if(eye){
    eye.addEventListener("click", ()=>{
      state.wallet.showBalance = !state.wallet.showBalance;
      saveState(state);
      renderDashboard(state);
    });
  }

  const freezeBtn = document.getElementById("freezeBtn");
  if(freezeBtn){
    freezeBtn.addEventListener("click", ()=>{
      state.wallet.frozen = !state.wallet.frozen;
      saveState(state);
      renderDashboard(state);
    });
  }

  const depositForm = document.getElementById("depositForm");
  if(depositForm){
    depositForm.addEventListener("submit", (e)=>{
      e.preventDefault();
      const amtEl = document.getElementById("depAmount");
      const noteEl = document.getElementById("depNote");
      const v = Number((amtEl?.value || "").toString().replace(/,/g,""));
      if(!Number.isFinite(v) || v <= 0) return;

      state.wallet.balanceKRW = Number(state.wallet.balanceKRW) + Math.round(v);
      state.tx = state.tx || [];
      state.tx.push({
        date: new Date().toISOString().slice(0,10),
        type: "Deposit",
        amount: Math.round(v),
        note: (noteEl?.value || "").trim() || "Manual entry"
      });

      if(amtEl) amtEl.value = "";
      if(noteEl) noteEl.value = "";

      saveState(state);
      renderDashboard(state);
    });
  }

  const logout = document.getElementById("logoutBtn");
  if(logout){
    logout.addEventListener("click", ()=>{
      sessionStorage.removeItem("iwallet_authed");
      window.location.href = "./index.html";
    });
  }
}

function setupOpenAccount(state){
  const form = document.getElementById("openForm");
  if(!form) return;

  const nameEl = document.getElementById("oaName");
  const acctEl = document.getElementById("oaAcct");
  const pinEl  = document.getElementById("oaPin");
  const msgEl  = document.getElementById("openMsg");

  // Prefill current
  if(nameEl) nameEl.value = state.account.name || "";
  if(acctEl) acctEl.value = state.account.accountNo || "";
  if(pinEl)  pinEl.value  = state.account.pin || "";

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const newName = (nameEl?.value || "").trim();
    const newAcct = (acctEl?.value || "").trim();
    const newPin  = (pinEl?.value || "").trim();

    if(newAcct.length < 6 || newPin.length < 4){
      if(msgEl) msgEl.textContent = "Please use a longer account number and a 4+ digit PIN.";
      return;
    }

    state.account.name = newName || "Primary Wallet";
    state.account.accountNo = newAcct;
    state.account.pin = newPin;

    saveState(state);
    if(msgEl) msgEl.textContent = "Saved. You can now sign in on the Dashboard page.";
  });
}

function init(){
  const state = loadState();
  setupLang(state);
  applyTranslations(state);

  // homepage gauge
  if(document.getElementById("gaugeArc")) renderGauge(state);

  // login page
  setupLogin(state);

  // dashboard page
  if(document.getElementById("balanceAmt")){
    requireAuth(state);
    renderDashboard(state);
    setupDashboardActions(state);
  }

  // open account
  setupOpenAccount(state);
}
document.addEventListener("DOMContentLoaded", init);
