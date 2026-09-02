import { getEffectiveEventGain } from "../pattern-model.mjs";

function createBrowserAudioContext() {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) {
    throw new Error("Web Audio API is not available");
  }
  return new AudioContextConstructor({ latencyHint: "interactive" });
}

export function createAudioEngine({
  partDefs,
  contextFactory = createBrowserAudioContext
}) {
  let audioContext = null;
  let activeParts = new Set();
  const partGainBuses = new Map();

  function getContext() {
    return audioContext;
  }

  function ensurePartGainBuses() {
    if (!audioContext) return;

    for (const part of partDefs) {
      if (partGainBuses.has(part.key)) continue;

      const bus = audioContext.createGain();
      bus.gain.value = activeParts.has(part.key) ? 1 : 0;
      bus.connect(audioContext.destination);
      partGainBuses.set(part.key, bus);
    }
  }

  async function start(parts) {
    activeParts = new Set(parts);

    if (!audioContext) {
      audioContext = contextFactory();
    }
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    ensurePartGainBuses();
    return audioContext;
  }

  function setActiveParts(parts) {
    activeParts = new Set(parts);
    if (!audioContext) return;

    ensurePartGainBuses();
    for (const part of partDefs) {
      const bus = partGainBuses.get(part.key);
      if (!bus) continue;

      bus.gain.cancelScheduledValues(audioContext.currentTime);
      bus.gain.setTargetAtTime(
        activeParts.has(part.key) ? 1 : 0,
        audioContext.currentTime,
        0.006
      );
    }
  }

  function makeClick(time, part, event) {
    if (!audioContext) return false;

    const peakGain = getEffectiveEventGain(part.gain, event);

    // A zero-velocity event remains visible and keeps its timing position, but
    // Web Audio exponential ramps require a strictly positive target.
    if (peakGain <= 0) return false;

    ensurePartGainBuses();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = part.key === "foot" ? "sine" : "triangle";
    osc.frequency.setValueAtTime(part.freq, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(peakGain, time + 0.0025);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + part.duration);

    osc.connect(gain);
    gain.connect(partGainBuses.get(part.key));

    osc.start(time);
    osc.stop(time + part.duration + 0.012);
    return true;
  }

  return {
    getContext,
    start,
    setActiveParts,
    makeClick
  };
}
