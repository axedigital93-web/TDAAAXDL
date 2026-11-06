/* Axe Digital v2 — défilement en profondeur.
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
const { gsap } = window;

// teintes de la charte, une par section (accueil → footer)
const PALETTE = ['#2843cc', '#5a74ff', '#0238d6', '#9fb2ff', '#2843cc', '#ffffff', '#0238d6', '#5a74ff', '#9fb2ff', '#2843cc', '#ffffff', '#0238d6', '#5a74ff'];

/* ---------- WhatsApp (mêmes messages que la v1) ---------- */
const PHONE = '237671715511';
const MSG = {
  commander: t("Bonjour, je souhaite commander vos services. Pouvez-vous me fournir plus d'informations ?", 'Hello, I would like to order your services. Could you give me more information?'),
  appel: t('Bonjour, je souhaite passer un appel pour discuter de vos services.', 'Hello, I would like to schedule a call to discuss your services.'),
  contact: t("Bonjour, je souhaite obtenir plus d'informations sur vos services.", 'Hello, I would like more information about your services.'),
};
const wa = text => `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
$$('[data-pack]').forEach(a => {
  const name = en ? a.dataset.packEn : a.dataset.pack;
  a.href = wa(t(`Bonjour, je suis intéressé(e) par le pack ${name}. Pouvez-vous me donner plus de détails ?`, `Hello, I am interested in the ${name} pack. Could you give me more details?`));
});
document.addEventListener('click', e => {
  const b = e.target.closest('[data-wa], [data-wa-solution]');
  if (!b) return;
  const s = en ? b.dataset.waSolutionEn : b.dataset.waSolution;
  const text = s ? t(`Bonjour, je suis intéressé(e) par votre solution : ${s}. Pouvez-vous me donner plus de détails ?`, `Hello, I am interested in your solution: ${s}. Could you give me more details?`) : MSG[b.dataset.wa];
  window.open(wa(text), '_blank', 'noopener');
});

/* ---------- Formulaire d'audit : la demande part sur WhatsApp, déjà rédigée ---------- */
const form = $('#audit');
form.addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(form), v = k => (f.get(k) || '').toString().trim();
  const err = $('.audit-error', form);
  const name = v('name'), phone = v('phone');
  const bad = [[form.elements.name, !name], [form.elements.phone, phone.replace(/\D/g, '').length < 8]];
  bad.forEach(([el, ko]) => el.setAttribute('aria-invalid', ko));
  const first = bad.find(([, ko]) => ko);
  err.hidden = !first;
  if (first) { first[0].focus(); return; }
  const need = form.querySelector('input[name="need"]:checked');
  const needLabel = en ? need.dataset.enValue : need.value;
  const details = en
    ? [`Name: ${name}`, v('company') && `Company: ${v('company')}`, `Phone: ${phone}`, `Need: ${needLabel}`, v('message') && `Project: ${v('message')}`]
    : [`Nom : ${name}`, v('company') && `Entreprise : ${v('company')}`, `Téléphone : ${phone}`, `Besoin : ${needLabel}`, v('message') && `Projet : ${v('message')}`];
  const text = [t('Bonjour Axe Digital, je souhaite un audit IA gratuit.', 'Hello Axe Digital, I would like a free AI audit.'), '', ...details.filter(Boolean)].join('\n');
  window.fbq?.('track', 'Lead', { content_name: needLabel });
  window.open(wa(text), '_blank', 'noopener');
});
// même message, par email
$('.audit-mail', form).addEventListener('click', () => {
  const f = new FormData(form), v = k => (f.get(k) || '').toString().trim();
  const need = form.querySelector('input[name="need"]:checked');
  const body = [`${t('Nom', 'Name')} : ${v('name')}`, `${t('Entreprise', 'Company')} : ${v('company')}`, `${t('Téléphone', 'Phone')} : ${v('phone')}`, `${t('Besoin', 'Need')} : ${en ? need.dataset.enValue : need.value}`, '', v('message')].join('\n');
  $('.audit-mail', form).href = `mailto:contact@axedigital.agency?subject=${encodeURIComponent(t('Demande d\'audit IA gratuit', 'Free AI audit request'))}&body=${encodeURIComponent(body)}`;
});
form.addEventListener('input', e => { if (e.target.getAttribute('aria-invalid') === 'true') e.target.removeAttribute('aria-invalid'); });

/* ---------- Langue : on mémorise la position et on recharge ---------- */
$$('.lang button').forEach(b => b.addEventListener('click', () => {
  if (b.dataset.lang === window.LANG) return;
  localStorage.setItem('lang', b.dataset.lang);
  sessionStorage.setItem('y', scrollY);
  location.reload();
}));

/* ---------- Logos partenaires : piste doublée pour une boucle sans couture ---------- */
const mq = $('.marquee-track');
mq.innerHTML += mq.innerHTML.replace(/alt="[^"]*"/g, 'alt="" aria-hidden="true"');

/* ---------- Défilement doux ---------- */
let lenis = null;
if (!reduce && window.Lenis) lenis = new window.Lenis({ lerp: 0.085, wheelMultiplier: 0.9, autoRaf: false });

/* ---------- Plans en profondeur ---------- */
const main = $('main'), foot = $('.foot');
const P = 1200, ZFAR = -1600, ZNEAR = 750;     // perspective et profondeurs (px)
const planes = [];
const ATTACH = '.eyebrow, .hero-title, .hero-sub, .hero-cta, .hero-logos, .chap, .h2, .sec-sub, .stat, .chart-card, .tile, .vs-row, .panel, .stack, .price, .cmp, .cta-card, .dash-wrap, .growth-text h3, .method li, .growth-text > .btn, .team-text, .team-frame, .card3d, .testi, .cta-badge, .cta-sub, .cta-feat, .cta-grid .btn-row, .cta-trust, .audit-form, .wrap > div.center, .foot-grid > *, .foot-bottom';
let spacer = null, D = 0, total = 0, vw = innerWidth, vh = innerHeight;
// carrousels horizontaux : la section s'arrête et ses cartes défilent de côté
const rails = [
  { id: 'solutions-ia', track: $('.h-track'), items: $$('.panel'), tilt: 20 },
  { id: 'nos-realisations', track: $('.gallery'), items: $$('.gallery .tile'), tilt: 14 },
];
const teamVids = $$('.team-clip'), teamCount = $('.team-count b'), teamSlides = $$('.team-slide');

if (!reduce) {
  document.documentElement.classList.add('depth');
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

/* ---------- Menu mobile ---------- */
const burger = $('.burger');
const setMenu = open => {
  document.documentElement.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', open);
  $('.menu').setAttribute('aria-hidden', !open);
  open ? lenis?.stop() : lenis?.start();
};
burger.addEventListener('click', () => setMenu(!document.documentElement.classList.contains('menu-open')));

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
  else el.scrollIntoView();
});
// navigation au clavier : on amène la section qui reçoit le focus
document.addEventListener('focusin', e => {
  const p = planes.find(p => p.el.contains(e.target));
  if (p && Math.abs(p.d) > 0.2) { window.scrollTo(0, p.s + 1); lenis?.scrollTo(p.s + 1, { immediate: true }); }
});

/* ---------- Équipe : un plan vidéo à la fois ---------- */
let teamActive = -1, gl = null;
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
const navLinks = $$('.nav-links a');
const setActiveNav = id => navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + id));
const nav = $('.nav'), bar = $('.progress i');
// bouton WhatsApp : absent du hero et de la section du formulaire (il masquerait le bouton d'envoi)
const waBtn = $('.wa-float');
let waOff = null;
const setWa = off => { if (off !== waOff) { waOff = off; waBtn.classList.toggle('off', off); } };
const tileVids = $$('.tile video').map(v => ({ v, p: planes.find(p => p.el.contains(v)) }));

/* ---------- Boucle unique : scroll → plans → caméra 3D → attaches ---------- */
const mouse = { x: 0, y: 0 };
addEventListener('pointermove', e => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5; }, { passive: true });
let lastY = -1, frameN = 0, lastNav = '', paused = false;

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
    st.opacity = (d < 0 ? clamp(1 + d * 1.8) : clamp(1 - d * 2.2)).toFixed(3);
    st.filter = !lite && Math.abs(d) > 0.02 ? `blur(${(Math.abs(d) * 7).toFixed(1)}px)` : 'none';
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
        el.style.scale = (1 - a * 0.14).toFixed(3);
        el.style.opacity = (1 - a * 0.55).toFixed(3);
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

  // 3) section active : menu, compteurs, barres, rayures
  const cur = planes[Math.round(f)];
  if (cur) {
    if (cur.el.id !== lastNav) { lastNav = cur.el.id; setActiveNav(cur.el.id); }
    setWa(f < 0.5 || cur.el.id === 'cta');
    for (const p of planes) if (!p.seen && Math.abs(p.d) < 0.35) { p.seen = true; p.el.classList.add('seen'); countUp(p.el); }
  }
  if (moved) {
    nav.classList.toggle('hide', y > lastY && y > 400 && !document.documentElement.classList.contains('menu-open'));
    bar.style.transform = `scaleX(${total ? y / total : 0})`;
  }

  // 4) scène 3D, synchronisée sur la même position
  gl?.frame(f, dt, mouse.x, mouse.y, lenis ? lenis.velocity : 0);
  const [cr, cg, cb] = gl ? [gl.color.r * 255 | 0, gl.color.g * 255 | 0, gl.color.b * 255 | 0] : colorAt(f);
  document.documentElement.style.setProperty('--thread', `${cr},${cg},${cb}`);

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
    const op = d < 0 ? clamp(1 + d * 1.8) : clamp(1 - d * 2.2);
    if (op < 0.02) continue;
    const max = lite ? 6 : 99;
    for (const a of p.atts) {
      if (a.e >= max) { if (a.tr) { a.el.style.translate = ''; a.tr = ''; } continue; }
      if (!project(p.i, a.e)) continue;
      const ox = a.inTrack ? (p.trackX || 0) : 0;
      const exs = cx + (a.x + ox - cx) * sc, ecy = cy + (a.cy - p.off - cy) * sc;
      // arrivée / départ : l'élément est tiré vers son point d'attache ; contenu encore sous l'écran : il remonte le long du fil
      const kd0 = d === 0 ? 0 : clamp(Math.abs(d) * (1.6 + Math.min(a.e, 8) * 0.18)), kd = kd0 * kd0;   // les éléments se posent dans l'ordre de lecture
      const ki = d === 0 ? clamp((ecy - vh * 0.9) / (vh * 0.5)) : 0;
      const k = kd >= ki ? kd : ease(ki);
      const apx = cx + (anchor.x - cx) / sc, apy = cy + (anchor.y - cy) / sc + p.off;
      let dx = (apx - a.x - ox) * 0.45, dy = (apy - a.y) * 0.45;   // tirés vers le fil sans s'empiler
      // à l'arrivée : tiré jusqu'au fil ; pendant la lecture : simple glissement limité (pas d'empilement)
      const m = kd >= ki ? k : Math.min(1, 70 / (Math.hypot(dx, dy) || 1)) * k;
      dx *= m; dy *= m;
      const tr = k > 0.002 ? `${dx.toFixed(1)}px ${dy.toFixed(1)}px` : '';
      if (tr !== a.tr) { a.el.style.translate = tr; a.tr = tr; }
      // le fil, de l'attache jusqu'au bas de l'élément
      const ex = cx + (a.x + ox + dx - cx) * sc, ey = cy + (a.y - p.off + dy - cy) * sc;
      if (ey < -100 || ey > vh + 300) continue;
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
}

/* ---------- Démarrage ---------- */
if (!reduce) {
  measure();
  const restore = sessionStorage.getItem('y'); sessionStorage.removeItem('y');
  const h = location.hash.slice(1), target = h && !document.getElementById(h)?.matches('dialog') ? targetOf(h) : null;
  const y0 = restore != null ? +restore : target;
  if (y0 != null) { window.scrollTo(0, y0); lenis?.scrollTo(y0, { immediate: true }); }
  requestAnimationFrame(loop);
  let rt;
  addEventListener('resize', () => {
    // clavier mobile ouvert sur un champ : seule la hauteur change, on ne recalcule pas (sinon la page saute)
    if (innerWidth === vw && document.activeElement?.matches('input, textarea, select')) return;
    clearTimeout(rt); rt = setTimeout(() => { const prog = total ? scrollY / total : 0; measure(); sizeThreads(); gl?.resize(); window.scrollTo(0, prog * total); lastY = -1; }, 150); });
  document.fonts?.ready.then(() => { const prog = total ? scrollY / total : 0; measure(); window.scrollTo(0, prog * total); lastY = -1; });
  addEventListener('load', () => { const prog = total ? scrollY / total : 0; measure(); window.scrollTo(0, prog * total); lastY = -1; });
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
    setWa(i === 0 || en.target.id === 'cta');
    gl?.frame(0, 0, 0, 0, 0, i);
    const c = colorAt(i); document.documentElement.style.setProperty('--thread', c.join(','));
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
    cur.classList.toggle('hover', !l && !!e.target.closest('a, button'));
  });
  // boutons magnétiques
  $$('.btn').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.5, ease: 'power3.out' }); });
    b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,.4)' }));
  });
  // cartes inclinables + reflet qui suit la souris
  $$('.price, .card3d, .tile').forEach(c => {
    const lift = c.classList.contains('tile') ? -10 : 0;
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%');
      gsap.to(c, { rotateY: (x - 0.5) * 10, rotateX: (0.5 - y) * 10, y: lift, transformPerspective: 1000, duration: 0.5, ease: 'power3.out' });
    });
    c.addEventListener('pointerleave', () => gsap.to(c, { rotateX: 0, rotateY: 0, y: 0, duration: 0.9, ease: 'elastic.out(1,.5)' }));
  });
}

/* ---------- Son spatial (Howler chargé seulement à l'activation) ---------- */
const sound = { on: false, amb: null, hover: null, click: null };
const soundBtn = $('#sound');
const loadHowler = () => new Promise((ok, ko) => {
  if (window.Howl) return ok();
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/howler@2.2.4/dist/howler.min.js';
  s.onload = ok; s.onerror = ko;
  document.head.appendChild(s);
});
soundBtn.addEventListener('click', async () => {
  sound.on = !sound.on;
  soundBtn.setAttribute('aria-pressed', sound.on);
  soundBtn.setAttribute('aria-label', sound.on ? t('Couper le son', 'Turn sound off') : t('Activer le son', 'Turn sound on'));
  if (sound.on && !sound.amb) {
    try { await loadHowler(); } catch { return; }
    const { Howl } = window;
    sound.amb = new Howl({ src: ['assets/audio/ambient.mp3'], loop: true, volume: 0 });
    sound.hover = new Howl({ src: ['assets/audio/hover.mp3'], volume: 0.18 });
    sound.click = new Howl({ src: ['assets/audio/click.mp3'], volume: 0.35 });
  }
  if (!sound.amb) return;
  if (sound.on) { if (!sound.amb.playing()) sound.amb.play(); sound.amb.fade(sound.amb.volume(), 0.45, 1200); }
  else sound.amb.fade(sound.amb.volume(), 0, 600);
});
const pan = x => Math.max(-1, Math.min(1, (x / innerWidth - 0.5) * 1.6));
addEventListener('pointermove', e => { if (sound.on && sound.amb) sound.amb.stereo(pan(e.clientX) * 0.5); }, { passive: true });
document.addEventListener('pointerover', e => {
  if (!sound.on || !sound.hover) return;
  const el = e.target.closest('a, button, .tile, .card3d');
  if (!el || el.contains(e.relatedTarget)) return;
  const r = el.getBoundingClientRect();
  sound.hover.stereo(pan(r.left + r.width / 2), sound.hover.play());
});
document.addEventListener('click', e => {
  if (!sound.on || !sound.click || !e.target.closest('a, button')) return;
  sound.click.stereo(pan(e.clientX), sound.click.play());
});
lenis?.on('scroll', ({ velocity }) => { if (sound.on && sound.amb) sound.amb.rate(1 + Math.min(Math.abs(velocity) / 120, 0.06)); });

/* ---------- Scène 3D : chargée après l'affichage, jamais sur les appareils faibles ---------- */
const weak = ((navigator.hardwareConcurrency || 8) <= 4 && mobile()) || navigator.connection?.saveData;
const hasGL = (() => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } })();
const start3D = () => import('./gl.js')
  .then(m => m.start($('#gl'), { lite: mobile(), palette: PALETTE, onHover: on => { $('.cursor')?.classList.toggle('hover', on); if (on && sound.on) sound.hover?.play(); } }))
  .then(api => { gl = api; lastY = -1; if (reduce) gl.frame(0, 0, 0, 0, 0, 0); })
  .catch(err => console.warn('3D désactivée :', err));
if (hasGL && !weak) {
  const go = () => ('requestIdleCallback' in window ? requestIdleCallback(start3D, { timeout: 1200 }) : setTimeout(start3D, 200));
  document.readyState === 'complete' ? go() : addEventListener('load', go, { once: true });
}
