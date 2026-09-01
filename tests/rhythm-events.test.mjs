import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  patterns,
  DEFAULT_EVENT_VELOCITY,
  ACCENT_GAIN_MULTIPLIER,
  getEventStep,
  getEventVelocity,
  isEventAccented,
  getEventGainMultiplier,
  getEffectiveEventGain,
  getEventAtStep,
  getSecondsPerStep,
  validatePattern
} from "../pattern-model.mjs";

const PART_GAINS = {
  voice: 0.095,
  right: 0.085,
  left: 0.085,
  foot: 0.15
};

function fixture(events) {
  return {
    id: "rhythm-event-fixture",
    name: "Rhythm Event Fixture",
    family: "Test",
    description: "Synthetic rhythm event fixture",
    defaultBpm: 100,
    meter: { numerator: 4, denominator: 4 },
    pulse: { count: 4, unit: "quarter" },
    subdivisionsPerPulse: 12,
    bars: 1,
    events
  };
}

test("all user patterns use object rhythm events", () => {
  assert.equal(Object.keys(patterns).length, 12);

  for (const [patternId, pattern] of Object.entries(patterns)) {
    for (const [partKey, events] of Object.entries(pattern.events)) {
      assert.ok(Array.isArray(events), `${patternId}/${partKey}`);
      for (const event of events) {
        assert.equal(typeof event, "object", `${patternId}/${partKey}`);
        assert.equal(Array.isArray(event), false, `${patternId}/${partKey}`);
        assert.ok(Number.isInteger(event.step), `${patternId}/${partKey}/${JSON.stringify(event)}`);
      }
    }
  }
});

test("event defaults preserve timing and expression defaults", () => {
  const event = { step: 12 };

  assert.equal(getEventStep(event), 12);
  assert.equal(getEventVelocity(event), DEFAULT_EVENT_VELOCITY);
  assert.equal(DEFAULT_EVENT_VELOCITY, 1);
  assert.equal(isEventAccented(event), false);
  assert.equal(getEventGainMultiplier(event), 1);
});

test("velocity and accent are expression-only attributes", () => {
  const plain = { step: 18 };
  const quiet = { step: 18, velocity: 0.5 };
  const accented = { step: 18, accent: true };
  const expressive = { step: 18, velocity: 0.65, accent: true };

  for (const event of [plain, quiet, accented, expressive]) {
    assert.equal(getEventStep(event), 18);
  }

  assert.equal(getEventVelocity(quiet), 0.5);
  assert.equal(isEventAccented(accented), true);
  assert.equal(getEventGainMultiplier(quiet), 0.5);
  assert.equal(getEventGainMultiplier(accented), ACCENT_GAIN_MULTIPLIER);
  assert.equal(
    getEventGainMultiplier(expressive),
    0.65 * ACCENT_GAIN_MULTIPLIER
  );

  const secondsPerStep = getSecondsPerStep(patterns.rock8, patterns.rock8.defaultBpm);
  const scheduledTime = event => getEventStep(event) * secondsPerStep;
  assert.equal(scheduledTime(plain), scheduledTime(quiet));
  assert.equal(scheduledTime(plain), scheduledTime(accented));
  assert.equal(scheduledTime(plain), scheduledTime(expressive));
});

test("default event gain is exactly backward compatible for every part", () => {
  for (const [partKey, legacyGain] of Object.entries(PART_GAINS)) {
    const effective = getEffectiveEventGain(legacyGain, { step: 0 });
    assert.equal(effective, legacyGain, partKey);
  }
});

test("velocity scales gain and accent is stronger but bounded", () => {
  for (const [partKey, legacyGain] of Object.entries(PART_GAINS)) {
    const quiet = getEffectiveEventGain(legacyGain, { step: 0, velocity: 0.5 });
    const normal = getEffectiveEventGain(legacyGain, { step: 0 });
    const accent = getEffectiveEventGain(legacyGain, { step: 0, accent: true });

    assert.equal(quiet, legacyGain * 0.5, partKey);
    assert.ok(accent > normal, partKey);
    assert.ok(Number.isFinite(accent), partKey);
    assert.ok(accent <= 1, partKey);
  }
});

