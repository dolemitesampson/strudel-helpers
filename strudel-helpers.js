
// Strudel Helper Functions
// Usage in Strudel REPL: await evalScope(import('https://cdn.jsdelivr.net/gh/dolemitesampson/strudel-helpers@main/strudel-helpers.js'))

/**
 * Adds chainable methods (.scale, .sound) to instrument parts
 * @param {object} obj - Object with pattern parts {a: Pattern, b: Pattern}
 * @param {function} effectsFunc - Optional effects function to apply after .sound()
 * @returns {object} Object with chainable methods attached
 */
export function addChainableMethods(obj, effectsFunc) {
  obj.scale = function(scaleName) {
    var result = {};
    for (var k in this) {
      if (Object.prototype.hasOwnProperty.call(this, k) && typeof this[k] !== 'function') {
        result[k] = this[k].scale(scaleName);
      }
    }
    return addChainableMethods(result, effectsFunc);
  };

  obj.sound = function(soundName) {
    var result = {};
    for (var k in this) {
      if (Object.prototype.hasOwnProperty.call(this, k) && typeof this[k] !== 'function') {
        var p = this[k];
        p = p.note().sound(soundName);
        if (effectsFunc) {
          p = effectsFunc(p);
        }
        result[k] = p;
      }
    }
    return addChainableMethods(result, null);
  };

  return obj;
}

/**
 * Load a complete instrument bundle (all-in-one)
 * @param {object} bundle - Complete instrument definition
 * @param {object} bundle.notes - Note patterns: {a: "0 2 4", b: "5 7 9"}
 * @param {function} bundle.synth - Optional synth config: (p) => p.scale("C:major").sound("piano")
 * @param {function} bundle.effects - Optional effects: (p) => p.delay(0.3).gain(0.8)
 * @returns {object} Object with processed patterns and chainable methods
 *
 * Usage style 1 (with synth property):
 *   const inst = loadInstrument({
 *     notes: {a: "1 2 3", b: "4 5 6"},
 *     synth: (p) => p.scale("C:major").sound("piano"),
 *     effects: (p) => p.delay(0.3)
 *   });
 *
 * Usage style 2 (with chainable methods):
 *   const inst = loadInstrument({
 *     notes: {a: "1 2 3", b: "4 5 6"},
 *     effects: (p) => p.delay(0.3)
 *   }).scale("C:major").sound("piano");
 */
export function loadInstrument(bundle) {
  var out = {};
  for (var k in bundle.notes) {
    if (Object.prototype.hasOwnProperty.call(bundle.notes, k)) {
      var p = bundle.notes[k];
      if (typeof p === "string") p = n(p);

      if (bundle.synth) {
        p = bundle.synth(p);
        p = p.note();
        if (bundle.effects) {
          p = bundle.effects(p);
        }
      }

      out[k] = p;
    }
  }
  return addChainableMethods(out, bundle.synth ? null : bundle.effects);
}
