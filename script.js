const LANGS = {
  en: { name: 'EN', dir: 'ltr' },
  ar: { name: 'AR', dir: 'rtl' },
  de: { name: 'DE', dir: 'ltr' },
  es: { name: 'ES', dir: 'ltr' },
  fr: { name: 'FR', dir: 'ltr' },
  tr: { name: 'TR', dir: 'ltr' },
  zh: { name: '中文', dir: 'ltr' },
};

function setLang(code) {
  const cfg = LANGS[code];
  if (!cfg) return;

  // Direction
  document.body.setAttribute('dir', cfg.dir);

  // Active lang content
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.classList.toggle('active', el.dataset.lang === code);
  });

  // Active button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.code === code);
  });

  // Persist
  localStorage.setItem('ss_pp_lang', code);
}

function init() {
  // Build buttons
  const switcher = document.getElementById('lang-switcher');
  Object.entries(LANGS).forEach(([code, cfg]) => {
    const btn = document.createElement('button');
    btn.className = 'lang-btn';
    btn.dataset.code = code;
    btn.textContent = cfg.name;
    btn.addEventListener('click', () => setLang(code));
    switcher.appendChild(btn);
  });

  // Detect language
  const saved   = localStorage.getItem('ss_pp_lang');
  const browser = navigator.language?.slice(0, 2).toLowerCase();
  const initial = (saved && LANGS[saved]) ? saved
    : (browser && LANGS[browser]) ? browser
    : 'en';

  setLang(initial);
}

document.addEventListener('DOMContentLoaded', init);
