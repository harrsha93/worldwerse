// Tiny WebAudio click/blip — no asset files needed.
let ctx: AudioContext | null = null;
function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch { return null; }
  }
  return ctx;
}

function blip(freq: number, dur = 0.08, type: OscillatorType = "sine", gain = 0.04) {
  if (typeof window === "undefined") return;
  if (localStorage.getItem("ww-sound") === "off") return;
  const ac = getCtx();
  if (!ac) return;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, ac.currentTime);
  g.gain.setValueAtTime(gain, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  o.connect(g).connect(ac.destination);
  o.start();
  o.stop(ac.currentTime + dur);
}

export const sfx = {
  click: () => blip(880, 0.06, "triangle", 0.03),
  flip: () => { blip(520, 0.05, "sine", 0.04); setTimeout(() => blip(720, 0.06, "sine", 0.04), 40); },
  success: () => { blip(660, 0.08, "sine", 0.05); setTimeout(() => blip(880, 0.12, "sine", 0.05), 80); setTimeout(() => blip(1100, 0.16, "sine", 0.05), 180); },
  notify: () => blip(1000, 0.1, "sine", 0.04),
};
