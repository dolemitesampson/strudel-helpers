// Strudel Helper Functions
// Usage: await evalScope(import('https://gist.githubusercontent.com/...'))

/**
 * Create an instrument with sound and optional effects
 * @param {string} soundName - The sound/synth name (e.g., "triangle", "piano")
 * @param {function} fxFunc - Optional function that applies effects: (p) => p.delay(0.3).gain(0.8)
 * @returns {object} Instrument object with sound and effects
 */
export function makeInstrument(soundName, fxFunc) {
  return {
    sound: soundName,
    effects: fxFunc || null
  };
}

/**
 * Load musical parts with scale and instrument
 * @param {object} notes - Object with note patterns: {a: "0 2 4", b: "5 7 9"}
 * @param {string} scaleName - Scale to apply (e.g., "C:major", "Eb:major")
 * @param {object} instrument - Instrument created by makeInstrument()
 * @returns {object} Object with processed patterns ready to use
 */
export function loadParts(notes, scaleName, instrument) {
  var out = {};
  for (var k in notes) {
    if (Object.prototype.hasOwnProperty.call(notes, k)) {
      var p = notes[k];
      if (typeof p === "string") p = n(p);

      // Apply scale, note control, and sound
      p = p.scale(scaleName).note().sound(instrument.sound);

      // Apply effects uniformly to ALL parts
      if (instrument.effects) {
        p = instrument.effects(p);
      }

      out[k] = p;
    }
  }
  return out;
}

/**
 * Load a complete instrument bundle (all-in-one)
 * @param {object} bundle - Complete instrument definition
 * @param {object} bundle.notes - Note patterns: {a: "0 2 4", b: "5 7 9"}
 * @param {string} bundle.scale - Scale name: "C:major"
 * @param {string} bundle.sound - Sound name: "piano"
 * @param {function} bundle.effects - Effects function: (p) => p.delay(0.3)
 * @returns {object} Object with processed patterns ready to use
 */
export function loadInstrument(bundle) {
  const instrument = makeInstrument(bundle.sound, bundle.effects);
  const parts = loadParts(bundle.notes, bundle.scale, instrument);
  return parts;
}
