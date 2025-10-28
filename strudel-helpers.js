export function addChainableMethods(obj, effectsFunc) {
  obj.scale = function(scaleName) {
    var result = {};
    for (var k in this) {
      if (Object.prototype.hasOwnProperty.call(this, k) && typeof this[k] !== 'function') {
        result[k] = this[k].scale(scaleName);
      }
    }
    // IMPORTANT: Reference the global version in the recursion!
    return (globalThis.addChainableMethods || addChainableMethods)(result, effectsFunc);
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
    // IMPORTANT: Reference the global version in the recursion!
    return (globalThis.addChainableMethods || addChainableMethods)(result, null);
  };

  return obj;
}

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
  // IMPORTANT: Reference the global version!
  return (globalThis.addChainableMethods || addChainableMethods)(out, bundle.synth ? null : bundle.effects);
}
