/* ======================================================
   SAMSARA — ARCHETYPE LOGIC ENGINE
   Tuned for emergence, cost, and coherence
====================================================== */

/* --------------------
   AXES (ORDER MATTERS)
-------------------- */
// Place AXES at the TOP of logic.js
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
   PHASE WEIGHTS
-------------------- */
const PHASE_WEIGHTS = {
  phase1: 0.35, // self-orientation
  phase2: 0.30, // reflection & tension
  phase3: 0.35  // cost & consequence
};

/* --------------------
   QUESTION → VECTOR MAP
-------------------- */
/*
Each answer nudges one or more axes.
Values are intentionally subtle (±0.15–0.30)
*/

const QUESTION_VECTORS = {
  1: { // The Empty Hour
    a: { M: 0.25, T: 0.20 },
    b: { E: 0.25, S: 0.20 },
    c: { S: 0.30, D: 0.20 },
    d: { I: 0.30 }
  },

  2: { // The Unfinished Thought
    a: { T: 0.25, D: -0.15 },
    b: { D: 0.30, T: -0.15 },
    c: { S: 0.25, M: 0.15 },
    d: { I: 0.30 }
  },

  3: { // Mirror Without Instructions
    a: { M: 0.30, E: -0.15 },
    b: { E: 0.30, D: 0.15 },
    c: { S: 0.30 },
    d: { I: 0.35 }
  },

  4: { // Idea That Doesn't Land
    a: { R: 0.25, E: 0.15 },
    b: { T: 0.25, E: -0.15 },
    c: { D: 0.30 },
    d: { I: 0.25 }
  },

  6: { // Moments of Struggle (reflection)
    a: { E: -0.25 },
    b: { R: -0.20 },
    c: { M: -0.15 },
    d: { D: -0.20 },
    e: { E: 0.15, R: -0.15 },
    f: { T: 0.20 }
  },

  7: { // Reputation
    a: { M: 0.30 },
    b: { D: 0.30 },
    c: { S: 0.30 },
    d: { I: 0.30 }
  },

  15: { // Energy in present moment
    a: { E: 0.30 },
    b: { S: 0.30 },
    c: { T: 0.25 },
    d: { I: 0.25 }
  },

  11: { // Necessary Loss
    a: { S: -0.30 },
    b: { T: -0.25 },
    c: { R: -0.30 },
    d: { I: -0.25 },
    e: { S: -0.20 },
    f: { I: 0.30 }
  },

  18: { // Tool That Changes Hands
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
  Alchemist:   [0.65,0.65,0.65,0.75,0.65,0.60,0.90],
  
};

/* --------------------
   UTILS
-------------------- */

function distance(a, b) {
  return Math.sqrt(
    a.reduce((sum, v, i) => {
      const axis = AXES[i];
      return sum + AXIS_WEIGHTS[axis] * Math.pow(v - b[i], 2);
    }, 0)
  );
}


function clamp(v) {
  return Math.max(0, Math.min(1, v));
}

/* --------------------
   MAIN CALCULATION
-------------------- */

function calculateArchetype() {
  let axisValues = {};
  AXES.forEach(a => axisValues[a] = 0.5);

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

  const finalVector = AXES.map(a => axisValues[a]);

  let distances = Object.entries(ARCHETYPES).map(([name, vec]) => ({
    name,
    d: distance(finalVector, vec)
  }));

  distances.sort((a,b) => a.d - b.d);

  const primary = distances[0];
  const secondary = distances[1];

  // Emergent Shapeshifter logic
  const isShapeshifter =
    Math.abs(primary.d - secondary.d) < 0.08 &&
    primary.name !== "Shapeshifter";

  const archetype = isShapeshifter
    ? "Shapeshifter"
    : primary.name;

  const coherence = 1 - Math.min(primary.d, 1);

  return {
    archetype,
    coherence,
    vector: finalVector,
    axisProfile: axisValues
  };
}

/* --------------------
   AUTO-RUN (optional)
-------------------- */

// Call this in results.html
// const result = calculateArchetype();
// console.log(result);
