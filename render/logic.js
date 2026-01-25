/* ======================================================
   SAMSARA — ARCHETYPE LOGIC ENGINE (v3)
   Weighted clarity without softening outcomes
====================================================== */

/* --------------------
   ARCHETYPES
-------------------- */
const ARCHETYPES = [
  "Steward",
  "Lover",
  "Jester",
  "Seeker",
  "Alchemist",
  "Sage",
  "StoryWeaver",
  "Tradesman",
  "Catalyst",
  "Drifter" // special case
];

/* --------------------
   BASE SCORES
-------------------- */
const BASE_SCORES = {
  Steward: 0,
  Lover: 0,
  Jester: 0,
  Seeker: 0,
  Alchemist: 0,
  Sage: 0,
  StoryWeaver: 0,
  Tradesman: 0,
  Catalyst: 0,
  Drifter: 3 // ⚠️ baseline risk
};

/* --------------------
   QUESTION → SCORE MAP
-------------------- */
const QUESTION_SCORES = {
  /* PHASE 1 */
  1: {
    a: { Lover: 2, StoryWeaver: 1, Sage: 1 },
    b: { Seeker: 2, Alchemist: 1, StoryWeaver: 1 },
    c: { Steward: 2, Tradesman: 1, Sage: 1 }
  },
  2: {
    a: { Tradesman: 2, Steward: 1, Sage: 1 },
    b: { Seeker: 2, Jester: 1, Catalyst: 1 },
    c: { StoryWeaver: 2, Lover: 1, Alchemist: 1 }
  },
  3: {
    a: { Seeker: 2, Catalyst: 1, StoryWeaver: 1 },
    b: { Steward: 2, Sage: 1, Tradesman: 1 },
    c: { Lover: 2, Jester: 1, StoryWeaver: 1 },
    d: { Drifter: 3 } // bypass
  },

  /* PHASE 2 */
  4: {
    a: { Steward: 2, Lover: 1 },
    b: { Tradesman: 2, Catalyst: 1 },
    c: { StoryWeaver: 2, Lover: 1 },
    d: { Seeker: 2, Jester: 1 },
    e: { Alchemist: 2, Sage: 1 }
  },
  5: {
    a: { Lover: 2, Steward: 1 },
    b: { Catalyst: 2, Tradesman: 1 },
    c: { StoryWeaver: 2, Sage: 1 },
    d: { Seeker: 2, Jester: 1 },
    e: { Alchemist: 2, Sage: 1 }
  },
  6: {
    a: { Steward: 2, Sage: 1 },
    b: { Lover: 2, StoryWeaver: 1 },
    c: { Seeker: 2, Alchemist: 1 },
    d: { Tradesman: 2, Catalyst: 1 },
    e: { Jester: 2, Seeker: 1 }
  },
  7: {
    a: { Steward: 2, Lover: 1 },
    b: { Tradesman: 2, Sage: 1 },
    c: { Seeker: 2, Jester: 1 },
    d: { Alchemist: 2, StoryWeaver: 1 },
    e: { Catalyst: 2, Tradesman: 1 }
  },
  8: {
    a: { Steward: 2, Sage: 1 },
    b: { Lover: 2, StoryWeaver: 1 },
    c: { Seeker: 2, Jester: 1 },
    d: { Sage: 2, Alchemist: 1 },
    e: { Catalyst: 2, Tradesman: 1 },
    f: { Drifter: 4 } // bypass
  },

  /* PHASE 3 */
  9: {
    a: { Steward: 4 },
    b: { Lover: 4 },
    c: { Catalyst: 4 },
    d: { Tradesman: 4 },
    e: { StoryWeaver: 4 },
    f: { Seeker: 4 },
    g: { Sage: 4 },
    h: { Alchemist: 4 },
    i: { Jester: 4 },
    j: { Drifter: 6 }
  },
  10: {
    a: { Catalyst: 4 },
    b: { Lover: 4 },
    c: { Seeker: 4 },
    d: { Tradesman: 4 },
    e: { StoryWeaver: 4 },
    f: { Sage: 4 },
    g: { Sage: 4 },
    h: { Alchemist: 4 },
    i: { Jester: 4 },
    j: { Drifter: 6 }
  },
  11: {
    a: { Steward: 5 },
    b: { Lover: 4 },
    c: { Catalyst: 5 },
    d: { Tradesman: 4 },
    e: { StoryWeaver: 4 },
    f: { Seeker: 4 },
    g: { Sage: 5 },
    h: { Alchemist: 5 },
    i: { Jester: 4 },
    j: { Drifter: 7 }
  },
  12: {
    a: { Steward: 4 },
    b: { Lover: 4 },
    c: { Catalyst: 5 },
    d: { Tradesman: 4 },
    e: { StoryWeaver: 4 },
    f: { Seeker: 4 },
    g: { Sage: 5 },
    h: { Alchemist: 5 },
    i: { Jester: 4 },
    j: { Drifter: 7 }
  },
  13: {
    a: { Steward: 5 },
    b: { Lover: 5 },
    c: { Catalyst: 5 },
    d: { Tradesman: 5 },
    e: { StoryWeaver: 5 },
    f: { Seeker: 5 },
    g: { Sage: 5 },
    h: { Alchemist: 5 },
    i: { Jester: 5 },
    j: { Drifter: 8 }
  }
};

/* --------------------
   MAIN CALCULATION
-------------------- */
function calculateArchetype() {

  const scores = { ...BASE_SCORES };

  Object.entries(localStorage)
    .filter(([k]) => k.startsWith("question_"))
    .forEach(([key, choice]) => {
      const qNum = key.split("_")[1];
      const map = QUESTION_SCORES[qNum];
      if (!map || !map[choice]) return;

      Object.entries(map[choice]).forEach(([arch, val]) => {
        scores[arch] += val;
      });
    });

  /* ---------- RANKING ---------- */
  const ranked = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]);

  const [primary, primaryScore] = ranked[0];
  const [secondary, secondaryScore] = ranked[1];

  /* ---------- DRIFTER OVERRIDE ---------- */
  if (primary === "Drifter") {
    return finalize({
      archetype: "Drifter",
      scores,
      ranked,
      weights: null,
      coherence: 0
    });
  }

  /* ---------- DUAL LOGIC ---------- */
  const dual =
    secondary !== "Drifter" &&
    secondaryScore >= primaryScore * 0.75;

  const archetype = dual
    ? `${primary}–${secondary}`
    : primary;

  /* ---------- NORMALIZED WEIGHTS (EXCLUDING DRIFTER) ---------- */
  const nonDrifterTotal = Object.entries(scores)
    .filter(([k]) => k !== "Drifter")
    .reduce((sum, [, v]) => sum + v, 0);

  const weights = {};
  Object.entries(scores).forEach(([k, v]) => {
    if (k === "Drifter") return;
    weights[k] = +(v / nonDrifterTotal * 100).toFixed(1);
  });

  /* ---------- COHERENCE ---------- */
  const coherence = Math.min(
    1,
    primaryScore / (primaryScore + secondaryScore)
  );

  return finalize({
    archetype,
    scores,
    ranked,
    weights,
    coherence
  });
}

/* --------------------
   FINALIZE + STORE
-------------------- */
function finalize(result) {

  localStorage.setItem("samsara_archetype", result.archetype);
  localStorage.setItem("samsara_scores", JSON.stringify(result.scores));
  localStorage.setItem("samsara_ranked", JSON.stringify(result.ranked));
  localStorage.setItem("samsara_weights", JSON.stringify(result.weights));
  localStorage.setItem("samsara_coherence", result.coherence);

  return result;
}
