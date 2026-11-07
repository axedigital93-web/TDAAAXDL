/* Axe Digital v3 — défilement en profondeur.
   Chaque section est un plan dans l'espace : elle arrive du fond, se pose face à l'écran, puis passe derrière le visiteur.
   Le scroll du document (allongé par .spacer) ne fait plus monter la page : il fait avancer la caméra 3D et les plans ensemble.
   Chaque élément est relié par une attache au fil lumineux, qui change de teinte à chaque section. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const mobile = () => innerWidth <= 860;
const en = window.LANG === 'en';
const t = (fr, e) => (en ? e : fr);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = k => 1 - Math.pow(1 - k, 3);
const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
const { gsap } = window;
const root = document.documentElement;

// teintes du fil, une par section (accueil → footer) : uniquement les bleus de la charte
const PALETTE = ['#2843cc', '#2f4bd6', '#1f35a8', '#3a5cff', '#2843cc', '#2f4bd6', '#1f35a8', '#3a5cff', '#2843cc', '#2f4bd6', '#1f35a8', '#3a5cff', '#2843cc'];

/* ---------- Son : moteur Web Audio génératif (aucun fichier) ---------- */
const sfx = (() => {
  let ctx = null, master, bus, filt, on = false, shimmerT = 0;
  const SCALE = [0, 3, 5, 7, 10];                       // pentatonique mineure en ré
  const note = (deg, oct = 0) => { const o = Math.floor(deg / 5), d = ((deg % 5) + 5) % 5; return 146.83 * 2 ** ((SCALE[d] + 12 * (oct + o)) / 12); };
  const panOf = x => clamp((x / innerWidth - 0.5) * 1.6, -1, 1);
  const noise = sec => { const b = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; };
  const impulse = sec => {
    const len = ctx.sampleRate * sec, b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2.8; }
    return b;
  };
  const env = (g, t0, a, peak, dur) => { g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + a); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); };

  function init() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.0001;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 4;
    master.connect(comp).connect(ctx.destination);
    const verb = ctx.createConvolver(); verb.buffer = impulse(3.6);
    const wet = ctx.createGain(); wet.gain.value = 0.6; verb.connect(wet).connect(master);
    bus = ctx.createGain(); bus.connect(master); bus.connect(verb);

    // nappe : accord Rém9 en dents de scie désaccordées, filtrées, qui respirent
    filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 480; filt.Q.value = 7;
    const pad = ctx.createGain(); pad.gain.value = 0.0001; pad.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 5);
    filt.connect(pad).connect(bus);
    const lfo = ctx.createOscillator(), lfoG = ctx.createGain(); lfo.frequency.value = 0.05; lfoG.gain.value = 260; lfo.connect(lfoG).connect(filt.frequency); lfo.start();
    [73.42, 110, 146.83, 174.61, 220, 261.63, 329.63].forEach((f, i) => [-7, 7].forEach(cents => {
      const o = ctx.createOscillator(), g = ctx.createGain(), p = ctx.createStereoPanner();
      o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = cents + (Math.random() - 0.5) * 4;
      g.gain.value = 0.05 / (1 + i * 0.35); p.pan.value = (i % 2 ? 1 : -1) * (0.2 + i * 0.1) * Math.sign(cents);
      o.connect(g).connect(p).connect(filt); o.start();
    }));
    const sub = ctx.createOscillator(), subG = ctx.createGain(); sub.frequency.value = 36.71; subG.gain.value = 0.22; sub.connect(subG).connect(pad); sub.start();
    // souffle : bruit filtré dont la bande se déplace lentement
    const air = ctx.createBufferSource(); air.buffer = noise(4); air.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 1.2;
    const airG = ctx.createGain(); airG.gain.value = 0.012;
    const lfo2 = ctx.createOscillator(), lfo2G = ctx.createGain(); lfo2.frequency.value = 0.03; lfo2G.gain.value = 1200; lfo2.connect(lfo2G).connect(bp.frequency); lfo2.start();
    air.connect(bp).connect(airG).connect(bus); air.start();
  }

  // cloche FM cristalline
  function bell(f, vol = 0.05, dur = 2.4, pan = 0, delay = 0) {
    const t0 = ctx.currentTime + delay;
    const o = ctx.createOscillator(), m = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain(), p = ctx.createStereoPanner();
    o.frequency.value = f; m.frequency.value = f * 3.51;
    mg.gain.setValueAtTime(f * 1.4, t0); mg.gain.exponentialRampToValueAtTime(1, t0 + dur);
    m.connect(mg).connect(o.frequency);
    env(g, t0, 0.008, vol, dur); p.pan.value = pan;
    o.connect(g).connect(p).connect(bus); o.start(t0); m.start(t0); o.stop(t0 + dur + 0.1); m.stop(t0 + dur + 0.1);
  }
  // souffle de transition
  function whoosh(vol = 0.05, dur = 0.9) {
    const t0 = ctx.currentTime, s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noise(dur + 0.1); f.type = 'bandpass'; f.Q.value = 3;
    f.frequency.setValueAtTime(260, t0); f.frequency.exponentialRampToValueAtTime(3200, t0 + dur * 0.55); f.frequency.exponentialRampToValueAtTime(400, t0 + dur);
    env(g, t0, dur * 0.45, vol, dur); s.connect(f).connect(g).connect(bus); s.start(t0); s.stop(t0 + dur + 0.1);
  }

  const api = {
    get on() { return on; },
    async toggle(state) {
      on = state;
      if (on && !ctx) init();
      if (!ctx) return;
      if (ctx.state === 'suspended') await ctx.resume();
      const t0 = ctx.currentTime;
      master.gain.cancelScheduledValues(t0); master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), t0);
      master.gain.exponentialRampToValueAtTime(on ? 0.9 : 0.0001, t0 + (on ? 1.6 : 0.6));
      if (on) { bell(note(0, 1), 0.06, 3); bell(note(4, 1), 0.05, 3, 0.4, 0.12); bell(note(7, 1), 0.045, 3.4, -0.4, 0.24); }
    },
    // survol : un « blip » dont la hauteur suit la position horizontale
    hover(x) {
      if (!on) return;
      const t0 = ctx.currentTime, f = note(Math.floor(clamp(x / innerWidth) * 9), 1);
      const o = ctx.createOscillator(), g = ctx.createGain(), p = ctx.createStereoPanner();
      o.type = 'sine'; o.frequency.setValueAtTime(f * 1.5, t0); o.frequency.exponentialRampToValueAtTime(f, t0 + 0.06);
      env(g, t0, 0.005, 0.045, 0.28); p.pan.value = panOf(x);
      o.connect(g).connect(p).connect(bus); o.start(t0); o.stop(t0 + 0.3);
    },
    // clic : décharge électrique + impact grave
    click(x) {
      if (!on) return;
      const t0 = ctx.currentTime, p = ctx.createStereoPanner(); p.pan.value = panOf(x); p.connect(bus);
      const z = ctx.createOscillator(), zf = ctx.createBiquadFilter(), zg = ctx.createGain();
      z.type = 'square'; z.frequency.setValueAtTime(1600, t0); z.frequency.exponentialRampToValueAtTime(110, t0 + 0.12);
      zf.type = 'bandpass'; zf.frequency.value = 1400; zf.Q.value = 2; env(zg, t0, 0.003, 0.05, 0.16);
      z.connect(zf).connect(zg).connect(p); z.start(t0); z.stop(t0 + 0.2);
      const k = ctx.createOscillator(), kg = ctx.createGain();
      k.frequency.setValueAtTime(110, t0); k.frequency.exponentialRampToValueAtTime(38, t0 + 0.18); env(kg, t0, 0.004, 0.22, 0.22);
      k.connect(kg).connect(master); k.start(t0); k.stop(t0 + 0.25);
    },
    // changement de section : souffle + note de la gamme
    section(i) { if (!on) return; whoosh(0.035); bell(note(i * 2, 0), 0.035, 2.8, (i % 2 ? 0.3 : -0.3), 0.15); },
    // configurateur : chaque étape monte d'un degré, la validation joue un accord
    step(i) { if (on) bell(note(i + 2, 1), 0.06, 1.8, 0); },
    select(i) { if (!on) return; bell(note(i, 2), 0.05, 1.2, -0.2); bell(note(i + 2, 2), 0.045, 1.4, 0.2, 0.07); },
    success() { if (!on) return; [0, 2, 4, 5, 7].forEach((d, k) => bell(note(d, 1 + (k > 3)), 0.06, 3.6, (k - 2) * 0.3, k * 0.09)); whoosh(0.05, 1.4); },
    theme(light) { if (!on) return; whoosh(0.05, 0.7); bell(note(light ? 7 : 0, 1), 0.05, 2); },
    // la vitesse de défilement ouvre le filtre de la nappe
    velocity(v) { if (on && filt) filt.frequency.setTargetAtTime(480 + Math.min(Math.abs(v) * 38, 2800), ctx.currentTime, 0.15); },
    tick(dt) { if (!on) return; shimmerT -= dt; if (shimmerT <= 0) { shimmerT = 2.5 + Math.random() * 3.5; bell(note(Math.floor(Math.random() * 10), 2), 0.018, 4, Math.random() * 1.6 - 0.8); } },
  };
  return api;
})();

