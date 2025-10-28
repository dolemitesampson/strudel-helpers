● // Strudel Helper Functions
  // Import via:
  https://cdn.jsdelivr.net/gh/YOUR_USERNAME/strudel-helpers@main/strudel-helpers.js

  /**
   * Create an instrument with sound and optional effects
   * @param {string} soundName - The sound/synth name (e.g., "triangle", "piano")
   * @param {function} fxFunc - Optional function that applies effects: (p) =>
  p.delay(0.3).gain(0.8)
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
   * @param {function} bundle.effects - Effects function including scale/sound: (p) =>
  p.scale("C:major").sound("piano").delay(0.3)
   * @returns {object} Object with processed patterns ready to use
   */
  export function loadInstrument(bundle) {
    var out = {};
    for (var k in bundle.notes) {
      if (Object.prototype.hasOwnProperty.call(bundle.notes, k)) {
        var p = bundle.notes[k];
        if (typeof p === "string") p = n(p);

        // Apply .note() wrapper (CRITICAL - won't play without this)
        p = p.note();

        // Apply effects function (which now includes scale, sound, and effects)
        if (bundle.effects) {
          p = bundle.effects(p);
        }

        out[k] = p;
      }
    }
    return out;
  }

  ═════════════════════════════════════════════════════════════

  USAGE IN STRUDEL
  ───────────────────────────────────────────────────────────────

  const guitar = {
    notes: {
      a: "5 5 5 7 5 7",
      b: "4 4 4 6 4 6",
      c: "3 3 3 7 3 7"
    },
    effects: (p) => p.scale("Eb:major")
                     .sound("triangle")
                     .delay(0.3)
                     .gain(3)
                     .attack(.1)
                     .decay(.1)
                     .sustain(.25)
                     .release(.2)
                     .pan(sine.slow(2))
  };

  const gtr = loadInstrument(guitar);

  ═════════════════════════════════════════════════════════════
