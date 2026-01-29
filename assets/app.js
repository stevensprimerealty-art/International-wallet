const STORE_KEY = "ibk_like_platform_v2"; // internal key only

const DEFAULT_STATE = {
  lang: "en",
  brand: "International Banking of Korea", // header text
  account: {
    accountNo: "IBK-10030001",
    pin: "1234",
    name: "Primary Wallet",
    createdAt: "2015-01-01"
  },
  wallet: {
    baseCurrency: "KRW",
    viewCurrency: "KRW",
    balanceBase: 1260530586, // in KRW
    masked: true
  },
  // static display conversion rates (example)
  rates: {
    KRW: 1,
    USD: 0.00075,
    EUR: 0.00069,
    GBP: 0.00059
  },
  tx: [
    { date: "2026-01-20", type: "Deposit", amountKRW: 1500000, note: "Entry" },
    { date: "2026-01-18", type: "Deposit", amountKRW: 250000, note: "Entry" }
  ],
  popularity: {
    target: 1000
  }
};

// i18n dictionary
const DICT = {
  en: {
    nav_home:"Home", nav_open:"Create Account", nav_about:"About", nav_contact:"Contact",
    nav_cards:"Cards", nav_security:"Security", nav_loans:"Loans", nav_dash:"Dashboard",

    hero_title:"Worldwide Wallet Platform",
    hero_sub:"Professional interface for multi-currency viewing, deposits, and account access.",
    kpi1:"Main currency", kpi1v:"KRW",
    kpi2:"Access", kpi2v:"Account + PIN",
    kpi3:"Coverage", kpi3v:"Worldwide",

    popularity_title:"Growth in popularity",
    population_use:"Population use",

    sign_in:"Sign in",
    page_dashboard:"Dashboard",
    login_title:"Sign in",
    acct_no:"Account number",
    pin:"PIN",
    login_btn:"Login",

    balance_title:"Balance",
    currency:"Currency",
    deposit_title:"Deposit",
    amount:"Amount",
    note:"Note",
    add_deposit:"Add",

    history:"Transaction history",

    open_title:"Create an account with us",
    open_sub:"Enter your account details.",
    wallet_name:"Wallet name",
    save:"Save",

    loans_title:"Loan Information",
    loans_sub:"Loan details and requirements.",

    about_title:"About us",
    about_sub:"In existence since 2015. Built for a clean, professional experience.",

    contact_title:"Contact us",
    send:"Send",

    cards_title:"Cards",
    security_title:"Security"
  },
  ko: {
    nav_home:"홈", nav_open:"계정 생성", nav_about:"회사 소개", nav_contact:"문의",
    nav_cards:"카드", nav_security:"보안", nav_loans:"대출", nav_dash:"대시보드",

    hero_title:"전 세계 지갑 플랫폼",
    hero_sub:"다중 통화 보기, 입금 기록, 계정 접속을 위한 전문 인터페이스입니다.",
    kpi1:"기준 통화", kpi1v:"KRW",
    kpi2:"접속 방식", kpi2v:"계정 + PIN",
    kpi3:"범위", kpi3v:"전 세계",

    popularity_title:"인기 성장",
    population_use:"사용자 수",

    sign_in:"로그인",
    page_dashboard:"대시보드",
    login_title:"로그인",
    acct_no:"계정 번호",
    pin:"PIN",
    login_btn:"로그인",

    balance_title:"잔액",
    currency:"통화",
    deposit_title:"입금",
    amount:"금액",
    note:"메모",
    add_deposit:"추가",

    history:"거래 내역",

    open_title:"계정 만들기",
    open_sub:"계정 정보를 입력하세요.",
    wallet_name:"지갑 이름",
    save:"저장",

    loans_title:"대출 정보",
    loans_sub:"대출 상세 및 요구 조건.",

    about_title:"회사 소개",
    about_sub:"2015년부터 운영. 깔끔하고 전문적인 경험을 위해 설계되었습니다.",

    contact_title:"문의하기",
    send:"보내기",

    cards_title:"카드",
    security_title:"보안"
  },
  es: {
    nav_home:"Inicio", nav_open:"Crear cuenta", nav_about:"Nosotros", nav_contact:"Contacto",
    nav_cards:"Tarjetas", nav_security:"Seguridad", nav_loans:"Préstamos", nav_dash:"Panel",

    hero_title:"Plataforma de billetera global",
    hero_sub:"Interfaz profesional para ver multi-moneda, registrar depósitos y acceder a la cuenta.",
    kpi1:"Moneda principal", kpi1v:"KRW",
    kpi2:"Acceso", kpi2v:"Cuenta + PIN",
    kpi3:"Cobertura", kpi3v:"Global",

    popularity_title:"Crecimiento de popularidad",
    population_use:"Uso por población",

    sign_in:"Entrar",
    page_dashboard:"Panel",
    login_title:"Iniciar sesión",
    acct_no:"Número de cuenta",
    pin:"PIN",
    login_btn:"Entrar",

    balance_title:"Saldo",
    currency:"Moneda",
    deposit_title:"Depósito",
    amount:"Monto",
    note:"Nota",
    add_deposit:"Agregar",

    history:"Historial",

    open_title:"Crea una cuenta con nosotros",
    open_sub:"Ingresa los datos de tu cuenta.",
    wallet_name:"Nombre de billetera",
    save:"Guardar",

    loans_title:"Información de préstamos",
    loans_sub:"Detalles y requisitos.",

    about_title:"Sobre nosotros",
    about_sub:"En existencia desde 2015. Diseñado para una experiencia limpia y profesional.",

    contact_title:"Contáctanos",
    send:"Enviar",

    cards_title:"Tarjetas",
    security_title:"Seguridad"
  }
};