/* ---------- WhatsApp ---------- */
const PHONE = '237671715511';
const MSG = {
  appel: t('Bonjour Axe Digital, je souhaite planifier un appel pour parler de mon projet.', 'Hello Axe Digital, I would like to schedule a call about my project.'),
  contact: t("Bonjour Axe Digital, j'aimerais en savoir plus sur vos services.", 'Hello Axe Digital, I would like to know more about your services.'),
};
const wa = text => `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
document.addEventListener('click', e => {
  const b = e.target.closest('[data-wa], [data-wa-solution]');
  if (!b) return;
  const s = en ? b.dataset.waSolutionEn : b.dataset.waSolution;
  const text = s ? t(`Bonjour Axe Digital, je souhaite une démo de ${s}.`, `Hello Axe Digital, I would like a demo of ${s}.`) : MSG[b.dataset.wa];
  window.open(wa(text), '_blank', 'noopener');
});

/* ---------- Langue : on mémorise la position et on recharge ---------- */
$$('.lang button').forEach(b => b.addEventListener('click', () => {
  if (b.dataset.lang === window.LANG) return;
  store.set('lang', b.dataset.lang);
  try { sessionStorage.setItem('y', scrollY); } catch {}
  location.reload();
}));

/* ---------- Thème clair / sombre ---------- */
let gl = null;
const themeBtn = $('#theme');
const syncThemeBtn = () => {
  const light = root.dataset.theme === 'light';
  themeBtn.setAttribute('aria-label', light ? t('Passer en thème sombre', 'Switch to dark theme') : t('Passer en thème clair', 'Switch to light theme'));
};
syncThemeBtn();
themeBtn.addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  store.set('axe-theme', next);
  $('meta[name="theme-color"]').content = next === 'light' ? '#eceef2' : '#040817';
  syncThemeBtn();
  gl?.setTheme(next);
  sfx.theme(next === 'light');
});

/* ---------- Chiffres : comptés dans la page, jamais saisis à la main ---------- */
$$('[data-count-src]').forEach(el => { const n = $$(el.dataset.countSrc).length; if (n) { el.dataset.count = n; el.textContent = n; } });

/* ---------- Logos partenaires : piste doublée pour une boucle sans couture ---------- */
const mq = $('.marquee-track');
mq.innerHTML += mq.innerHTML.replace(/alt="[^"]*"/g, 'alt="" aria-hidden="true"');

/* ---------- Intro ---------- */
(() => {
  const count = $('.loader-count b');
  if (reduce) { root.classList.add('loaded'); return; }
  const t0 = performance.now();
  let ready = false;
  addEventListener('load', () => { ready = true; }, { once: true });
  const step = now => {
    const el = now - t0, target = ready ? 100 : Math.min(92, el / 25);
    const v = Math.min(100, +count.textContent + Math.max(1, (target - count.textContent) * 0.12));
    count.textContent = String(Math.floor(v)).padStart(3, '0');
    $('.loader').style.setProperty('--lp', v / 100);
    if ((v >= 100 && el > 900) || el > 3800) { count.textContent = '100'; root.classList.add('loaded'); return; }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
})();

/* ---------- Défilement doux ---------- */
let lenis = null;
if (!reduce && window.Lenis) lenis = new window.Lenis({ lerp: 0.1, wheelMultiplier: 0.85, autoRaf: false });

/* ---------- Plans en profondeur ---------- */
const main = $('main'), foot = $('.foot');
const P = 1200, ZFAR = -700, ZNEAR = 320;      // perspective et profondeurs (px) : faibles pour garder les sections stables
const planes = [];
const ATTACH = '.label, .hero-title, .hero-foot, .hero-logos, .h2, .sec-sub, .fact, .tile, .vs-row, .panel, .stack, .brief, .cmp, .cta-card, .dash-wrap, .results li, .team-text, .team-frame, .testi, .cta-sub, .sec-cta .btn-row, .wrap > div.center, .foot-top, .foot-grid > *, .foot-bottom';
let spacer = null, D = 0, total = 0, vw = innerWidth, vh = innerHeight;
// carrousels horizontaux : la section s'arrête et ses cartes défilent de côté
const rails = [
  { id: 'solutions-ia', track: $('.h-track'), items: $$('.panel'), tilt: 7 },
  { id: 'nos-realisations', track: $('.gallery'), items: $$('.gallery .tile'), tilt: 5 },
];
const teamVids = $$('.team-clip'), teamCount = $('.team-count b'), teamSlides = $$('.team-slide');

if (!reduce) {
  root.classList.add('depth');
  main.append(foot);
  [...main.children].forEach((el, i) => {
    const inner = document.createElement('div'); inner.className = 'plane-in';
    while (el.firstChild) inner.appendChild(el.firstChild);
    el.appendChild(inner); el.classList.add('plane');
    let atts = $$(ATTACH, inner);
    atts = atts.filter(a => !atts.some(b => b !== a && b.contains(a)));   // pas d'attaches imbriquées
    planes.push({ el, inner, i, d: 9, key: '', atts: atts.map((a, e) => ({ el: a, e, x: 0, y: 0, cy: 0, k: -1, tr: '' })), seen: false });
  });
  spacer = document.createElement('div'); spacer.className = 'spacer'; document.body.appendChild(spacer);
}

function measure() {
  vw = innerWidth; vh = innerHeight; D = vh * (mobile() ? 0.9 : 1.15);
  planes.forEach(p => { p.el.style.transform = ''; p.inner.style.transform = ''; p.atts.forEach(a => { a.el.style.translate = ''; a.tr = ''; }); p.key = ''; });
  rails.forEach(r => {
    r.track.style.transform = '';
    r.items.forEach(el => { el.style.transform = el.style.scale = el.style.rotate = el.style.opacity = ''; });
    if (r.id === 'nos-realisations') r.track.classList.toggle('rail', !mobile());   // grille verticale sur mobile
  });
  let s = 0;
  planes.forEach(p => {
    const h = p.inner.offsetHeight;
    p.hv = Math.max(0, h - vh);
    p.pre = p.el.id === 'notre-equipe' ? vh * 2.5 : 0;                                         // les 5 vidéos défilent d'abord
    p.rail = mobile() ? null : rails.find(r => r.id === p.el.id);
    p.post = p.rail ? Math.max(0, p.rail.track.scrollWidth - vw) * 1.3 : 0;  // puis le carrousel horizontal
    p.s = s; p.e = s + p.pre + p.hv + p.post; s = p.e + D;
    const ir = p.inner.getBoundingClientRect();
    p.atts.forEach(a => {
      const r = a.el.getBoundingClientRect();
      a.x = r.left + r.width / 2 - ir.left; a.y = r.bottom - ir.top; a.cy = r.top + r.height / 2 - ir.top;
      a.inTrack = !!p.rail?.track.contains(a.el);
    });
  });
  rails.forEach(r => { r.base = r.items.map(el => { const b = el.getBoundingClientRect(); return b.left + b.width / 2; }); });
  total = planes.at(-1).e;
  spacer.style.height = total + vh + 'px';
  lenis?.resize();
}

// position de scroll correspondant à l'arrivée d'une section
const targetOf = id => { const p = planes.find(p => p.el.id === id || p.el.querySelector('#' + CSS.escape(id))); return p ? p.s + 1 : null; };
const goTo = id => {
  const y = targetOf(id); if (y == null) return;
  if (lenis) lenis.scrollTo(y, { duration: clamp(Math.abs(y - scrollY) / 4000, 1.2, 3.2) });
  else window.scrollTo({ top: y, behavior: 'smooth' });
};

/* ---------- Menu ---------- */
const burger = $('.burger');
const setMenu = open => {
  root.classList.toggle('menu-open', open);
  if (open) $('.nav').classList.remove('hide');   // le bouton de fermeture doit rester accessible
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? t('Fermer le menu', 'Close menu') : t('Ouvrir le menu', 'Open menu'));
  $('.menu').setAttribute('aria-hidden', !open);
  open ? lenis?.stop() : lenis?.start();
};
burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('menu-open')) setMenu(false); });

/* ---------- Ancres & pages légales ---------- */
const openLegal = id => { const d = document.getElementById(id); if (!d) return; lenis?.stop(); d.showModal(); };
$$('dialog.legal').forEach(d => {
  d.addEventListener('close', () => lenis?.start());
  d.addEventListener('click', e => { if (e.target === d || e.target.closest('.legal-close')) d.close(); });
});
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href').slice(1);
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  setMenu(false);
  if (el.tagName === 'DIALOG') openLegal(id);
  else if (planes.length) goTo(id);
  else el.scrollIntoView({ behavior: 'smooth' });
});
// navigation au clavier : on amène la section qui reçoit le focus
document.addEventListener('focusin', e => {
  const p = planes.find(p => p.el.contains(e.target));
  if (p && Math.abs(p.d) > 0.2) { window.scrollTo(0, p.s + 1); lenis?.scrollTo(p.s + 1, { immediate: true }); }
});

/* ---------- Copier l'adresse email ---------- */
$$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(b.dataset.copy); } catch { return; }
  b.classList.add('done'); setTimeout(() => b.classList.remove('done'), 1800);
}));

/* ---------- Configurateur de projet ---------- */
const brief = $('#brief');
const qs = $$('.q', brief), N_Q = 6;                         // 5 questions + coordonnées, puis l'écran « envoyé »
const recapRows = $$('.brief-recap [data-key]', brief);
const stepEl = $('.brief-step b', brief), backBtn = $('.brief-back', brief);
let qi = 0, advT = 0;
const valueOf = input => (en ? input.dataset.enValue : input.value);
function goQ(i, focus = true) {
  qi = clamp(i, 0, qs.length - 1);
  qs.forEach((q, k) => { q.classList.toggle('is-on', k === qi); q.classList.toggle('is-past', k < qi); q.inert = k !== qi; });
  stepEl.textContent = String(Math.min(qi + 1, N_Q)).padStart(2, '0');
  brief.style.setProperty('--p', Math.min(qi + 1, N_Q) / N_Q);
  backBtn.disabled = qi === 0 || qi >= N_Q;
  recapRows.forEach(r => r.classList.toggle('now', r.dataset.key === qs[qi].dataset.key));
  if (focus) (qs[qi].querySelector('input:checked') || qs[qi].querySelector('input, [tabindex]'))?.focus({ preventScroll: true });
}
const record = input => {
  const row = recapRows.find(r => r.dataset.key === input.name);
  if (row) { row.classList.remove('set'); void row.offsetWidth; row.classList.add('set'); $('dd', row).textContent = valueOf(input); }
};
const choose = input => {
  input.checked = true; record(input);
  sfx.select(qs.indexOf(input.closest('.q')));
  clearTimeout(advT); advT = setTimeout(() => { goQ(qs.indexOf(input.closest('.q')) + 1); sfx.step(qi); }, 360);
};
brief.addEventListener('change', e => { if (e.target.type === 'radio') record(e.target); });
// clic sur une option (le clic relayé par le navigateur vers l'input est ignoré) ; les flèches choisissent sans avancer
brief.addEventListener('click', e => { const opt = e.target.closest('.opt'); if (opt && e.target.tagName !== 'INPUT') choose($('input', opt)); });
brief.addEventListener('keydown', e => {
  if (e.target.matches('input[type="radio"]') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); choose(e.target); }
});
backBtn.addEventListener('click', () => { goQ(qi - 1); sfx.step(qi); });
// raccourcis : 1–8 pour répondre, retour arrière pour revenir (quand le configurateur est à l'écran)
const briefVisible = () => { const r = brief.getBoundingClientRect(); return r.top < vh * 0.7 && r.bottom > vh * 0.3 && !root.classList.contains('menu-open'); };
addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.target.matches('input:not([type="radio"]), textarea') || !briefVisible() || qi >= N_Q - 1) return;
  if (/^[1-9]$/.test(e.key)) { const r = $$('input[type="radio"]', qs[qi])[+e.key - 1]; if (r) { e.preventDefault(); choose(r); } }
  else if (e.key === 'Backspace' && qi > 0) { e.preventDefault(); goQ(qi - 1); }
});
// les cartes « Expertises » pré-remplissent la première question
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-preset]'); if (!a) return;
  const r = $(`input[name="type"][data-preset="${a.dataset.preset}"]`, brief);
  if (r) { r.checked = true; record(r); goQ(1, false); }
});
// le halo du formulaire suit la souris
brief.addEventListener('pointermove', e => { const r = brief.getBoundingClientRect(); brief.style.setProperty('--bx', (e.clientX - r.left) / r.width * 100 + '%'); brief.style.setProperty('--by', (e.clientY - r.top) / r.height * 100 + '%'); }, { passive: true });

const briefText = () => {
  const f = new FormData(brief), v = k => (f.get(k) || '').toString().trim();
  const pick = k => { const i = $(`input[name="${k}"]:checked`, brief); return i ? valueOf(i) : '—'; };
  return [
    t('Bonjour Axe Digital, voici mon brief projet :', 'Hello Axe Digital, here is my project brief:'), '',
    `• ${t('Projet', 'Project')} : ${pick('type')}`, `• ${t('Secteur', 'Sector')} : ${pick('sector')}`, `• ${t('Objectif', 'Goal')} : ${pick('goal')}`,
    `• ${t('Envergure', 'Scope')} : ${pick('budget')}`, `• ${t('Démarrage', 'Start')} : ${pick('when')}`, '',
    `${t('Nom', 'Name')} : ${v('name')}`, v('company') && `${t('Entreprise', 'Company')} : ${v('company')}`, `${t('Téléphone', 'Phone')} : ${v('phone')}`,
    v('message') && `${t('Détail', 'Details')} : ${v('message')}`,
  ].filter(l => l !== false).join('\n');
};
brief.addEventListener('submit', e => {
  e.preventDefault();
  const name = brief.elements.name.value.trim(), phone = brief.elements.phone.value;
  const bad = [[brief.elements.name, !name], [brief.elements.phone, phone.replace(/\D/g, '').length < 8]];
  bad.forEach(([el, ko]) => (ko ? el.setAttribute('aria-invalid', 'true') : el.removeAttribute('aria-invalid')));
  const first = bad.find(([, ko]) => ko);
  $('.brief-error', brief).hidden = !first;
  if (first) { first[0].focus(); return; }
  const url = wa(briefText());
  $('.brief-resend', brief).href = url;
  const type = $('input[name="type"]:checked', brief);
  window.fbq?.('track', 'Lead', { content_name: type ? type.value : 'brief' });
  window.open(url, '_blank', 'noopener');
  goQ(N_Q);
  sfx.success();
});
brief.addEventListener('input', e => { if (e.target.hasAttribute('aria-invalid')) e.target.removeAttribute('aria-invalid'); });
$('.brief-mail', brief).addEventListener('click', e => {
  e.currentTarget.href = `mailto:contact@axedigital.agency?subject=${encodeURIComponent(t('Brief projet', 'Project brief'))}&body=${encodeURIComponent(briefText())}`;
});
$('.brief-restart', brief).addEventListener('click', () => {
  brief.reset();
  recapRows.forEach(r => { r.classList.remove('set'); $('dd', r).textContent = '—'; });
  $('.brief-error', brief).hidden = true;
  goQ(0);
});
goQ(0, false);

/* ---------- Équipe : un plan vidéo à la fois ---------- */
let teamActive = -1;
const showTeam = i => {
  if (i === teamActive) return;
  teamActive = i;
  teamVids.forEach((v, k) => { if (k === i) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); } else v.pause(); });
  if (i >= 0 && reduce) teamSlides.forEach((s, k) => { s.style.opacity = k === i ? 1 : 0; });
  if (i >= 0) { teamCount.textContent = String(i + 1).padStart(2, '0'); if (gsap && !reduce) gsap.fromTo(teamCount, { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }); }
  gl?.setTeam(i, teamVids[i]);
};
let teamTL = null;
if (gsap && !reduce) {
  teamTL = gsap.timeline({ paused: true });
  teamVids.forEach((v, i) => {
    if (!i) return;
    // une plage de scroll par vidéo : elle reste affichée, puis recule pendant que la suivante prend sa place
    teamTL.to(teamVids[i - 1], { scale: 0.62, yPercent: -6, opacity: 0, filter: 'brightness(.4)', ease: 'power2.in', duration: 0.45 }, i - 0.25)
      .fromTo(v, { xPercent: 55, scale: 0.85, opacity: 0 }, { xPercent: 0, scale: 1, opacity: 1, ease: 'power3.out', duration: 0.55 }, i - 0.1)
      .to(teamSlides[i - 1], { yPercent: -25, opacity: 0, ease: 'power2.in', duration: 0.3 }, i - 0.25)
      .fromTo(teamSlides[i], { yPercent: 25, opacity: 0 }, { yPercent: 0, opacity: 1, ease: 'power3.out', duration: 0.45 }, i - 0.05);
  });
  teamTL.set({}, {}, teamVids.length);   // durée totale = nombre de vidéos, alignée sur le compteur
}

/* ---------- Compteurs ---------- */
const countUp = root => $$('[data-count]', root).forEach(el => {
  const end = +el.dataset.count;
  if (!gsap || reduce) { el.textContent = end; return; }
  const o = { v: 0 };
  gsap.to(o, { v: end, duration: 2, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); } });
});

/* ---------- Fils (canvas 2D au-dessus de la 3D, sous le contenu) ---------- */
const threads = $('#threads'), tctx = threads.getContext('2d');
const sizeThreads = () => { const r = Math.min(devicePixelRatio, 1.5); threads.width = innerWidth * r; threads.height = innerHeight * r; tctx.setTransform(r, 0, 0, r, 0, 0); };
sizeThreads();
const hex = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const PAL_RGB = PALETTE.map(hex);
const colorAt = f => { const i = Math.floor(clamp(f, 0, PALETTE.length - 1)), j = Math.min(PALETTE.length - 1, i + 1), k = clamp(f - i); return PAL_RGB[i].map((v, n) => Math.round(v + (PAL_RGB[j][n] - v) * k)); };
const anchor = { x: 0, y: 0 };
const project = (i, e) => {
  if (gl) return gl.project(i, e, anchor);
  anchor.x = vw / 2 + (Math.min(e, 10) - 5) * 16; anchor.y = vh * 0.88 - Math.min(e, 10) * 5;   // sans 3D : fil simplifié en bas d'écran
  return true;
};

/* ---------- Navigation : section active ---------- */
const navLinks = $$('.nav-links a, .menu a:not(.btn)');
const setActiveNav = id => navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + id));
const nav = $('.nav'), bar = $('.progress i');
const tileVids = $$('.tile video').map(v => ({ v, p: planes.find(p => p.el.contains(v)) }));
// bouton WhatsApp : absent du hero et des sections de contact (il masquerait leurs boutons)
const waBtn = $('.wa-float');
let waOff = null;
const setWa = off => { if (off !== waOff) { waOff = off; waBtn.classList.toggle('off', off); } };
const NO_WA = ['demarrer', 'cta', 'nous-contacter'];

/* ---------- Boucle unique : scroll → plans → caméra 3D → attaches ---------- */
const mouse = { x: 0, y: 0 };
addEventListener('pointermove', e => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5; }, { passive: true });
let lastY = -1, frameN = 0, lastNav = '', paused = false, lastSec = 0;

function frame(dt) {
  const y = lenis ? lenis.scroll : scrollY;
  const moved = y !== lastY;
  let f = 0;
  const cx = vw / 2, cy = vh / 2, lite = mobile();

  // 1) état de chaque plan
  for (const p of planes) {
    let d, local = 0;
    if (y < p.s - D) d = -1;
    else if (y < p.s) d = (y - p.s) / D;
    else if (y <= p.e) { d = 0; local = y - p.s; }
    else if (y < p.e + D) d = (y - p.e) / D;
    else d = 1;
    if (p.i === 0 && y < p.s) d = 0;
    if (p.i === planes.length - 1 && d > 0) d = 0;
    p.d = d;
    if (d === 0) f = p.i; else if (d > 0 && d < 1) f = p.i + d;
    p.local = d < 0 ? 0 : d > 0 ? p.pre + p.hv + p.post : local;
    p.off = clamp(p.local - p.pre, 0, p.hv);
  }

  // 2) styles des plans (seulement si le scroll a bougé)
  if (moved) for (const p of planes) {
    const d = p.d, vis = d > -1 && d < 1;
    const key = vis ? d.toFixed(4) + '|' + p.local.toFixed(1) : 'h';   // local : avance aussi pendant les séquences (vidéos équipe, carrousel)
    if (key === p.key) continue;
    p.key = key;
    const st = p.el.style;
    if (!vis) { st.visibility = 'hidden'; st.pointerEvents = 'none'; continue; }
    const z = d < 0 ? -d * ZFAR : d * ZNEAR;
    st.visibility = 'visible';
    st.transform = `translate3d(0,0,${z.toFixed(1)}px)`;
    st.opacity = (d < 0 ? clamp(1 + d * 2.2) : clamp(1 - d * 2.6)).toFixed(3);
    st.zIndex = d > 0 ? 3 : d === 0 ? 2 : 1;
    st.pointerEvents = Math.abs(d) < 0.2 ? 'auto' : 'none';
    p.inner.style.transform = `translate3d(0,${(-p.off).toFixed(1)}px,0)`;

    // séquences internes
    if (p.rail && p.post) {
      const r = p.rail, prog = clamp((p.local - p.pre - p.hv) / p.post);
      const tx = -prog * Math.max(0, r.track.scrollWidth - vw);
      p.trackX = tx;
      r.track.style.transform = `translate3d(${tx.toFixed(1)}px,0,0)`;
      // propriétés individuelles : le survol 3D des cartes (transform) reste libre
      r.items.forEach((el, k) => {
        const dd = (r.base[k] + tx - cx) / cx, a = Math.min(Math.abs(dd), 1);
        el.style.rotate = `y ${(-dd * r.tilt).toFixed(2)}deg`;
        el.style.scale = (1 - a * 0.05).toFixed(3);
        el.style.opacity = (1 - a * 0.08).toFixed(3);
        el.classList.toggle('active', a < 0.35);
      });
    }
    if (p.el.id === 'notre-equipe' && p.pre) {
      const tp = clamp(p.local / p.pre);
      teamTL?.progress(tp);
      if (Math.abs(d) < 0.6) showTeam(Math.min(teamVids.length - 1, Math.floor(tp * teamVids.length * 0.999)));
    }
  }
  const team = planes.find(p => p.el.id === 'notre-equipe');
  if (team && Math.abs(team.d) >= 0.6 && teamActive !== -1) { teamVids.forEach(v => v.pause()); teamActive = -1; gl?.setTeam(-1); }

  // 3) section active : menu, compteurs, bouton WhatsApp, son
  const cur = planes[Math.round(f)];
  if (cur) {
    if (cur.el.id !== lastNav) { lastNav = cur.el.id; setActiveNav(cur.el.id); }
    setWa(f < 0.5 || NO_WA.includes(cur.el.id));
    root.classList.toggle('at-foot', cur.el.id === 'nous-contacter');
    if (cur.i !== lastSec) { lastSec = cur.i; sfx.section(cur.i); }
    for (const p of planes) if (!p.seen && Math.abs(p.d) < 0.35) { p.seen = true; p.el.classList.add('seen'); countUp(p.el); }
  }
  if (moved) {
    nav.classList.toggle('hide', y > lastY && y > 400 && !root.classList.contains('menu-open'));
    bar.style.transform = `scaleX(${total ? y / total : 0})`;
  }

  // 4) scène 3D, synchronisée sur la même position
  gl?.frame(f, dt, mouse.x, mouse.y, lenis ? lenis.velocity : 0);
  const [cr, cg, cb] = gl ? [gl.color.r * 255 | 0, gl.color.g * 255 | 0, gl.color.b * 255 | 0] : colorAt(f);
  root.style.setProperty('--thread', `${cr},${cg},${cb}`);

  // 5) attaches : chaque élément glisse le long de son fil, et on dessine les fils
  tctx.clearRect(0, 0, vw, vh);
  if (!gl) {   // fil simplifié sans 3D
    tctx.strokeStyle = `rgba(${cr},${cg},${cb},.7)`; tctx.lineWidth = 1.5;
    tctx.beginPath(); tctx.moveTo(cx, vh + 10); tctx.quadraticCurveTo(cx + Math.sin(f * 2) * 40, vh * 0.85, cx, vh * 0.72); tctx.stroke();
  }
  for (const p of planes) {
    const d = p.d;
    if (d <= -1 || d >= 1) continue;
    const z = d < 0 ? -d * ZFAR : d * ZNEAR, sc = P / (P - z);
    const op = d < 0 ? clamp(1 + d * 2.2) : clamp(1 - d * 2.6);
    if (op < 0.02) continue;
    const max = lite ? 6 : 99;
    for (const a of p.atts) {
      if (a.e >= max) { if (a.tr) { a.el.style.translate = ''; a.tr = ''; } continue; }
      if (!project(p.i, a.e)) continue;
      const ox = a.inTrack ? (p.trackX || 0) : 0;
      const exs = cx + (a.x + ox - cx) * sc, ecy = cy + (a.cy - p.off - cy) * sc;
      // arrivée / départ : l'élément est tiré vers son point d'attache ; contenu encore sous l'écran : il remonte le long du fil
      const kd0 = d === 0 ? 0 : clamp(Math.abs(d) * (1.6 + Math.min(a.e, 8) * 0.18)), kd = kd0 * kd0;   // les éléments se posent dans l'ordre de lecture
      const ki = 0;
      const k = kd >= ki ? kd : ease(ki);
      const apx = cx + (anchor.x - cx) / sc, apy = cy + (anchor.y - cy) / sc + p.off;
      let dx = (apx - a.x - ox) * 0.16, dy = (apy - a.y) * 0.16;   // tirés vers le fil, juste assez pour suggérer l'attache
      // à l'arrivée : tiré jusqu'au fil ; pendant la lecture : simple glissement limité (pas d'empilement)
      const m = kd >= ki ? k : Math.min(1, 70 / (Math.hypot(dx, dy) || 1)) * k;
      dx *= m; dy *= m;
      const tr = k > 0.002 ? `${dx.toFixed(1)}px ${dy.toFixed(1)}px` : '';
      if (tr !== a.tr) { a.el.style.translate = tr; a.tr = tr; }
      // le fil, de l'attache jusqu'au bas de l'élément
      const ex = cx + (a.x + ox + dx - cx) * sc, ey = cy + (a.y - p.off + dy - cy) * sc;
      if (ey < -100 || ey > vh + 300 || exs < -400) continue;
      const al = op * (0.22 + 0.25 * (1 - k));
      tctx.strokeStyle = `rgba(${cr},${cg},${cb},${al.toFixed(3)})`; tctx.lineWidth = 1;
      tctx.beginPath(); tctx.moveTo(anchor.x, anchor.y);
      tctx.quadraticCurveTo(anchor.x + (ex - anchor.x) * 0.15, ey + (anchor.y - ey) * 0.15, ex, ey); tctx.stroke();
      tctx.fillStyle = `rgba(${cr},${cg},${cb},${Math.min(1, al * 3).toFixed(3)})`;
      tctx.beginPath(); tctx.arc(ex, ey, 2.4, 0, 6.29); tctx.fill();
      tctx.beginPath(); tctx.arc(anchor.x, anchor.y, 1.6, 0, 6.29); tctx.fill();
    }
  }

  // 6) moins souvent : rayures du comparatif, vidéos des réalisations
  if (++frameN % 10 === 0) {
    for (const p of planes) {
      if (Math.abs(p.d) > 0.3) continue;
      p.el.querySelectorAll('.vs-row:not(.on), .cmp-row:not(.on):not(.cmp-head):not(.cmp-foot)').forEach(row => {
        const a = p.atts.find(a => a.el === row || a.el.contains(row));
        const top = row.offsetTop + (row.offsetParent && row.offsetParent !== p.inner ? row.offsetParent.offsetTop : 0);
        const yy = a && a.el === row ? a.cy : top + row.offsetHeight / 2;
        if (yy - p.off < vh * 0.8) row.classList.add('on');
      });
      p.el.querySelectorAll('.gallery .tile:not(.on)').forEach(tile => {
        if (tile.getBoundingClientRect().top < vh * 0.9) tile.classList.add('on');
      });
    }
    tileVids.forEach(({ v, p }) => {
      const r = v.getBoundingClientRect();
      const on = p && Math.abs(p.d) < 0.5 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
      if (on && v.paused) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); }
      else if (!on && !v.paused) v.pause();
    });
  }
  lastY = y;
}

let last = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  if (paused) return;
  const dt = Math.min((now - last) / 1000, 0.05); last = now;
  lenis?.raf(now);
  frame(dt);
  sfx.tick(dt);
}

/* ---------- Démarrage ---------- */
if (!reduce) {
  measure();
  let restore = null; try { restore = sessionStorage.getItem('y'); sessionStorage.removeItem('y'); } catch {}
  const h = location.hash.slice(1), target = h && !document.getElementById(h)?.matches('dialog') ? targetOf(h) : null;
  const y0 = restore != null ? +restore : target;
  if (y0 != null) { window.scrollTo(0, y0); lenis?.scrollTo(y0, { immediate: true }); }
  requestAnimationFrame(loop);
  let rt;
  const remeasure = () => { const prog = total ? scrollY / total : 0; measure(); window.scrollTo(0, prog * total); lastY = -1; };
  addEventListener('resize', () => {
    // clavier mobile ouvert sur un champ : seule la hauteur change, on ne recalcule pas (sinon la page saute)
    if (innerWidth === vw && document.activeElement?.matches('input, textarea, select')) return;
    clearTimeout(rt); rt = setTimeout(() => { remeasure(); sizeThreads(); gl?.resize(); }, 150);
  });
  document.fonts?.ready.then(remeasure);
  addEventListener('load', remeasure);
} else {
  /* mouvement réduit : page verticale classique, rien ne bouge */
  $$('[data-count]').forEach(el => { el.textContent = el.dataset.count; });
  $$('.vs-row, .cmp-row').forEach(r => r.classList.add('on'));
  teamVids.forEach((v, i) => { v.loop = false; v.style.opacity = i ? 0 : 1; v.addEventListener('ended', () => { v.style.opacity = 0; const n = (i + 1) % teamVids.length; teamVids[n].style.opacity = 1; teamActive = -1; showTeam(n); }); });
  const sections = [...$$('main > section'), foot];
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const i = sections.indexOf(en.target);
    setActiveNav(en.target.id);
    setWa(i === 0 || NO_WA.includes(en.target.id));
    gl?.frame(0, 0, 0, 0, 0, i);
    const c = colorAt(i); root.style.setProperty('--thread', c.join(','));
  }), { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(s => io.observe(s));
  new IntersectionObserver(es => es.forEach(en => en.isIntersecting ? showTeam(Math.max(teamActive, 0)) : (teamVids.forEach(v => v.pause()), teamActive = -1)), { threshold: 0.3 }).observe($('.team-frame'));
  const vio = new IntersectionObserver(es => es.forEach(({ target: v, isIntersecting }) => { if (isIntersecting) { if (!v.src) v.src = v.dataset.src; } else v.pause(); }));
  tileVids.forEach(({ v }) => vio.observe(v));
}
$$('dialog.legal').forEach(d => new MutationObserver(() => { paused = d.open; }).observe(d, { attributes: true, attributeFilter: ['open'] }));

$$('.tile .sound').forEach(b => b.addEventListener('click', e => {
  e.preventDefault();
  const v = b.parentElement.querySelector('video');
  v.muted = !v.muted;
  b.textContent = v.muted ? t('Son', 'Sound') : t('Couper', 'Mute');
}));

/* ---------- Micro-interactions (souris fine uniquement) ---------- */
if (fine && !reduce && gsap) {
  const cur = $('.cursor'), label = $('.cursor-label');
  const setX = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' }), setY = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
  addEventListener('pointermove', e => { setX(e.clientX); setY(e.clientY); }, { passive: true });
  addEventListener('pointerdown', e => {
    cur.classList.add('down');
    const r = document.createElement('span'); r.className = 'cursor-ripple';
    r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
    r.addEventListener('animationend', () => r.remove());
    document.body.appendChild(r);
  });
  addEventListener('pointerup', () => cur.classList.remove('down'));
  document.addEventListener('pointerover', e => {
    const l = e.target.closest('[data-cursor]');
    cur.classList.toggle('label', !!l);
    if (l) label.textContent = l.dataset.cursor;
    cur.classList.toggle('hover', !l && !!e.target.closest('a, button, .opt'));
  });
  // boutons magnétiques
  $$('.btn').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.18, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.5, ease: 'power3.out' }); });
    b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,.4)' }));
  });
  // cartes inclinables + reflet qui suit la souris
  $$('.tile, .stack').forEach(c => {
    const lift = c.classList.contains('tile') ? -10 : 0;
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%');
      gsap.to(c, { rotateY: (x - 0.5) * 10, rotateX: (0.5 - y) * 10, y: lift, transformPerspective: 1000, duration: 0.5, ease: 'power3.out' });
    });
    c.addEventListener('pointerleave', () => gsap.to(c, { rotateX: 0, rotateY: 0, y: 0, duration: 0.9, ease: 'elastic.out(1,.5)' }));
  });
}

/* ---------- Son : bouton, survols, clics, vitesse de défilement ---------- */
const soundBtn = $('#sound');
soundBtn.addEventListener('click', () => {
  const on = !sfx.on;
  soundBtn.setAttribute('aria-pressed', on);
  soundBtn.setAttribute('aria-label', on ? t('Couper le son', 'Turn sound off') : t('Activer le son', 'Turn sound on'));
  sfx.toggle(on);
});
document.addEventListener('pointerover', e => {
  if (!sfx.on) return;
  const el = e.target.closest('a, button, .opt, .tile');
  if (!el || el.contains(e.relatedTarget)) return;
  const r = el.getBoundingClientRect();
  sfx.hover(r.left + r.width / 2);
});
document.addEventListener('click', e => { if (sfx.on && e.target.closest('a, button')) sfx.click(e.clientX); });
lenis?.on('scroll', ({ velocity }) => sfx.velocity(velocity));

/* ---------- Scène 3D : chargée après l'affichage, jamais sur les appareils faibles ---------- */
const weak = ((navigator.hardwareConcurrency || 8) <= 4 && mobile()) || navigator.connection?.saveData;
const hasGL = (() => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } })();
const start3D = () => import('./gl.js')
  .then(m => m.start($('#gl'), { lite: mobile(), palette: PALETTE, theme: root.dataset.theme, onHover: on => { $('.cursor')?.classList.toggle('hover', on); if (on) sfx.hover(innerWidth / 2 + mouse.x * innerWidth); } }))
  .then(api => { gl = api; lastY = -1; if (reduce) gl.frame(0, 0, 0, 0, 0, 0); })
  .catch(err => console.warn('3D désactivée :', err));
if (hasGL && !weak) {
  const go = () => ('requestIdleCallback' in window ? requestIdleCallback(start3D, { timeout: 1200 }) : setTimeout(start3D, 200));
  document.readyState === 'complete' ? go() : addEventListener('load', go, { once: true });
}
