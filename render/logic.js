/* ======================================================
   SAMSARA — ARCHETYPE LOGIC ENGINE (REFINED)
   Clarity preserved. Ambiguity earned.
====================================================== */

/* --------------------
   AXES (ORDER MATTERS)
-------------------- */
const AXES = ["E","D","M","T","R","S","I"];

/*
E — Expression (inward ↔ outward)
D — Decision (slow ↔ fast)
M — Meaning (practical ↔ symbolic)
T — Time (present ↔ narrative)
R — Relational (independent ↔ communal)
S — Stability (fluid ↔ structured)
I — Identity (fixed ↔ fluid)
*/

/* --------------------
   AXIS WEIGHTS
-------------------- */
const AXIS_WEIGHTS = {
  E: 0.9,
  D: 0.8,
  M: 1.2,
  T: 1.1,
  R: 1.2,
  S: 1.0,
  I: 1.3
};

/* --------------------
   QUESTION → VECTOR MAP
-------------------- */
const QUESTION_VECTORS = {
  1: {
    a: { M: 0.25, T: 0.20 },
    b: { E: 0.25, S: 0.20 },
    c: { S: 0.30, D: 0.20 },
    d: { I: 0.30 }
  },
  2: {
    a: { T: 0.25, D: -0.15 },
    b: { D: 0.30, T: -0.15 },
    c: { S: 0.25, M: 0.15 },
    d: { I: 0.30 }
  },
  3: {
    a: { M: 0.30, E: -0.15 },
    b: { E: 0.30, D: 0.15 },
    c: { S: 0.30 },
    d: { I: 0.35 }
  },
  4: {
    a: { R: 0.25, E: 0.15 },
    b: { T: 0.25, E: -0.15 },
    c: { D: 0.30 },
    d: { I: 0.25 }
  },
  5: {
    a: { E: -0.25 },
    b: { R: -0.20 },
    c: { M: -0.15 },
    d: { D: -0.20 },
    e: { E: 0.15, R: -0.15 },
    f: { T: 0.20 }
  },
  6: {
    a: { M: 0.30 },
    b: { D: 0.30 },
    c: { S: 0.30 },
    d: { I: 0.30 }
  },
  7: {
    a: { E: 0.30 },
    b: { S: 0.30 },
    c: { T: 0.25 },
    d: { I: 0.25 }
  },
  8: {
    a: { S: -0.30 },
    b: { T: -0.25 },
    c: { R: -0.30 },
    d: { I: -0.25 },
    e: { S: -0.20 },
    f: { I: 0.30 }
  },
  9: {
    a: { D: 0.30, S: 0.20 },
    b: { I: 0.35 },
    c: { R: 0.30 },
    d: { M: 0.25, I: 0.25 }
  }
};

/* --------------------
   ARCHETYPE CENTROIDS
-------------------- */
const ARCHETYPES = {
  StoryWeaver: [0.35,0.45,0.75,0.85,0.65,0.30,0.50],
  Catalyst:    [0.80,0.85,0.55,0.45,0.45,0.85,0.75],
  Harmonizer:  [0.45,0.50,0.85,0.60,0.85,0.40,0.35],
  Steward:     [0.30,0.40,0.90,0.70,0.80,0.25,0.25],
  Analyst:     [0.50,0.75,0.45,0.65,0.30,0.65,0.40],
  Alchemist:   [0.65,0.65,0.65,0.75,0.65,0.60,0.90]
};

/* --------------------
   UTILITIES
-------------------- */
function clamp(v) {
  return Math.max(0, Math.min(1, v));
}

function distance(a, b) {
  return Math.sqrt(
    a.reduce((sum, v, i) => {
      const axis = AXES[i];
      return sum + AXIS_WEIGHTS[axis] * Math.pow(v - b[i], 2);
    }, 0)
  );
}

/* --------------------
   MAIN CALCULATION
-------------------- */
function calculateArchetype() {

  // 1. Initialize axis values
  const axisValues = {};
  AXES.forEach(a => axisValues[a] = 0.5);

  // 2. Apply question vectors
  Object.entries(localStorage)
    .filter(([k]) => k.startsWith("question_"))
    .forEach(([key, choice]) => {
      const qNum = key.split("_")[1];
      const vectors = QUESTION_VECTORS[qNum];
      if (!vectors || !vectors[choice]) return;

      Object.entries(vectors[choice]).forEach(([axis, val]) => {
        axisValues[axis] = clamp(axisValues[axis] + val);
      });
    });

  // 3. Build final vector
  const finalVector = AXES.map(a => axisValues[a]);

  // 4. Measure distances
  const distances = Object.entries(ARCHETYPES)
    .map(([name, vec]) => ({
      name,
      d: distance(finalVector, vec)
    }))
    .sort((a,b) => a.d - b.d);

  const primary   = distances[0];
  const secondary = distances[1];

  // 5. Dominance check (prevents weak ambiguity)
  const dominance = secondary.d - primary.d;
  if (dominance > 0.06) {
    return finalize(primary.name, primary.d, axisValues, finalVector);
  }

  // 6. Shapeshifter logic (earned, not default)
  const identity = axisValues.I;

  const isShapeshifter =
    Math.abs(primary.d - secondary.d) < 0.035 &&
    identity > 0.68;

  const archetype = isShapeshifter
    ? "Shapeshifter"
    : primary.name;

  return finalize(archetype, primary.d, axisValues, finalVector);
}

/* --------------------
   FINALIZE + STORE
-------------------- */
function finalize(archetype, distanceScore, axisValues, vector) {

  const coherence = clamp(1 - distanceScore);

  // Persist once, use everywhere
  localStorage.setItem("samsara_archetype", archetype);
  localStorage.setItem("samsara_coherence", coherence);
  localStorage.setItem("samsara_axisProfile", JSON.stringify(axisValues));
  localStorage.setItem("samsara_vector", JSON.stringify(vector));

  return {
    archetype,
    coherence,
    axisProfile: axisValues,
    vector
  };
}