function loadState(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    // shallow merge + ensure nested
    return {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      account: { ...structuredClone(DEFAULT_STATE.account), ...(parsed.account||{}) },
      wallet: { ...structuredClone(DEFAULT_STATE.wallet), ...(parsed.wallet||{}) },
      rates:  { ...structuredClone(DEFAULT_STATE.rates),  ...(parsed.rates||{}) },
      popularity: { ...structuredClone(DEFAULT_STATE.popularity), ...(parsed.popularity||{}) }
    };
  }catch{
    return structuredClone(DEFAULT_STATE);
  }
}
function saveState(s){ localStorage.setItem(STORE_KEY, JSON.stringify(s)); }

function t(state, key){
  const lang = state.lang || "en";
  return (DICT[lang] && DICT[lang][key]) || DICT.en[key] || key;
}

function applyTranslations(state){
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    el.textContent = t(state, key);
  });
}

function fmtCurrency(amount, cur){
  const n = Number(amount || 0);
  const rounded = cur === "KRW" ? Math.round(n) : Math.round(n * 100) / 100;
  const parts = rounded.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const symbol = cur === "KRW" ? "₩" : cur === "USD" ? "$" : cur === "EUR" ? "€" : "£";
  return symbol + parts.join(".");
}

function convertFromKRW(state, krw, toCur){
  const r = state.rates[toCur] ?? 1;
  return krw * r;
}

function setBrand(state){
  document.querySelectorAll("[data-brand]").forEach(el=>{
    el.textContent = state.brand;
  });
}

function setupLang(state){
  const sel = document.getElementById("langSelect");
  if(!sel) return;
  sel.value = state.lang || "en";
  sel.addEventListener("change", ()=>{
    state.lang = sel.value;
    saveState(state);
    applyTranslations(state);
  });
}

function setupCurrency(state){
  const curSel = document.getElementById("currencySelect");
  if(!curSel) return;
  curSel.value = state.wallet.viewCurrency || "KRW";
  curSel.addEventListener("change", ()=>{
    state.wallet.viewCurrency = curSel.value;
    saveState(state);
    renderBalance(state);
    renderTx(state);
  });
}

function renderBalance(state){
  const amt = document.getElementById("balanceAmt");
  if(!amt) return;
  if(state.wallet.masked){
    amt.textContent = "••••••••••";
    return;
  }
  const cur = state.wallet.viewCurrency || "KRW";
  const value = convertFromKRW(state, state.wallet.balanceBase, cur);
  amt.textContent = fmtCurrency(value, cur);
}