test("validator accepts velocity/accent and rejects invalid rhythm events", () => {
  const valid = fixture({
    voice: [
      { step: 0, velocity: 0.5 },
      { step: 12, velocity: 1, accent: true },
      { step: 24, accent: false }
    ]
  });
  assert.deepEqual(validatePattern(valid), []);

  const duplicate = fixture({
    voice: [
      { step: 12 },
      { step: 12, accent: true }
    ]
  });
  assert.ok(validatePattern(duplicate).some(error => error.includes("duplicate step 12")));

  const invalid = fixture({
    voice: [
      0,
      { step: 1.5 },
      { step: -1 },
      { step: 48 },
      { step: 6, velocity: 0 },
      { step: 9, velocity: 1.01 },
      { step: 15, velocity: Number.NaN },
      { step: 21, accent: "yes" }
    ]
  });
  const errors = validatePattern(invalid);

  assert.ok(errors.some(error => error.includes("non-object event")));
  assert.ok(errors.some(error => error.includes("non-integer step")));
  assert.ok(errors.some(error => error.includes("negative step")));
  assert.ok(errors.some(error => error.includes("outside totalSteps")));
  assert.ok(errors.some(error => error.includes("0 < velocity <= 1")));
  assert.ok(errors.some(error => error.includes("velocity must be finite")));
  assert.ok(errors.some(error => error.includes("accent must be boolean")));
});

test("event lookup is by step and remains unique within a part", () => {
  const pattern = fixture({
    voice: [
      { step: 0, velocity: 0.7 },
      { step: 12, accent: true }
    ]
  });

  assert.deepEqual(getEventAtStep(pattern, "voice", 0), { step: 0, velocity: 0.7 });
  assert.deepEqual(getEventAtStep(pattern, "voice", 12), { step: 12, accent: true });
  assert.equal(getEventAtStep(pattern, "voice", 24), null);
  assert.equal(getEventAtStep(pattern, "right", 0), null);
});

test("Grid and Orbit represent expression without creating a second timing clock", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.equal(html.includes(".cell.event.accent"), true);
  assert.equal(html.includes(".orbit-marker.accent"), true);
  assert.equal(html.includes("--event-opacity"), true);
  assert.equal(html.includes('"data-velocity": velocity'), true);

  assert.equal(html.includes("getEventAtStep(currentPattern(), part.key, step)"), true);
  assert.equal(html.includes("makeClick(time, part, event)"), true);
  assert.equal(html.includes("getEffectiveEventGain(part.gain, event)"), true);

  assert.equal(html.includes("const visualNow = getVisualClockTime();"), true);
  assert.equal(html.includes("ghostUiQueue[0].time <= visualNow"), true);
  assert.equal(html.includes("visualQueue[0].time <= visualNow"), true);
});

test("PR #2 and PR #3 invariants remain present", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

  for (const required of [
    "const lookaheadMs = 20;",
    "const scheduleAheadSec = 0.20;",
    'source: "getOutputTimestamp"',
    'source: "baseLatency + outputLatency"',
    'min="-150" max="150"',
    "if (running || starting) return;",
    "getTotalSteps(currentPattern())",
    "isBarBoundary(currentPattern(), step)",
    "getEventsForBar(pattern, part.key, safeBarIndex)"
  ]) {
    assert.equal(html.includes(required), true, required);
  }

  const model = await readFile(new URL("../pattern-model.mjs", import.meta.url), "utf8");
  assert.equal(model.includes("numerator: 12"), true);
  assert.equal(model.includes("denominator: 8"), true);
  assert.equal(model.includes('unit: "dotted-quarter"'), true);
});
