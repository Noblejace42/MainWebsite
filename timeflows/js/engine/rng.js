/* ---------------------------------------------------------------------------
   rng.js  –  deterministic, seedable PRNG & helper utilities
   All game files import from this module; do NOT instantiate another RNG
   unless you deliberately want a separate entropy stream.
--------------------------------------------------------------------------- */

/** 64-bit Linear Congruential Generator (LCG): xₙ₊₁ = (a·xₙ + c) mod 2⁶⁴
 *  Constants from Numerical Recipes. Produces double in (0,1).
 */
class RNG {
  constructor(seed = Date.now()) {
    // Force into unsigned 64-bit range
    this.state = BigInt.asUintN(64, BigInt(seed));
  }
  /** Return float in [0,1) */
  next() {
    /* LCG constants: a = 6364136223846793005, c = 1442695040888963407 */
    const a = 6364136223846793005n;
    const c = 1442695040888963407n;
    this.state = BigInt.asUintN(64, a * this.state + c);
    // Take high 53 bits for JS IEEE-754 double precision
    return Number(this.state >> 11n) / 0x1p53;
  }
  /** Integer 0 ≤ n < max */
  int(max) {
    return Math.floor(this.next() * max);
  }
  /** Reseed the generator */
  reseed(seed) {
    this.state = BigInt.asUintN(64, BigInt(seed));
  }
}

/* ---------------------------------------------------------------------------
   Singleton RNG for engine-wide use
--------------------------------------------------------------------------- */
const _rng = new RNG(1);   // overwritten during world initialisation

/* ---------------------------------------------------------------------------
   Helper wrappers around the singleton
--------------------------------------------------------------------------- */

/** Return integer in [0, max) */
export function randInt(max) { return _rng.int(max); }

/** Return one element from array (uniform) */
export function choice(arr) { return arr[_rng.int(arr.length)]; }

/** Weighted choice. `weights` = array of non-negative numbers
 *  Returns index of chosen weight (fast linear scan – good enough for UI).
 */
export function weighted(weights) {
  const total = weights.reduce((s, w) => s + w, 0);
  if (total === 0) return -1;
  let r = _rng.next() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1; // Fallback
}

/* ---------------------------------------------------------------------------
   Unique ID counter for all entities & events
--------------------------------------------------------------------------- */
let _uid = 1;
export function uid() { return _uid++; }

/* ---------------------------------------------------------------------------
   Expose control of the singleton for engine boot code
--------------------------------------------------------------------------- */
export function setSeed(seed) { _rng.reseed(seed); }

export { RNG };   // Export class in case isolated streams are needed