function renderTx(state){
  const tbody = document.getElementById("txBody");
  if(!tbody) return;
  tbody.innerHTML = "";
  const cur = state.wallet.viewCurrency || "KRW";
  const tx = (state.tx||[]).slice().sort((a,b)=> a.date < b.date ? 1 : -1);
  for(const row of tx){
    const amount = convertFromKRW(state, row.amountKRW, cur);
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${row.date}</td><td>${row.type}</td><td>${fmtCurrency(amount, cur)}</td><td>${row.note||""}</td>`;
    tbody.appendChild(tr);
  }
}

function setupMaskToggle(state){
  const btn = document.getElementById("maskBtn");
  if(!btn) return;
  btn.addEventListener("click", ()=>{
    state.wallet.masked = !state.wallet.masked;
    saveState(state);
    renderBalance(state);
    btn.textContent = state.wallet.masked ? "🙈" : "👁️";
  });
  // initial icon
  btn.textContent = state.wallet.masked ? "🙈" : "👁️";
}

function setupLogin(state){
  const form = document.getElementById("loginForm");
  if(!form) return;

  const acct = document.getElementById("accountNo");
  const pin  = document.getElementById("pinInput");
  const msg  = document.getElementById("loginMsg");

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const ok = (acct.value||"").trim() === state.account.accountNo && (pin.value||"").trim() === state.account.pin;
    if(ok){
      sessionStorage.setItem("authed","1");
      document.getElementById("loginCard")?.classList.add("hidden");
      document.getElementById("appCard")?.classList.remove("hidden");
      renderBalance(state);
      renderTx(state);
    }else{
      if(msg) msg.textContent = "Invalid account number or PIN.";
    }
  });
}

function requireAuth(){
  const ok = sessionStorage.getItem("authed") === "1";
  return ok;
}

function setupLogout(){
  const btn = document.getElementById("logoutBtn");
  if(!btn) return;
  btn.addEventListener("click", ()=>{
    sessionStorage.removeItem("authed");
    window.location.href = "./index.html";
  });
}

function setupDeposit(state){
  const form = document.getElementById("depositForm");
  if(!form) return;

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const amtEl = document.getElementById("depAmount");
    const noteEl = document.getElementById("depNote");
    const raw = (amtEl.value||"").replace(/,/g,"");
    const v = Number(raw);
    if(!Number.isFinite(v) || v <= 0) return;

    // deposits are entered in current view currency; convert back to KRW base
    const cur = state.wallet.viewCurrency || "KRW";
    const toKRW = cur === "KRW" ? v : v / (state.rates[cur] || 1);
    const addKRW = Math.round(toKRW);

    state.wallet.balanceBase += addKRW;
    state.tx = state.tx || [];
    state.tx.push({
      date: new Date().toISOString().slice(0,10),
      type: "Deposit",
      amountKRW: addKRW,
      note: (noteEl.value||"").trim() || "Entry"
    });

    amtEl.value = "";
    noteEl.value = "";
    saveState(state);
    renderBalance(state);
    renderTx(state);
  });
}

function setupOpenAccount(state){
  const form = document.getElementById("openForm");
  if(!form) return;

  const nameEl = document.getElementById("oaName");
  const acctEl = document.getElementById("oaAcct");
  const pinEl  = document.getElementById("oaPin");
  const msgEl  = document.getElementById("openMsg");

  // prefill current
  nameEl.value = state.account.name || "";
  acctEl.value = state.account.accountNo || "";
  pinEl.value  = state.account.pin || "";

  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const newName = (nameEl.value||"").trim();
    const newAcct = (acctEl.value||"").trim();
    const newPin  = (pinEl.value||"").trim();
    if(newAcct.length < 6 || newPin.length < 4){
      if(msgEl) msgEl.textContent = "Use a longer account number and 4+ digit PIN.";
      return;
    }
    state.account.name = newName || "Primary Wallet";
    state.account.accountNo = newAcct;
    state.account.pin = newPin;
    saveState(state);
    if(msgEl) msgEl.textContent = "Saved.";
  });
}

/* Fade-in observer */
function setupFadeIn(){
  const els = document.querySelectorAll(".fade");
  if(!els.length) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add("show");
    });
  }, { threshold: 0.15 });
  els.forEach(el=>obs.observe(el));
}

/* Popularity counter 1..target on scroll */
function setupCounter(state){
  const el = document.getElementById("popCounter");
  if(!el) return;
  let started = false;
  const target = Math.max(1, Number(state.popularity?.target || 1000));
  const obs = new IntersectionObserver((entries)=>{
    for(const e of entries){
      if(e.isIntersecting && !started){
        started = true;
        let n = 1;
        const duration = 1200;
        const start = performance.now();
        const tick = (now)=>{
          const p = Math.min(1, (now - start) / duration);
          n = Math.floor(1 + (target-1) * p);
          el.textContent = n.toString();
          if(p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }
  }, { threshold: 0.35 });
  obs.observe(el);
}

/* Loader */
function setupLoader(){
  const loader = document.getElementById("loader");
  if(!loader) return;
  window.addEventListener("load", ()=>{
    setTimeout(()=> loader.classList.add("hidden"), 250);
  });
}

function init(){
  const state = loadState();

  setupLoader();
  setBrand(state);
  setupLang(state);
  applyTranslations(state);
  setupFadeIn();
  setupCounter(state);

  // dashboard features
  setupCurrency(state);
  setupMaskToggle(state);
  setupLogin(state);
  setupDeposit(state);
  setupLogout();

  // open-account page
  setupOpenAccount(state);

  // Show/hide dashboard based on auth
  if(document.getElementById("appCard")){
    const authed = requireAuth();
    document.getElementById("loginCard")?.classList.toggle("hidden", authed);
    document.getElementById("appCard")?.classList.toggle("hidden", !authed);
    if(authed){
      renderBalance(state);
      renderTx(state);
    }
  }
}
document.addEventListener("DOMContentLoaded", init);
