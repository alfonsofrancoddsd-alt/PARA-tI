// Si pones un archivo "musica.mp3" en esta carpeta, suena ese. Si no, suena una melodía suave de cajita musical.
const Musica = (() => {
  const mp3 = new Audio("musica.mp3"); mp3.loop = true; mp3.volume = .85; mp3.preload = "auto";
  let hayMp3 = true, activa = false, sonando = false, ac, master, timer, paso = 0;
  mp3.addEventListener("error", () => { hayMp3 = false; if (activa) sintetica(); });
  const f = m => 440 * Math.pow(2, (m - 69) / 12);
  const acordes = [[60,64,67,72],[57,60,64,69],[53,57,60,65],[55,59,62,67]];
  const patron = [0,1,2,3,2,1,2,3];

  function preparar(){
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain(); master.gain.value = 0;
    const n = ac.sampleRate * 3, b = ac.createBuffer(2, n, ac.sampleRate);
    for (let c = 0; c < 2; c++){ const d = b.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.5); }
    const rev = ac.createConvolver(); rev.buffer = b;
    const seco = ac.createGain(); seco.gain.value = .75;
    const humedo = ac.createGain(); humedo.gain.value = .6;
    master.connect(seco); seco.connect(ac.destination);
    master.connect(rev); rev.connect(humedo); humedo.connect(ac.destination);
  }
  function campana(m, t, v){
    [[1, 1, 2.4], [2, .25, 1.1], [3.01, .08, .6]].forEach(([mul, a, dur]) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = "sine"; o.frequency.value = f(m) * mul;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v * a, t + .01); g.gain.exponentialRampToValueAtTime(.0006, t + dur);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .1);
    });
  }
  function compas(){
    const t = ac.currentTime + .05, a = acordes[paso++ % 4];
    patron.forEach((i, k) => campana(a[i], t + k * .75, .11));
    campana(a[0] - 12, t, .08); campana(a[0] - 12, t + 3, .06);
  }
  function sintetica(){
    if (sonando) return;
    if (!ac) preparar();
    ac.resume(); sonando = true;
    master.gain.cancelScheduledValues(ac.currentTime); master.gain.setTargetAtTime(.9, ac.currentTime, 1);
    compas(); timer = setInterval(compas, 6000);
  }
  function encender(){
    activa = true;
    if (hayMp3) mp3.play().catch(() => { hayMp3 = false; if (activa) sintetica(); });
    else sintetica();
  }
  function apagar(){
    activa = false; mp3.pause();
    if (sonando){ sonando = false; clearInterval(timer); master.gain.setTargetAtTime(0, ac.currentTime, .4); }
  }
  return { encender, apagar, alternar(){ activa ? apagar() : encender(); return activa; }, get activa(){ return activa; } };
})();
