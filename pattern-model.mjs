const Q = [0, 12, 24, 36];
const E = [0, 6, 12, 18, 24, 30, 36, 42];
const S16 = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45];
const TRIPLET8 = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44];
const SWUNG8 = [0, 8, 12, 20, 24, 32, 36, 44];

const fourFour = () => ({
  meter: { numerator: 4, denominator: 4 },
  pulse: { count: 4, unit: "quarter" },
  subdivisionsPerPulse: 12,
  bars: 1
});

export const patterns = {
  basic: {
    id: "basic",
    name: "Basic Independence",
    family: "基礎",
    description: "4分・8分・2拍3連・2分を同時に走らせる基礎独立課題。",
    defaultBpm: 60,
    ...fourFour(),
    events: {
      voice: Q,
      right: E,
      left: [0, 8, 16, 24, 32, 40],
      foot: [0, 24]
    }
  },
  rock8: {
    id: "rock8",
    name: "Rock 8-Beat",
    family: "Rock",
    description: "8ビートの骨格。右手8分、左手2・4拍、足1・3拍。",
    defaultBpm: 92,
    ...fourFour(),
    events: {
      voice: Q,
      right: E,
      left: [12, 36],
      foot: [0, 24]
    }
  },
  funk16: {
    id: "funk16",
    name: "Funk 16th",
    family: "Funk",
    description: "16分の細かいパルスに、バックビートとシンコペートした足を重ねる。",
    defaultBpm: 84,
    ...fourFour(),
    events: {
      voice: Q,
      right: S16,
      left: [12, 21, 36, 45],
      foot: [0, 9, 24, 30, 42]
    }
  },
  shuffle: {
    id: "shuffle",
    name: "Shuffle / Blues",
    family: "Blues",
    description: "3連の1個目と3個目を使うシャッフル系の跳ねた8分。",
    defaultBpm: 90,
    ...fourFour(),
    events: {
      voice: Q,
      right: SWUNG8,
      left: [12, 36],
      foot: [0, 24]
    }
  },
  jazzRide: {
    id: "jazzRide",
    name: "Jazz Ride",
    family: "Jazz",
    description: "代表的なライドの骨格。2拍目・4拍目の直前にスキップノートを置く。",
    defaultBpm: 120,
    ...fourFour(),
    events: {
      voice: Q,
      right: [0, 12, 20, 24, 36, 44],
      left: [12, 36],
      foot: Q
    }
  },
  reggae: {
    id: "reggae",
    name: "Reggae One-Drop",
    family: "Reggae",
    description: "裏拍を刻み、3拍目に重心を置くOne-Drop型の単純化パターン。",
    defaultBpm: 76,
    ...fourFour(),
    events: {
      voice: Q,
      right: [6, 18, 30, 42],
      left: [24],
      foot: [24]
    }
  },
  house: {
    id: "house",
    name: "House / Four-on-the-floor",
    family: "Dance",
    description: "足は4つ打ち、右手は裏8分、左手は2・4拍。",
    defaultBpm: 124,
    ...fourFour(),
    events: {
      voice: Q,
      right: [6, 18, 30, 42],
      left: [12, 36],
      foot: Q
    }
  },
  disco: {
    id: "disco",
    name: "Disco 16th",
    family: "Dance",
    description: "4つ打ちの足に16分パルスを重ねるディスコ系の練習骨格。",
    defaultBpm: 118,
    ...fourFour(),
    events: {
      voice: [6, 18, 30, 42],
      right: S16,
      left: [12, 36],
      foot: Q
    }
  },
  tresillo: {
    id: "tresillo",
    name: "Tresillo 3-3-2",
    family: "Latin / Afro",
    description: "8分単位の3-3-2。ラテン系やポップスにも広く現れる周期。",
    defaultBpm: 100,
    ...fourFour(),
    events: {
      voice: Q,
      right: E,
      left: [0, 18, 36],
      foot: [0, 24]
    }
  },
  bossa: {
    id: "bossa",
    name: "Bossa-style",
    family: "Brazil",
    description: "ボサノヴァ系のシンコペーションを独立練習用に簡略化。",
    defaultBpm: 116,
    ...fourFour(),
    events: {
      voice: Q,
      right: E,
      left: [0, 9, 18, 24, 33, 42],
      foot: [0, 24]
    }
  },
  afro12: {
    id: "afro12",
    name: "12/8 Cross-Rhythm",
    family: "Afro / 12-8",
    description: "3連系の12/8パルスに、3分割のクロスリズムを重ねる。",
    defaultBpm: 96,
    meter: {
      numerator: 12,
      denominator: 8,
      groups: [3, 3, 3, 3]
    },
    pulse: {
      count: 4,
      unit: "dotted-quarter"
    },
    subdivisionsPerPulse: 12,
    bars: 1,
    events: {
      voice: Q,
      right: TRIPLET8,
      left: [0, 16, 32],
      foot: Q
    }
  },
  poly32: {
    id: "poly32",
    name: "3:2 Polyrhythm",
    family: "Polyrhythm",
    description: "1小節を3等分する周期と2等分する周期を同時に維持する。",
    defaultBpm: 72,
    ...fourFour(),
    events: {
      voice: [0, 24],
      right: [0, 16, 32],
      left: Q,
      foot: [0, 24]
    }
  }
};

