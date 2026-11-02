// Jardín dibujado desde cero: primero crece el tallo, luego las hojas y al final se abre la flor.
const Jardin = (() => {
  const cv = document.getElementById("jardin"), ctx = cv.getContext("2d");
  const TAU = Math.PI * 2, clamp = (v, a, b) => Math.min(b, Math.max(a, v)), fac = v => 1 - Math.pow(1 - v, 3);
  const calma = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TIPOS = {
    margarita: { R: 30, p: ["#ffffff", "#ffd9e8"], c: ["#ffe27a", "#ffa726"] },
    cosmos:    { R: 34, p: ["#ff7fae", "#ffd6e6"], c: ["#ffd54f", "#ff9800"] },
    girasol:   { R: 40, p: ["#ffd93b", "#ffab00"], c: ["#8a5430", "#3e2412"] },
    tulipan:   { R: 26, p: ["#ff4f83", "#ffb8d0"], c: ["#ffd54f", "#ff9800"] }
  };
  const nombres = Object.keys(TIPOS);
  let W, H, esc = 1, t = 0, ult = 0, activo = false, flores = [], parts = [];
  const nubes = [{ x: .15, y: .14, s: 1, v: .006 }, { x: .55, y: .22, s: .8, v: .004 }, { x: .85, y: .1, s: 1.2, v: .005 }];
  const hierba = Array.from({ length: 160 }, () => ({ x: Math.random(), h: 10 + Math.random() * 22, f: Math.random() * 6 }));
  const suelo = (x, fase = 0) => H * .84 - Math.sin(x / W * Math.PI * 1.3 + .5 + fase) * H * .035;

  function medir(){
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    esc = clamp(Math.min(W, H) / 650, .6, 1.4);
  }
  function plantar(fx, tipo, retraso){
    flores.push({ fx, tipo, t0: t + retraso, hf: .32 + Math.random() * .14, cur: (Math.random() - .5) * .16, fase: Math.random() * 6, lado: Math.random() < .5 ? 1 : -1, flor: false });
  }
  function reiniciar(){
    flores = []; parts = []; t = 0;
    const tipos = ["margarita", "cosmos", "girasol", "tulipan", "cosmos"];
    [.14, .32, .5, .68, .86].forEach((x, i) => plantar(x, tipos[i], i * 1.8));
  }

  function hoja(x, y, ang, L){
    if (L < 1) return;
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    const g = ctx.createLinearGradient(0, 0, L, 0); g.addColorStop(0, "#3fa65a"); g.addColorStop(1, "#8ee09f");
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(L * .5, -L * .34, L, 0); ctx.quadraticCurveTo(L * .5, L * .34, 0, 0); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L * .08, 0); ctx.lineTo(L * .85, 0); ctx.stroke();
    ctx.restore();
  }
  function disco(r, c){
    if (r < 1) return;
    const g = ctx.createRadialGradient(0, -r * .2, r * .1, 0, 0, r); g.addColorStop(0, c[0]); g.addColorStop(1, c[1]);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  }
  function corazon(x, y, s){
    ctx.beginPath(); ctx.moveTo(x, y + s * .35);
    ctx.bezierCurveTo(x - s * .9, y - s * .3, x - s * .5, y - s, x, y - s * .45);
    ctx.bezierCurveTo(x + s * .5, y - s, x + s * .9, y - s * .3, x, y + s * .35); ctx.fill();
  }

  function cabeza(f, ph, R){
    const P = TIPOS[f.tipo], petal = (i, n) => fac(clamp(ph * 1.7 - i / n * .7, 0, 1)), centro = fac(clamp(ph * 2 - .8, 0, 1));
    if (f.tipo === "margarita"){
      for (let i = 0; i < 14; i++){
        const e = petal(i, 14); if (e <= 0) continue;
        ctx.save(); ctx.rotate(i / 14 * TAU);
        const d = R * (.3 + .35 * e), rx = R * .36 * e, g = ctx.createLinearGradient(d - rx, 0, d + rx, 0);
        g.addColorStop(0, P.p[1]); g.addColorStop(1, P.p[0]);
        ctx.fillStyle = g; ctx.strokeStyle = "rgba(255,150,185,.55)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(d, 0, rx, R * .13, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
      }
      disco(R * .26 * centro, P.c);
    } else if (f.tipo === "cosmos"){
      for (let capa = 0; capa < 2; capa++) for (let i = 0; i < 8; i++){
        const e = petal(i, 8) * (capa ? .8 : 1); if (e <= 0) continue;
        ctx.save(); ctx.rotate(i / 8 * TAU + capa * TAU / 16);
        const d = R * .42 * e, rx = R * .44 * e, g = ctx.createLinearGradient(0, 0, d + rx, 0);
        g.addColorStop(0, P.p[0]); g.addColorStop(1, capa ? "#ffeaf2" : P.p[1]);
        ctx.fillStyle = g; ctx.strokeStyle = "rgba(210,70,120,.35)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(d, 0, rx, R * .3 * e, 0, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.beginPath(); ctx.moveTo(R * .12, 0); ctx.lineTo(d + rx * .5, 0); ctx.stroke(); ctx.restore();
      }
      disco(R * .2 * centro, P.c);
    } else if (f.tipo === "girasol"){
      [18, 14].forEach((n, capa) => { for (let i = 0; i < n; i++){
        const e = petal(i, n); if (e <= 0) continue;
        ctx.save(); ctx.rotate(i / n * TAU + capa * .17); ctx.translate(R * .3, 0); ctx.scale(e, e);
        const L = R * .98, w = R * .2, g = ctx.createLinearGradient(0, 0, L, 0); g.addColorStop(0, P.p[1]); g.addColorStop(1, P.p[0]);
        ctx.fillStyle = g; ctx.strokeStyle = "rgba(190,110,0,.4)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(L * .5, -w, L, 0); ctx.quadraticCurveTo(L * .5, w, 0, 0); ctx.fill(); ctx.stroke(); ctx.restore();
      } });
      const rc = R * .46 * centro; disco(rc, P.c);
      ctx.fillStyle = "rgba(255,205,130,.4)";
      for (let k = 0; k < 70 * centro; k++){ const a = k * 2.39996, rr = Math.sqrt(k / 70) * rc * .92; ctx.beginPath(); ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr, rc * .05, 0, TAU); ctx.fill(); }
    } else {
      const e = fac(clamp(ph * 1.3, 0, 1)), L = R * 1.5 * (.55 + .45 * e), w = R * .5 * (.7 + .3 * e), ab = .5 * e;
      [[-ab, 0], [ab, 0], [0, 1]].forEach(([a, frente]) => {
        ctx.save(); ctx.rotate(a);
        const g = ctx.createLinearGradient(0, 0, 0, -L); g.addColorStop(0, P.p[0]); g.addColorStop(1, frente ? P.p[1] : P.p[0]);
        ctx.fillStyle = g; ctx.strokeStyle = "rgba(160,20,70,.35)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-w, -L * .25, -w * .9, -L * .85, 0, -L); ctx.bezierCurveTo(w * .9, -L * .85, w, -L * .25, 0, 0); ctx.fill(); ctx.stroke(); ctx.restore();
      });
    }
  }

  function dibujarFlor(f){
    const a = t - f.t0; if (a < 0) return;
    const p = fac(clamp(a / 2.4, 0, 1)), ph = clamp((a - 2.3) / 2.3, 0, 1), P = TIPOS[f.tipo], R = P.R * esc;
    const x0 = f.fx * W, y0 = suelo(x0) + 3, hh = H * f.hf, sw = calma ? 0 : Math.sin(t * 1.1 + f.fase) * H * .012 * p;
    const x2 = x0 + f.cur * H + sw, y2 = y0 - hh, x1 = x0 - f.cur * H * .5 + sw * .4, y1 = y0 - hh * .55;
    const B = s => { const u = 1 - s; return [u * u * x0 + 2 * u * s * x1 + s * s * x2, u * u * y0 + 2 * u * s * y1 + s * s * y2]; };
    const ang = s => Math.atan2(2 * (1 - s) * (y1 - y0) + 2 * s * (y2 - y1), 2 * (1 - s) * (x1 - x0) + 2 * s * (x2 - x1));

    [[.28, f.lado], [.5, -f.lado]].forEach(([s, lado]) => {
      const g = clamp((p - s) / .35, 0, 1); if (g <= 0) return;
      const q = B(s); hoja(q[0], q[1], ang(s) + lado * .9, R * 1.35 * fac(g));
    });
    ctx.strokeStyle = "#4fb86c"; ctx.lineWidth = Math.max(3, R * .14); ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); for (let k = 0; k <= 28; k++){ const q = B(p * k / 28); k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke();

    if (p < .85) return;
    const top = B(p);
    ctx.save(); ctx.translate(top[0], top[1]); if (!calma) ctx.rotate(Math.sin(t * 1.1 + f.fase) * .05);
    if (f.tipo !== "tulipan"){ ctx.fillStyle = "#58b86e"; ctx.beginPath(); ctx.arc(0, 0, R * .2 * clamp((p - .85) * 7, 0, 1), 0, TAU); ctx.fill(); }
    cabeza(f, ph, R); ctx.restore();
    if (ph >= 1 && !f.flor){
      f.flor = true;
      for (let i = 0; i < 7; i++) parts.push({ x: top[0], y: top[1], vx: (Math.random() - .5) * 60, vy: -30 - Math.random() * 40, vida: 1.6 + Math.random(), s: 5 + Math.random() * 5 });
    }
  }

  function colina(off, c1, c2, fase){
    const g = ctx.createLinearGradient(0, H * .7, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2);
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, H);
    for (let x = 0; x <= W + 12; x += 12) ctx.lineTo(x, suelo(x, fase) - off);
    ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
  }
  function mariposa(off){
    const x = W * (.1 + .8 * ((t * .03 + off) % 1)) + Math.sin(t * 2 + off * 9) * 20, y = H * .42 + Math.sin(t * .9 + off * 6) * H * .08;
    const ala = .35 + .65 * Math.abs(Math.sin(t * 10 + off * 5));
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = off > .5 ? "#c9a6ff" : "#ff9fc0"; ctx.strokeStyle = "rgba(107,45,74,.6)"; ctx.lineWidth = 1;
    [-1, 1].forEach(l => { ctx.save(); ctx.scale(l * ala, 1); ctx.beginPath(); ctx.ellipse(8, -5, 9, 6, -.5, 0, TAU); ctx.ellipse(7, 5, 7, 5, .5, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore(); });
    ctx.strokeStyle = "#6b2d4a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(0, 8); ctx.stroke(); ctx.restore();
  }

  function frame(ts){
    if (!activo) return;
    const dt = Math.min(.05, (ts - ult) / 1000 || 0); ult = ts; t += dt;
    let g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#ffc2dc"); g.addColorStop(.6, "#fff0f6"); g.addColorStop(1, "#e8f8ee");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    nubes.forEach(n => {
      if (!calma) n.x = (n.x + n.v * dt) % 1.3;
      const cx = (n.x - .15) * W, cy = n.y * H, s = n.s * esc * 26;
      ctx.fillStyle = "rgba(255,255,255,.92)"; ctx.beginPath();
      [[0, 0, 1], [1.1, -.3, 1.2], [2.3, 0, 1], [1.2, .35, 1.3]].forEach(([dx, dy, r]) => { ctx.moveTo(cx + dx * s + r * s, cy + dy * s); ctx.arc(cx + dx * s, cy + dy * s, r * s, 0, TAU); });
      ctx.fill();
    });
    colina(H * .06, "#c7f0cf", "#9fdcae", 1.5); colina(0, "#9be3ac", "#5fc77f", 0);
    flores.forEach(dibujarFlor);
    ctx.strokeStyle = "#4fb86c"; ctx.lineWidth = 2; ctx.lineCap = "round";
    hierba.forEach(h => { const x = h.x * W, y = suelo(x) + 6, sw = calma ? 0 : Math.sin(t * 1.6 + h.f) * 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sw * .5, y - h.h * .6, x + sw, y - h.h * esc); ctx.stroke(); });
    if (!calma){ mariposa(.1); mariposa(.6); }
    ctx.fillStyle = "#ff6f9f";
    parts = parts.filter(q => (q.vida -= dt) > 0);
    parts.forEach(q => { q.x += q.vx * dt; q.y += q.vy * dt; ctx.globalAlpha = clamp(q.vida, 0, 1); corazon(q.x, q.y, q.s); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  cv.addEventListener("pointerdown", e => {
    if (flores.length >= 18) return;
    const r = cv.getBoundingClientRect();
    plantar(clamp((e.clientX - r.left) / W, .04, .96), nombres[Math.floor(Math.random() * nombres.length)], .05);
  });
  addEventListener("resize", () => { if (activo) medir(); });

  return {
    mostrar(){ activo = true; medir(); reiniciar(); ult = performance.now(); requestAnimationFrame(frame); },
    ocultar(){ activo = false; },
    reiniciar
  };
})();
