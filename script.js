// Cambia aquí cómo le dices de cariño:
const APODO = "flaquita";

const MENSAJES = [
  "Te quiero mucho, {n}. Eres de las mejores cosas que me han pasado. 💗",
  "Cada vez que sonríes, mi día se pone más bonito.",
  "Pienso en ti más de lo que te imaginas.",
  "Tu risa es mi canción favorita. 🎶",
  "Contigo hasta los días grises se vuelven de color rosa.",
  "Eres mi persona favorita en todo el universo. ✨",
  "Si pudiera, te regalaría un jardín entero de flores, {n}. 🌷",
  "Me haces muy feliz, y quiero que nunca se te olvide.",
  "Qué suerte tengo de tenerte en mi vida.",
  "Eres dulce, linda y especial. Nunca dejes de brillar. 🌟",
  "Un abrazo grande y apretado para ti, {n}. Aunque sea desde aquí. 🤗",
  "Contigo todo es más bonito y todo tiene más sentido.",
  "Te quiero hoy, mañana y todos los días que vengan. 💕",
  "Eres como un lazo rosado: haces especial todo lo que tocas. 🎀",
  "Mi corazón sonríe cada vez que apareces.",
  "Mereces todo lo bonito del mundo, {n}.",
  "No hay nadie como tú, y eso me encanta.",
  "Gracias por ser tú, tan tierna y tan única. 🌸",
  "Tu cariño es mi lugar favorito.",
  "Si hoy estás cansada, descansa tranquila: yo te quiero igual. 💗",
  "Eres la razón por la que mi sonrisa dura todo el día.",
  "Qué linda eres, {n}. Hasta las flores te tendrían envidia. 🌼"
];

const $ = id => document.getElementById(id);
const vistas = ["portada", "mMensajes", "mFlores"];
let musicaIniciada = false, ultimo = -1;

$("titulo").textContent = "Para ti, " + APODO;
$("fotoKitty").addEventListener("load", () => { $("fotoKitty").hidden = false; $("gataPortada").style.display = "none"; });
$("fotoKitty").addEventListener("error", () => $("fotoKitty").remove());

// corazones que suben por el fondo
const cont = $("corazones");
for (let i = 0; i < 16; i++){
  const c = document.createElement("span"); c.className = "corazon"; c.textContent = i % 3 ? "♥" : "🎀";
  c.style.left = Math.random() * 100 + "vw"; c.style.fontSize = 14 + Math.random() * 26 + "px";
  c.style.animationDuration = 9 + Math.random() * 12 + "s"; c.style.animationDelay = -Math.random() * 20 + "s";
  cont.appendChild(c);
}

function etiquetaMusica(){
  $("bMusica").textContent = Musica.activa ? "♪ Pausar música" : "♪ Activar música";
  $("bMusica").setAttribute("aria-pressed", Musica.activa);
}

function ir(id){
  vistas.forEach(v => { $(v).hidden = v !== id; });
  if (id === "mFlores") Jardin.mostrar(); else Jardin.ocultar();
  if (id === "mMensajes") nuevo();
  if (id !== "portada" && !musicaIniciada && $("modalYT").hidden){ musicaIniciada = true; Musica.encender(); etiquetaMusica(); }
  scrollTo(0, 0);
}
document.querySelectorAll("[data-ir]").forEach(b => b.addEventListener("click", () => ir(b.dataset.ir)));

function rafaga(el){
  const r = el.getBoundingClientRect();
  for (let i = 0; i < 10; i++){
    const s = document.createElement("span"); s.className = "rafaga"; s.textContent = ["💗", "💕", "🌸", "✨"][i % 4];
    s.style.left = r.left + r.width / 2 + "px"; s.style.top = r.top + "px";
    const a = Math.random() * Math.PI, d = 60 + Math.random() * 80;
    s.style.setProperty("--dx", Math.cos(a) * d * (Math.random() < .5 ? -1 : 1) + "px"); s.style.setProperty("--dy", -Math.sin(a) * d - 20 + "px");
    document.body.appendChild(s); setTimeout(() => s.remove(), 1000);
  }
}

function nuevo(){
  let i; do { i = Math.floor(Math.random() * MENSAJES.length); } while (i === ultimo);
  ultimo = i;
  const t = $("texto"); t.textContent = MENSAJES[i].replaceAll("{n}", APODO);
  t.style.animation = "none"; void t.offsetWidth; t.style.animation = "";
}
$("bOtro").addEventListener("click", e => { nuevo(); rafaga(e.currentTarget); });
$("bRehacer").addEventListener("click", () => Jardin.reiniciar());

$("bMusica").addEventListener("click", () => { musicaIniciada = true; Musica.alternar(); etiquetaMusica(); });

$("bYT").addEventListener("click", () => {
  Musica.apagar(); etiquetaMusica(); musicaIniciada = true;
  $("marco").src = "https://www.youtube.com/embed/wiaH-mBRXsI?autoplay=1&rel=0";
  $("modalYT").hidden = false;
});
function cerrarYT(){ $("marco").src = "about:blank"; $("modalYT").hidden = true; }
$("cerrarYT").addEventListener("click", cerrarYT);
$("modalYT").addEventListener("click", e => { if (e.target === $("modalYT")) cerrarYT(); });
addEventListener("keydown", e => { if (e.key === "Escape" && !$("modalYT").hidden) cerrarYT(); });