export function getStepsPerBar(pattern) {
  return pattern.pulse.count * pattern.subdivisionsPerPulse;
}

export function getTotalSteps(pattern) {
  return getStepsPerBar(pattern) * pattern.bars;
}

export function getSecondsPerStep(pattern, bpm = pattern.defaultBpm) {
  return (60 / bpm) / pattern.subdivisionsPerPulse;
}

export function getBarDuration(pattern, bpm = pattern.defaultBpm) {
  return getStepsPerBar(pattern) * getSecondsPerStep(pattern, bpm);
}

export function normalizeStep(pattern, step) {
  const totalSteps = getTotalSteps(pattern);
  return ((step % totalSteps) + totalSteps) % totalSteps;
}

export function getBarIndex(pattern, step) {
  return Math.floor(normalizeStep(pattern, step) / getStepsPerBar(pattern));
}

export function getStepWithinBar(pattern, step) {
  return normalizeStep(pattern, step) % getStepsPerBar(pattern);
}

export function getPulseIndex(pattern, step) {
  return Math.floor(getStepWithinBar(pattern, step) / pattern.subdivisionsPerPulse);
}

export function isBarBoundary(pattern, step) {
  return getStepWithinBar(pattern, step) === 0;
}

export function getEventsForBar(pattern, partKey, barIndex) {
  if (!Number.isInteger(barIndex) || barIndex < 0 || barIndex >= pattern.bars) return [];
  const stepsPerBar = getStepsPerBar(pattern);
  const start = barIndex * stepsPerBar;
  const end = start + stepsPerBar;
  return (pattern.events[partKey] || []).filter(step => step >= start && step < end);
}

export function validatePattern(pattern) {
  const errors = [];
  for (const field of ["id", "name", "family", "description"]) {
    if (typeof pattern?.[field] !== "string" || pattern[field].trim() === "") {
      errors.push(`${field} must be a non-empty string`);
    }
  }
  if (!Number.isFinite(pattern?.defaultBpm) || pattern.defaultBpm <= 0) {
    errors.push("defaultBpm must be positive");
  }

  const numerator = pattern?.meter?.numerator;
  const denominator = pattern?.meter?.denominator;
  const pulseCount = pattern?.pulse?.count;
  const pulseUnit = pattern?.pulse?.unit;
  const subdivisions = pattern?.subdivisionsPerPulse;
  const bars = pattern?.bars;

  if (!Number.isInteger(numerator) || numerator <= 0) errors.push("meter.numerator must be a positive integer");
  if (!Number.isInteger(denominator) || denominator <= 0) errors.push("meter.denominator must be a positive integer");
  if (!Number.isInteger(pulseCount) || pulseCount <= 0) errors.push("pulse.count must be a positive integer");
  if (typeof pulseUnit !== "string" || pulseUnit.trim() === "") errors.push("pulse.unit must be a non-empty string");
  if (!Number.isInteger(subdivisions) || subdivisions <= 0) errors.push("subdivisionsPerPulse must be a positive integer");
  if (!Number.isInteger(bars) || bars < 1) errors.push("bars must be an integer >= 1");

  if (pattern?.meter?.groups !== undefined) {
    const groups = pattern.meter.groups;
    if (!Array.isArray(groups) || groups.length === 0 || groups.some(group => !Number.isInteger(group) || group <= 0)) {
      errors.push("meter.groups must contain positive integers");
    } else if (Number.isInteger(numerator) && groups.reduce((sum, group) => sum + group, 0) !== numerator) {
      errors.push("meter.groups must sum to meter.numerator");
    }
  }

  const canCheckEvents =
    Number.isInteger(pulseCount) && pulseCount > 0 &&
    Number.isInteger(subdivisions) && subdivisions > 0 &&
    Number.isInteger(bars) && bars >= 1;
  const totalSteps = canCheckEvents ? getTotalSteps(pattern) : null;

  if (!pattern?.events || typeof pattern.events !== "object" || Array.isArray(pattern.events)) {
    errors.push("events must be an object");
  } else if (totalSteps !== null) {
    for (const [partKey, eventSteps] of Object.entries(pattern.events)) {
      if (!Array.isArray(eventSteps)) {
        errors.push(`events.${partKey} must be an array`);
        continue;
      }
      const seen = new Set();
      for (const step of eventSteps) {
        if (!Number.isInteger(step)) {
          errors.push(`events.${partKey} contains non-integer step ${step}`);
          continue;
        }
        if (step < 0) errors.push(`events.${partKey} contains negative step ${step}`);
        if (step >= totalSteps) errors.push(`events.${partKey} step ${step} is outside totalSteps ${totalSteps}`);
        if (seen.has(step)) errors.push(`events.${partKey} contains duplicate step ${step}`);
        seen.add(step);
      }
    }
  }

  return errors;
}

export function validatePatternCollection(collection = patterns) {
  const errors = [];
  const ids = new Set();
  for (const [key, pattern] of Object.entries(collection)) {
    const patternErrors = validatePattern(pattern);
    if (pattern.id !== key) patternErrors.push(`id ${pattern.id} must match collection key ${key}`);
    if (ids.has(pattern.id)) patternErrors.push(`duplicate pattern id ${pattern.id}`);
    ids.add(pattern.id);
    if (patternErrors.length) errors.push({ id: key, errors: patternErrors });
  }
  return errors;
}
