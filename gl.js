/* Scène WebGL : 13 stations tech (une par section) posées le long d'un fil lumineux.
   main.js pilote tout : frame(f) place la caméra à la station f (fractionnaire pendant les transitions).
   Deux ambiances : sombre (encre #040817, halos additifs + bloom néon) et claire (#eceef2, mêmes formes en couleurs pleines). */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const BLUE = 0x3a5cff, BLUE_LOGO = 0x2843cc, BLACK = 0x040817, PAPER = 0xeceef2;
const GAP = 26;                                     // distance entre deux stations
const TY = -1.35;                                   // hauteur du fil
const tx = z => Math.sin(z * 0.045) * 1.3;          // le fil serpente doucement
const FONT = '"Instrument Sans", system-ui, sans-serif';
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export async function start(canvas, { lite, palette, theme = 'dark', onHover }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lite, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, lite ? 1.25 : 1.5));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BLACK);
  scene.fog = new THREE.FogExp2(BLACK, 0.045);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.9;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(lite ? 52 : 40, innerWidth / innerHeight, 0.1, 120);
  const back = lite ? 10 : 8.5;
  scene.add(camera);
  const amb = new THREE.AmbientLight(0x1a2250, 0.7); scene.add(amb);
  // bloom néon : ordinateur et thème sombre uniquement
  let composer = null;
  if (!lite) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth / 2, innerHeight / 2), 0.75, 0.5, 0.6));
    composer.addPass(new OutputPass());
  }
  const key = new THREE.DirectionalLight(0xf2f5ff, 3.2); key.position.set(5, 7, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(BLUE, 5); rim.position.set(-6, -2, -8); scene.add(rim);
  const camLight = new THREE.PointLight(0x9fb2ff, 16, 24, 1.6); camLight.position.set(1.5, 1.5, 0); camera.add(camLight);

  /* ---------- matériaux ---------- */
  const M = {
    blue: new THREE.MeshPhysicalMaterial({ color: BLUE_LOGO, metalness: 0.45, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1, emissive: BLUE, emissiveIntensity: 0.28 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.16 }),
    obsidian: new THREE.MeshPhysicalMaterial({ color: 0x0a0e1c, metalness: 0.4, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.08 }),
    holo: new THREE.MeshBasicMaterial({ color: 0x5a74ff, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    glow: new THREE.MeshBasicMaterial({ color: 0x9fb2ff, toneMapped: false, transparent: true }),
    line: new THREE.LineBasicMaterial({ color: 0x7d93ff, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }),
    dim: new THREE.MeshBasicMaterial({ color: 0x2a3350, transparent: true, opacity: 0.6 }),
    paper: new THREE.MeshStandardMaterial({ color: 0xe9ecf5, roughness: 0.85, side: THREE.DoubleSide }),
  };
  const tint = [M.holo, M.glow, M.line];             // ces matériaux prennent la couleur du fil

  // thème clair : les halos additifs deviennent des couleurs pleines, les sprites passent au bleu du logo
  let light = theme === 'light';
  const paint = obj => obj.traverse(o => {
    if (!o.material) return;
    (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => {
      if (m.userData.add === undefined) m.userData.add = m.blending === THREE.AdditiveBlending;
      if (m.userData.add) { m.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending; m.needsUpdate = true; }
      if (m.isSpriteMaterial) m.color.set(light ? BLUE_LOGO : 0xffffff);
      if (m.uniforms?.uLight) m.uniforms.uLight.value = light ? 1 : 0;
    });
  });

  /* ---------- utilitaires ---------- */
  const loader = new THREE.TextureLoader();
  const imgTex = url => { const t = loader.load(url); t.colorSpace = THREE.SRGBColorSpace; return t; };
  const canvasTex = (w, h, draw) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    tex.redraw = (...a) => { ctx.clearRect(0, 0, w, h); ctx.textAlign = 'left'; draw(ctx, w, h, ...a); tex.needsUpdate = true; };
    tex.redraw();
    return tex;
  };
  const tagTex = (txt, color = '#9fb2ff') => canvasTex(256, 128, (x, w, h) => {
    x.font = `600 60px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.shadowColor = color; x.shadowBlur = 16; x.fillStyle = color; x.fillText(txt, w / 2, h / 2);
  });
  const sprite = (tex, s) => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); m.scale.set(s * 2, s, 1); return m; };
  const edges = geo => new THREE.LineSegments(new THREE.EdgesGeometry(geo), M.line);
  const rr = (x, X, Y, W, H, R) => { x.beginPath(); x.roundRect(X, Y, W, H, R); };
  const screen = (w, h, map, { bezel = 0.06, depth = 0.06 } = {}) => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new RoundedBoxGeometry(w + bezel * 2, h + bezel * 2, depth, 2, Math.min(0.04, depth / 2.2)), M.obsidian));
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map, toneMapped: false }));
    scr.position.z = depth / 2 + 0.003; g.add(scr);
    const glow = edges(new THREE.PlaneGeometry(w + bezel * 2, h + bezel * 2)); glow.position.z = depth / 2 + 0.006; g.add(glow);
    g.userData.screen = scr;
    return g;
  };
  const chip = (s, label, body = M.obsidian) => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new RoundedBoxGeometry(s, 0.14, s, 2, 0.03), body));
    const top = new THREE.Mesh(new THREE.PlaneGeometry(s * 0.8, s * 0.8), new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false, map: canvasTex(256, 256, (x, w, h) => {
      x.strokeStyle = 'rgba(159,178,255,.5)'; x.lineWidth = 3; rr(x, 12, 12, w - 24, h - 24, 18); x.stroke();
      for (let i = 1; i < 6; i++) { x.globalAlpha = 0.18; x.beginPath(); x.moveTo(12, i * h / 6); x.lineTo(w - 12, i * h / 6); x.stroke(); }
      x.globalAlpha = 1; x.font = `700 92px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff'; x.shadowColor = '#5a74ff'; x.shadowBlur = 20; x.fillText(label, w / 2, h / 2);
    }) }));
    top.rotation.x = -Math.PI / 2; top.position.y = 0.071; g.add(top);
    const n = 7, pins = new THREE.InstancedMesh(new THREE.BoxGeometry(0.04, 0.03, 0.14), M.chrome, n * 4), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), one = new THREE.Vector3(1, 1, 1);
    for (let side = 0; side < 4; side++) for (let i = 0; i < n; i++) {
      const p = (i / (n - 1) - 0.5) * s * 0.8, a = side * Math.PI / 2;
      const v = new THREE.Vector3(p, -0.02, s / 2 + 0.06).applyAxisAngle(up, a);
      q.setFromAxisAngle(up, a); m4.compose(v, q, one); pins.setMatrixAt(side * n + i, m4);
    }
    g.add(pins);
    return g;
  };
  const gearGeo = (r, n) => {
    const sh = new THREE.Shape();
    for (let i = 0; i < n * 4; i++) { const a = i / (n * 4) * Math.PI * 2, rad = (i % 4 < 2) ? r : r * 0.8; i ? sh.lineTo(Math.cos(a) * rad, Math.sin(a) * rad) : sh.moveTo(Math.cos(a) * rad, Math.sin(a) * rad); }
    const hole = new THREE.Path(); hole.absarc(0, 0, r * 0.3, 0, Math.PI * 2, true); sh.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 1 }); g.center(); return g;
  };
  const loadImg = src => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
  const float = (o, t, i, a = 0.08) => { o.position.y = (o.userData.y0 ??= o.position.y) + Math.sin(t * 0.8 + i * 1.7) * a; };

  // logo Axe extrudé (partagé accueil + CTA)
  const logoGeo = fetch('assets/img/logo-axe.svg').then(r => r.text()).then(txt => {
    const svg = new SVGLoader().parse(txt);
    const g = new THREE.ExtrudeGeometry(svg.paths.flatMap(p => SVGLoader.createShapes(p)), { depth: 140, bevelEnabled: true, bevelThickness: 24, bevelSize: 12, bevelSegments: lite ? 2 : 4, curveSegments: lite ? 8 : 14 });
    g.center(); return g;
  });
  const makeLogo = async (mat, h = 3) => { const k = h / 2484, m = new THREE.Mesh(await logoGeo, mat); m.scale.set(k, -k, k); const g = new THREE.Group(); g.add(m); return g; };

  const st = { t: 0, mx: 0, my: 0 };
  const stations = [];
  const def = (x, z, build) => stations.push({ x, z, build, group: null, built: false, queued: false, update: null, seen: false });

  /* ===== 0 · Accueil : logo au cœur d'un réseau neuronal + balises de code ===== */
  def(3.0, 0, async g => {
    const logo = await makeLogo(M.blue, 3); logo.userData.hover = true; g.add(logo);
    const N = lite ? 26 : 48, pts = [];
    for (let i = 0; i < N; i++) { const v = new THREE.Vector3().randomDirection().multiplyScalar(1.9 + Math.random() * 1.3); v.y *= 0.8; v.z *= 0.6; pts.push(v); }
    const nodes = new THREE.InstancedMesh(new THREE.SphereGeometry(0.045, 8, 6), M.glow, N), m4 = new THREE.Matrix4();
    pts.forEach((p, i) => { m4.makeTranslation(p.x, p.y, p.z); nodes.setMatrixAt(i, m4); });
    const seg = [];
    pts.forEach((p, i) => pts.map((q, j) => [j, p.distanceTo(q)]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 2).forEach(([j]) => seg.push(p.x, p.y, p.z, pts[j].x, pts[j].y, pts[j].z)));
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
    const brain = new THREE.Group(); brain.add(nodes, new THREE.LineSegments(lg, M.line)); g.add(brain);
    const tags = ['</>', '{ }', '<div>', '=>', 'AI', 'fn()', '01', '<ai/>', '[ ]', '#'].slice(0, lite ? 6 : 10).map((s, i, a) => {
      const sp = sprite(tagTex(s), 0.42), an = i / a.length * Math.PI * 2;
      sp.position.set(Math.cos(an) * 3.5, Math.sin(an * 1.7) * 1.7, Math.sin(an) * 1.4 - 0.5); g.add(sp); return sp;
    });
    return (t, dt) => { logo.rotation.y = Math.sin(t * 0.5) * 0.5; float(logo, t, 0); brain.rotation.y += dt * 0.08; brain.rotation.x = Math.sin(t * 0.3) * 0.15; tags.forEach((s, i) => float(s, t, i, 0.15)); };
  });

  /* ===== 1 · Stats : le graphique HTML suffit, station vide pour ne rien superposer ===== */
  def(0, -4, () => () => {});

  /* ===== 2 · Réalisations : écran, laptop et smartphone qui affichent les projets ===== */
  def(0, -3, g => {
    const mon = screen(2.6, 1.46, imgTex('assets/projects/stella-poster.webp'));
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7), M.chrome); stand.position.set(0, -1.05, -0.06);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.03, 0.4), M.chrome); foot.position.set(0, -1.4, -0.06);
    const monitor = new THREE.Group(); monitor.add(mon, stand, foot); monitor.position.set(0, 0.6, 0);
    const lap = new THREE.Group();
    const lid = screen(1.6, 1.0, imgTex('assets/projects/finitrans-poster.webp')); lid.position.set(0, 0.52, 0); lid.rotation.x = -0.18;
    const base = new THREE.Mesh(new RoundedBoxGeometry(1.75, 0.06, 1.1, 2, 0.02), M.chrome); base.position.set(0, 0, 0.55);
    lap.add(lid, base); lap.position.set(-4.4, -1.0, 0.5); lap.rotation.y = 0.5;
    const phone = screen(0.6, 1.1, imgTex('assets/projects/axso-pub-poster.webp'), { bezel: 0.05, depth: 0.08 }); phone.position.set(4.4, -0.5, 0.5); phone.rotation.y = -0.45;
    [monitor, lap, phone].forEach(o => { o.userData.hover = true; g.add(o); });
    let video = null, vt = null, playing = false;
    if (!lite) { video = document.createElement('video'); Object.assign(video, { muted: true, loop: true, playsInline: true, preload: 'none' }); vt = new THREE.VideoTexture(video); vt.colorSpace = THREE.SRGBColorSpace; }
    return (t, dt, active) => {
      [monitor, lap, phone].forEach((o, i) => float(o, t, i, 0.06));
      if (!video) return;
      if (active && !playing) { playing = true; if (!video.src) video.src = 'assets/projects/stella.mp4'; video.play().then(() => { mon.userData.screen.material.map = vt; mon.userData.screen.material.needsUpdate = true; }).catch(() => {}); }
      else if (!active && playing) { playing = false; video.pause(); }
    };
  });

  /* ===== 3 · Pourquoi l'IA : papiers et engrenages → flux de données → puce ===== */
  def(0, -3, g => {
    const papers = new THREE.Group(); papers.position.set(-4.6, -0.6, 0);
    for (let i = 0; i < 6; i++) { const p = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.92), M.paper); p.position.set(i * 0.08, i * 0.05 - 0.3, -i * 0.12); p.rotation.set(-0.1, 0.4, (i - 3) * 0.12); papers.add(p); }
    const gear = new THREE.Mesh(gearGeo(0.65, 12), M.chrome); gear.position.set(-4.2, 1.4, -0.8);
    const gear2 = new THREE.Mesh(gearGeo(0.42, 9), M.chrome); gear2.position.set(-5.2, 0.6, 0.2);
    const ai = chip(1.3, 'AI', M.blue); ai.position.set(4.6, -0.2, 0); ai.rotation.set(0.9, -0.4, 0);
    [papers, gear, gear2, ai].forEach(o => { o.userData.hover = true; g.add(o); });
    const N = lite ? 70 : 150, pos = new Float32Array(N * 3), ph = Float32Array.from({ length: N }, () => Math.random());
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pmat = new THREE.PointsMaterial({ color: 0x9fb2ff, size: 0.07, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    tint.push(pmat); g.add(new THREE.Points(geo, pmat));
    return (t, dt) => {
      gear.rotation.z += dt * 0.6; gear2.rotation.z -= dt * 0.9; float(ai, t, 1, 0.1); ai.rotation.y += dt * 0.3; float(papers, t, 2, 0.05);
      for (let i = 0; i < N; i++) { ph[i] = (ph[i] + dt * 0.22) % 1; const u = ph[i]; pos[i * 3] = -2.6 + u * 5.2; pos[i * 3 + 1] = Math.sin(u * 9 + i) * 0.5 * (1 - u); pos[i * 3 + 2] = Math.cos(u * 7 + i * 3) * 0.4 * (1 - u); }
      geo.attributes.position.needsUpdate = true;
    };
  });

  /* ===== 4 · Solutions : agent IA, tableau de bord métier, smartphone ===== */
  def(0, -3.5, g => {
    const bot = new THREE.Group(); bot.position.set(-4.6, 0.2, 0); bot.userData.hover = true;
    const head = new THREE.Group();
    head.add(new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.9, 0.85, 4, 0.28), M.chrome));
    const visor = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.42, 0.1, 3, 0.05), M.obsidian); visor.position.set(0, 0.02, 0.42); head.add(visor);
    const eyes = [-0.2, 0.2].map(x => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), M.glow); e.position.set(x, 0.03, 0.49); head.add(e); return e; });
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35), M.chrome); ant.position.y = 0.62; head.add(ant);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), M.glow); tip.position.y = 0.82; head.add(tip);
    [-0.6, 0.6].forEach(x => { const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.12, 20), M.blue); ear.rotation.z = Math.PI / 2; ear.position.x = x; head.add(ear); });
    const body = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.CapsuleGeometry(0.45, 0.5, 2, 10)), M.line); body.position.y = -1.15;
    const bodyFill = new THREE.Mesh(new THREE.CapsuleGeometry(0.44, 0.5, 2, 10), M.holo); bodyFill.position.y = -1.15;
    bot.add(head, body, bodyFill); g.add(bot);

    const dashTex = canvasTex(640, 400, (x, w, h) => {
      x.fillStyle = '#070b1a'; x.fillRect(0, 0, w, h);
      x.fillStyle = '#0d1430'; x.fillRect(0, 0, w, 44); [24, 44, 64].forEach(cx => { x.fillStyle = 'rgba(255,255,255,.25)'; x.beginPath(); x.arc(cx, 22, 6, 0, 7); x.fill(); });
      x.font = `600 18px ${FONT}`; x.fillStyle = '#fff'; x.fillText('CRM · ERP · RH', 96, 28);
      [['Support IA', '80%'], ['Revenus', '×2'], ['Conversion', '+40%']].forEach(([a, b], i) => { rr(x, 24 + i * 200, 64, 180, 80, 12); x.fillStyle = i === 1 ? '#0238d6' : '#111a3a'; x.fill(); x.fillStyle = 'rgba(255,255,255,.6)'; x.font = `500 15px ${FONT}`; x.fillText(a, 40 + i * 200, 92); x.fillStyle = '#fff'; x.font = `700 28px ${FONT}`; x.fillText(b, 40 + i * 200, 128); });
      [40, 65, 50, 80, 75, 90, 100].forEach((v, i) => { const bh = v * 1.8; const gr = x.createLinearGradient(0, 380 - bh, 0, 380); gr.addColorStop(0, '#2843cc'); gr.addColorStop(1, 'rgba(2,56,214,.15)'); x.fillStyle = gr; rr(x, 40 + i * 82, 380 - bh, 50, bh, 6); x.fill(); });
    });
    const dash = screen(2.3, 1.44, dashTex); dash.position.set(0, 0.9, -3); dash.userData.hover = true; g.add(dash);
    const appTex = canvasTex(256, 512, (x, w, h) => {
      const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0d1a5c'); gr.addColorStop(1, '#05070f'); x.fillStyle = gr; x.fillRect(0, 0, w, h);
      x.fillStyle = '#fff'; x.font = `700 30px ${FONT}`; x.fillText('Axe', 24, 70);
      for (let i = 0; i < 5; i++) { rr(x, 20, 100 + i * 64, w - 40, 50, 12); x.fillStyle = i === 0 ? '#0238d6' : 'rgba(255,255,255,.08)'; x.fill(); x.fillStyle = 'rgba(255,255,255,.7)'; x.fillRect(36, 118 + i * 64, 90 - i * 8, 8); x.fillRect(36, 132 + i * 64, 50, 6); }
      rr(x, 20, h - 74, w - 40, 54, 27); x.fillStyle = '#fff'; x.fill(); x.fillStyle = '#0238d6'; x.font = `700 20px ${FONT}`; x.textAlign = 'center'; x.fillText('OFFLINE ✓', w / 2, h - 40);
    });
    const phone = screen(0.62, 1.24, appTex, { bezel: 0.05, depth: 0.09 }); phone.position.set(4.6, 0, 0); phone.rotation.y = -0.35; phone.userData.hover = true; g.add(phone);
    return (t) => {
      head.rotation.y += (st.mx * 1.2 - head.rotation.y) * 0.08; head.rotation.x += (st.my * 0.6 - head.rotation.x) * 0.08;
      const blink = (t % 4) < 0.12 ? 0.1 : 1; eyes.forEach(e => { e.scale.y = blink; });
      float(bot, t, 0, 0.1); float(dash, t, 1, 0.05); float(phone, t, 2, 0.08);
    };
  });

  /* ===== 5 · Axe Stack : modules empilés Axe Health / Axso ===== */
  def(3.2, -1, g => {
    const stack = new THREE.Group(); stack.rotation.y = -0.5; stack.userData.hover = true; g.add(stack);
    const plate = src => {
      const tex = canvasTex(512, 160, (x, w, h, img) => { x.fillStyle = '#fff'; rr(x, 0, 0, w, h, 24); x.fill(); if (img) { const s = Math.min((w - 60) / img.width, (h - 40) / img.height); x.drawImage(img, (w - img.width * s) / 2, (h - img.height * s) / 2, img.width * s, img.height * s); } });
      loadImg(src).then(i => i && tex.redraw(i)); return tex;
    };
    const slabs = [0, 1, 2, 3].map(i => {
      const s = new THREE.Group(); s.position.y = i * 0.48 - 0.75;
      s.add(new THREE.Mesh(new RoundedBoxGeometry(2.2, 0.36, 1.3, 2, 0.05), M.obsidian));
      const led = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.03), M.glow); led.position.set(0.55, 0, 0.652); s.add(led);
      if (i === 1 || i === 2) { const p = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.25), new THREE.MeshBasicMaterial({ map: plate(i === 1 ? 'assets/img/axe-health.webp' : 'assets/img/axso.webp'), transparent: true, toneMapped: false })); p.position.set(-0.5, 0, 0.652); s.add(p); }
      stack.add(s); return s;
    });
    return t => slabs.forEach((s, i) => { s.position.y = i * 0.48 - 0.75 + Math.sin(t * 1.2 + i) * 0.035 * (i + 1); s.position.x = Math.sin(t * 0.7 + i) * 0.04; });
  });

  /* ===== 6 · Formules : 3 puces de puissance croissante ===== */
  def(0, -4, g => {
    const chips = [[0.95, '01', M.obsidian], [1.35, '02', M.blue], [1.1, '03', M.obsidian]].map(([s, l, m], i) => {
      const c = chip(s, l, m); c.position.set(...[[-5.6, 0.2, -2], [5.6, 1.3, -2], [5.3, -1.4, -1.5]][i]); c.rotation.x = 0.9; c.userData.hover = true; g.add(c); return c;
    });
    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.02, 8, 96), M.glow); halo.position.set(5.6, 1.15, -2.1); halo.rotation.x = 0.9 + Math.PI / 2; g.add(halo);
    return t => { chips.forEach((c, i) => { float(c, t, i, 0.12); c.rotation.z = Math.sin(t * 0.5 + i) * 0.15; }); halo.scale.setScalar(1 + Math.sin(t * 2) * 0.04); };
  });

  /* ===== 7 · Pourquoi nous : 3 circuits, un seul s'allume ===== */
  const pulseMat = (base = 0.35, freq = 60) => new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(0x9fb2ff) }, uTime: { value: 0 }, uAmp: { value: 0 }, uFreq: { value: freq }, uBase: { value: base }, uLight: { value: 0 } },
    vertexShader: `uniform float uTime, uAmp; varying float vU; varying float vD;
      void main(){ vU = uv.x; vec3 p = position; p.y += sin(uv.x*140. + uTime*1.6)*uAmp; p.x += cos(uv.x*90. + uTime)*uAmp*.6;
      vec4 mv = modelViewMatrix*vec4(p,1.); vD = -mv.z; gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uTime, uFreq, uBase, uLight; varying float vU; varying float vD;
      void main(){ float k = smoothstep(.9, 1., fract(vU*uFreq - uTime*.7));
      vec3 c = mix(uColor*(1. + k*2.), uColor*(.55 + k*.35), uLight);
      gl_FragColor = vec4(c, (uBase*(1. + uLight) + k*1.1)*exp(-vD*.04)); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const pulses = [];
  def(0, -2, g => {
    const make = (x0, good) => {
      const dx = good ? 0.8 : -0.8;
      const pts = [[x0, 0, 3], [x0, 0, 0], [x0 + dx, 0, -1.5], [x0 + dx, 0, -5], [x0, 0, -6.5], [x0, 0, -10]].map(p => new THREE.Vector3(...p));
      const path = new THREE.CurvePath(); for (let i = 0; i < pts.length - 1; i++) path.add(new THREE.LineCurve3(pts[i], pts[i + 1]));
      const mat = good ? pulseMat(0.4, 14) : M.dim;
      if (good) pulses.push(mat);
      const tube = new THREE.Mesh(new THREE.TubeGeometry(path, 160, good ? 0.035 : 0.025, 6), mat);
      const end = new THREE.Mesh(new RoundedBoxGeometry(0.4, 0.12, 0.4, 2, 0.03), good ? M.blue : M.obsidian); end.position.copy(pts[1]);
      const mark = sprite(tagTex(good ? '✓' : '✕', good ? '#ffffff' : '#ff6b6b'), 0.35); mark.position.copy(pts[1]).add(new THREE.Vector3(0, 0.45, 0));
      const c = new THREE.Group(); c.add(tube, end, mark); c.position.y = -1.6; c.userData.hover = true; g.add(c);
      return { c, good, mark };
    };
    const lines = [make(-3, false), make(0, false), make(3, true)];
    return t => lines.forEach(({ c, good, mark }, i) => { if (!good) mark.material.opacity = Math.sin(t * 1.3 + i) > 0.6 ? 0.3 + Math.random() * 0.5 : 0.8; float(c, t, i, 0.04); });
  });

  /* ===== 8 · Résultats : le tableau de bord HTML suffit, station vide pour ne rien superposer ===== */
  def(0, -4, () => () => {});

  /* ===== 9 · Équipe : écrans vidéo en arc + photos en orbite ===== */
  const team = { screens: [], posters: [], vts: new Map(), idx: -1 };
  def(0, -3, g => {
    const R = 5.4;
    [1, 2, 3, 4, 5].forEach((n, i) => {
      const tex = imgTex(`assets/video/v${n}.webp`), s = screen(1.7, 0.956, tex), a = (i - 2) * 0.42;
      s.position.set(Math.sin(a) * R, i % 2 ? 0.35 : -0.15, -Math.cos(a) * R + R - 1.5); s.rotation.y = -a; s.userData.hover = true;
      team.screens.push(s); team.posters.push(tex); g.add(s);
    });
    const big = new THREE.Vector3(1.12, 1.12, 1.12), one = new THREE.Vector3(1, 1, 1);
    return (t) => { team.screens.forEach((s, i) => { float(s, t, i, 0.05); s.scale.lerp(i === team.idx ? big : one, 0.1); }); };
  });

  /* ===== 10 · Témoignages : bulles de chat holographiques ===== */
  def(0, -4, g => {
    const people = [['Richkard Kamena', 'Lyxera', 't1'], ['Junior Tenevock', 'Zaninii', 't2'], ['Eleanor Pena', 'Mapa Sarl', 't3'], ['Jalil Ketou', 'Skynesys', 't4'], ['Marcel Kop', 'Symphoni Social', 't5'], ['Merveille Noumo', 'La grande Royale', 't6']];
    const bubbles = people.map(([name, co, img], i) => {
      const tex = canvasTex(512, 200, (x, w, h, pic) => {
        rr(x, 4, 4, w - 8, h - 40, 26); x.fillStyle = 'rgba(10,14,30,.9)'; x.fill(); x.strokeStyle = 'rgba(90,116,255,.8)'; x.lineWidth = 3; x.stroke();
        x.beginPath(); x.moveTo(60, h - 37); x.lineTo(50, h - 6); x.lineTo(96, h - 37); x.fillStyle = 'rgba(10,14,30,.9)'; x.fill();
        x.save(); x.beginPath(); x.arc(70, 82, 44, 0, 7); x.clip(); if (pic) x.drawImage(pic, 26, 38, 88, 88); else { x.fillStyle = '#2843cc'; x.fill(); } x.restore();
        x.fillStyle = '#fff'; x.font = `700 30px ${FONT}`; x.fillText(name, 134, 70);
        x.fillStyle = '#9fb2ff'; x.font = `500 22px ${FONT}`; x.fillText(co, 134, 102);
        x.fillStyle = '#fff'; x.font = `400 24px ${FONT}`; x.fillText('★★★★★', 134, 136);
      });
      loadImg(`assets/img/${img}.webp`).then(p => p && tex.redraw(p));
      const b = new THREE.Mesh(new THREE.PlaneGeometry(2.05, 0.8), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }));
      b.position.set(((i % 3) - 1) * 4.8, i < 3 ? 1.4 : -1.4, -2 - (i % 2) * 0.8); b.userData.hover = true; g.add(b); return b;
    });
    return t => bubbles.forEach((b, i) => { float(b, t, i, 0.1); b.rotation.y = Math.sin(t * 0.4 + i) * 0.15; });
  });

  /* ===== 11 · CTA : le logo revient devant un portail lumineux ===== */
  def(3.0, 0, async g => {
    const disc = new THREE.Mesh(new THREE.CircleGeometry(2.25, 64), new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uColor: { value: M.glow.color } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform float uTime; uniform vec3 uColor; varying vec2 vUv;
        void main(){ vec2 p = vUv*2.-1.; float r = length(p), a = atan(p.y,p.x);
        float s = .5 + .5*sin(a*6. + r*18. - uTime*3.);
        gl_FragColor = vec4(uColor*(.6+s), smoothstep(1., .15, r)*(.18 + .3*s)); }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.05, 12, 128), M.glow);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.45, 0.025, 8, 128), M.blue);
    const portal = new THREE.Group(); portal.add(disc, ring, ring2); portal.position.z = -0.9; g.add(portal);
    const logo = await makeLogo(M.chrome, 2.6); logo.userData.hover = true; g.add(logo);
    const N = lite ? 120 : 260, pos = new Float32Array(N * 3), seed = Float32Array.from({ length: N }, () => Math.random());
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pm = new THREE.PointsMaterial({ color: 0x9fb2ff, size: 0.05, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }); tint.push(pm);
    const pts = new THREE.Points(geo, pm); pts.position.z = -0.9; g.add(pts);
    return (t, dt) => {
      disc.material.uniforms.uTime.value = t; ring2.rotation.z -= dt * 0.2; logo.rotation.y = Math.sin(t * 0.6) * 0.6; float(logo, t, 0);
      for (let i = 0; i < N; i++) { seed[i] = (seed[i] + dt * 0.12) % 1; const r = 2.6 * (1 - seed[i]), a = i * 2.4 + seed[i] * 8; pos[i * 3] = Math.cos(a) * r; pos[i * 3 + 1] = Math.sin(a) * r; pos[i * 3 + 2] = -seed[i] * 1.5; }
      geo.attributes.position.needsUpdate = true;
    };
  });

  /* ===== 12 · Footer : terminal où les coordonnées se tapent ===== */
  def(0, -3, g => {
    const full = ['$ axe --contact', '> contact@axedigital.agency', '> (+237) 671715511', '> Ange Raphael, fin barrière ESSEC', '> status: online ✓'].join('\n');
    let n = 0, acc = 0, blink = 0;
    const tex = canvasTex(800, 500, (x, w) => {
      x.fillStyle = '#060914'; x.fillRect(0, 0, w, 500);
      x.fillStyle = '#0d1430'; x.fillRect(0, 0, w, 50); ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { x.fillStyle = c; x.beginPath(); x.arc(30 + i * 26, 25, 8, 0, 7); x.fill(); });
      x.fillStyle = 'rgba(255,255,255,.5)'; x.font = `500 18px ${FONT}`; x.fillText('axe-digital — terminal', 120, 31);
      x.font = '500 28px ui-monospace, Menlo, monospace';
      const shown = full.slice(0, n).split('\n');
      shown.forEach((l, i) => { x.fillStyle = l.startsWith('$') ? '#9fb2ff' : '#ffffff'; x.fillText(l, 36, 110 + i * 64); });
      if (blink % 2) { x.fillStyle = '#5a74ff'; x.fillRect(36 + x.measureText(shown.at(-1)).width + 6, 86 + (shown.length - 1) * 64, 16, 30); }
    });
    const term = screen(2.8, 1.75, tex); term.position.y = 0.6; term.userData.hover = true; g.add(term);
    return (t, dt, active) => {
      float(term, t, 0, 0.06);
      if (!active) return;
      acc += dt;
      if (acc > 0.05) { acc = 0; const b = (t * 2) | 0; if (n < full.length || b !== blink) { n = Math.min(full.length, n + 1); blink = b; tex.redraw(); } }
    };
  });

  /* ---------- le fil : un câble de données lumineux sur tout le trajet ---------- */
  const COUNT = stations.length, zEnd = -GAP * (COUNT - 1) - 14;
  const fpts = []; for (let z = 14; z >= zEnd; z -= 2) fpts.push(new THREE.Vector3(tx(z), TY, z));
  const fcurve = new THREE.CatmullRomCurve3(fpts);
  const threadMat = pulseMat(0.45, 70), haloMat = pulseMat(0.07, 70);
  pulses.push(threadMat, haloMat);
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(fcurve, fpts.length * 8, 0.018, 6), threadMat));
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(fcurve, fpts.length * 4, 0.075, 8), haloMat));

  // poussière lumineuse
  const DN = lite ? 700 : 1600, dp = new Float32Array(DN * 3);
  for (let i = 0; i < DN; i++) { dp[i * 3] = (Math.random() - 0.5) * 30; dp[i * 3 + 1] = (Math.random() - 0.5) * 18; dp[i * 3 + 2] = 14 - Math.random() * (14 - zEnd); }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  const dustMat = new THREE.PointsMaterial({ color: 0x9fb2ff, size: 0.04, transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending });
  tint.push(dustMat);
  const dust = new THREE.Points(dg, dustMat); scene.add(dust);

  /* ---------- construction progressive des stations (à l'approche) ---------- */
  const build = async i => {
    const s = stations[i]; if (s.queued) return; s.queued = true;
    s.group = new THREE.Group(); s.group.visible = false;
    s.group.position.set(lite ? 0 : s.x, 0, -GAP * i + s.z + (lite ? -2 : i === 0 || i === 11 ? 0 : -1.5));
    if (lite) s.group.scale.setScalar(0.72);
    scene.add(s.group);
    s.update = await s.build(s.group);
    paint(s.group);
    s.built = true;
  };
  const idle = fn => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 600 }) : setTimeout(fn, 60));
  await Promise.all([build(0), build(1)]);

  /* ---------- survol ---------- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(9, 9);
  let hovered = null, moved = false;
  addEventListener('pointermove', e => { ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); moved = true; }, { passive: true });
  const hoverRoot = o => { while (o && !o.userData.hover) o = o.parent; return o; };

  /* ---------- API pour main.js ---------- */
  const cols = palette.map(c => new THREE.Color(c));
  const color = new THREE.Color(), tmp = new THREE.Vector3(), base = new THREE.Color(0x7d93ff), blue = new THREE.Color(BLUE);
  let px = 0, py = 0;
  const api = {
    color,
    frame(f, dt, mx, my, vel = 0, colorF = f) {
      st.t += dt; st.mx = mx; st.my = my;
      const t = st.t;
      px += (mx - px) * 0.05; py += (my - py) * 0.05;
      const z = -f * GAP;
      camera.position.set(tx(z) * 0.5 + px * 0.9, 0.25 - py * 0.5, z + back);
      camera.lookAt(tx(z) * 0.5 + px * 0.3, -0.1 - py * 0.2, z);

      // teinte de l'ambiance, interpolée entre les sections
      const c0 = Math.floor(clamp(colorF, 0, COUNT - 1)), c1 = Math.min(COUNT - 1, c0 + 1);
      color.lerpColors(cols[c0], cols[c1], clamp(colorF - c0));
      const speed = 1 + Math.min(Math.abs(vel) / 30, 3);
      pulses.forEach(m => { m.uniforms.uColor.value.copy(color); m.uniforms.uTime.value += dt * speed; m.uniforms.uAmp.value = Math.min(Math.abs(vel) * 0.0015, 0.12) + 0.008; });
      tint.forEach(m => m.color.copy(base).lerp(color, 0.75));
      camLight.color.copy(color);
      rim.color.copy(color).lerp(blue, 0.5);
      dust.rotation.z = t * 0.01;

      for (let i = 0; i < COUNT; i++) {
        const s = stations[i], rel = i - f, vis = rel > -0.45 && rel < 1.7;
        if (!s.queued && rel < 3 && rel > -1) idle(() => build(i));
        if (!s.built) continue;
        s.group.visible = vis;
        if (!vis) continue;
        const active = Math.abs(rel) < 0.5;
        if (active) s.seen = true;
        s.update?.(t, dt, active, s.seen);
      }

      if (moved) {
        moved = false;
        ray.setFromCamera(ndc, camera);
        const hit = ray.intersectObjects(stations.filter(s => s.built && s.group.visible).map(s => s.group), true)[0];
        const h = hit ? hoverRoot(hit.object) : null;
        if (h !== hovered) { hovered = h; onHover?.(!!h); }
      }
      scene.traverseVisible(o => {
        if (!o.userData.hover) return;
        o.userData.s0 ??= o.scale.clone();
        const k = o.userData.k = THREE.MathUtils.lerp(o.userData.k ?? 1, o === hovered ? 1.08 : 1, 0.12);
        if (Math.abs(k - 1) > 0.001 || o === hovered) o.scale.copy(o.userData.s0).multiplyScalar(k);
      });

      if (composer && !light) composer.render(); else renderer.render(scene, camera);
    },
    // point d'attache n°e de la section i sur le fil, projeté à l'écran
    project(i, e, out) {
      const z = -GAP * i + 3 - Math.min(e, 14) * 0.75;
      tmp.set(tx(z), TY, z).applyMatrix4(camera.matrixWorldInverse);
      if (tmp.z > -0.4) return false;
      tmp.applyMatrix4(camera.projectionMatrix);
      out.x = (tmp.x + 1) / 2 * innerWidth; out.y = (1 - tmp.y) / 2 * innerHeight;
      return true;
    },
    // la vidéo d'équipe en cours passe sur l'écran 3D correspondant
    setTeam(idx, video) {
      if (idx === team.idx || !team.screens.length) return;
      team.idx = idx;
      team.screens.forEach((s, i) => {
        let map = team.posters[i];
        if (i === idx && video && !lite) {
          if (!team.vts.has(video)) { const vt = new THREE.VideoTexture(video); vt.colorSpace = THREE.SRGBColorSpace; team.vts.set(video, vt); }
          map = team.vts.get(video);
        }
        s.userData.screen.material.map = map; s.userData.screen.material.needsUpdate = true;
      });
    },
    resize() { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight, false); composer?.setSize(innerWidth, innerHeight); },
    setTheme(name) {
      light = name === 'light';
      scene.background.set(light ? PAPER : BLACK);
      scene.fog.color.set(light ? PAPER : BLACK); scene.fog.density = light ? 0.026 : 0.045;
      amb.color.set(light ? 0xffffff : 0x1a2250); amb.intensity = light ? 1.5 : 0.7;
      base.set(light ? BLUE_LOGO : 0x7d93ff);
      paint(scene);
    },
  };
  api.setTheme(theme);
  canvas.classList.add('on');
  return api;
}
