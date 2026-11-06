/* ============================================================================
   GREEK QUEST — GREEK TEXT HELPERS (greek.js)
   Loaded before content.js and app.js. No DOM; also runs under node for tests
   (tools/test_greek.js).

   translit(greek)  -> a beginner-readable pronunciation in Latin letters, with
                       the stress mark kept:  ευχαριστώ -> efharistó,
                       καλημέρα -> kaliméra, γεια σου -> yia sou, Ελλάδα -> Eládha
   answerKey(text)  -> a loose phonetic key, so a fill-in answer typed in Greek
                       OR in Latin letters (efharisto / efcharisto / eyxaristw)
                       matches. Nobody should need a Greek keyboard.
   hasGreek(text)   -> does this string contain Greek letters?

   Romanisation choices (taught in the alphabet lessons):
     δ = dh (the "th" in "this")   θ = th (the "th" in "thin")
     χ = h (a throaty h)           γ = g, or y before an e/i sound
     β = v   η/ι/υ/ει/οι = i   αι = e   ου = ou   ω = o
     αυ/ευ = av/ev, or af/ef before a voiceless sound
     μπ = b at the start of a word, mb inside · ντ = d / nd · γκ = g / ng
   ========================================================================== */
(function(root){
  const GREEK_RE = /[Ͱ-Ͽἀ-῿]/;
  const L = "α-ωάέήίόύώϊϋΐΰς";          // lowercase Greek letters we handle
  const isGr = ch => !!ch && new RegExp("["+L+"]").test(ch);

  const ACC = { "ά":"á","έ":"é","ή":"í","ί":"í","ό":"ó","ύ":"í","ώ":"ó","ΐ":"í","ΰ":"í","ϊ":"i","ϋ":"i" };
  const BASE = { "α":"a","ε":"e","η":"i","ι":"i","ο":"o","υ":"i","ω":"o",
    "β":"v","γ":"g","δ":"dh","ζ":"z","θ":"th","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"x",
    "π":"p","ρ":"r","σ":"s","ς":"s","τ":"t","φ":"f","χ":"h","ψ":"ps" };
  const VOWELS = "αεηιουωάέήίόύώϊϋΐΰ";
  const isV = ch => !!ch && VOWELS.indexOf(ch) >= 0;
  const ACCENTED = "άέήίόύώΐΰ";
  const isAcc = ch => !!ch && ACCENTED.indexOf(ch) >= 0;
  const VOICELESS = "θκξπστφχψς";
  /* γ softens to y before these e/i sounds */
  const FRONT = ["ε","έ","η","ή","ι","ί","υ","ύ","ϊ","ΐ"];
  const strip = ch => ({ "ά":"α","έ":"ε","ή":"η","ί":"ι","ό":"ο","ύ":"υ","ώ":"ω","ϊ":"ι","ϋ":"υ","ΐ":"ι","ΰ":"υ" }[ch] || ch);

  /* Whole words whose spelling misleads the rules. */
  const OVERRIDE = { "συγγνώμη":"signómi" };

  function trWord(w){
    // w: lowercase Greek letters only
    if(OVERRIDE[w]) return OVERRIDE[w];
    let out = "", i = 0;
    const n = w.length;
    while(i < n){
      const c = w[i], d = w[i+1], e = w[i+2];
      const cs = strip(c), ds = d ? strip(d) : "";
      // --- vowel digraphs (only when the FIRST vowel carries no accent / diaeresis) ---
      if(isV(c) && !isAcc(c) && "ϊϋ".indexOf(c) < 0 && d && "ϊϋΐΰ".indexOf(d) < 0){
        const accd = isAcc(d);
        if(cs==="ο" && ds==="υ"){ out += accd ? "oú" : "ou"; i += 2; continue; }
        if((cs==="α") && ds==="ι"){ out += accd ? "é" : "e"; i += 2; continue; }
        if((cs==="ε" || cs==="ο" || cs==="υ") && ds==="ι"){ out += accd ? "í" : "i"; i += 2; continue; }
        if((cs==="α" || cs==="ε" || cs==="η") && ds==="υ"){
          const v = cs==="α" ? "a" : cs==="ε" ? "e" : "i";
          const voiceless = !e || VOICELESS.indexOf(strip(e)) >= 0;
          out += (accd ? ACC[{a:"ά",e:"έ",i:"ή"}[v]] : v) + (voiceless ? "f" : "v");
          i += 2; continue;
        }
      }
      // --- consonant clusters ---
      const start = i === 0;
      if(c==="μ" && d==="π"){ out += start ? "b" : "mb"; i += 2; continue; }
      if(c==="ν" && d==="τ"){ out += start ? "d" : "nd"; i += 2; continue; }
      if(c==="γ" && d==="κ"){ out += start ? "g" : "ng"; i += 2; continue; }
      if(c==="γ" && d==="γ"){ out += "ng"; i += 2; continue; }                          // γγ ng
      if(c==="γ" && (d==="χ" || d==="ξ")){ out += "n"; i += 1; continue; }              // γχ nh · γξ nx
      if(c==="τ" && d==="σ"){ out += "ts"; i += 2; continue; }
      if(c==="τ" && d==="ζ"){ out += "dz"; i += 2; continue; }
      // doubled consonants are said once: θάλασσα -> thálasa, Ελλάδα -> Eládha
      if(!isV(c) && c===d && c!=="γ"){ i += 1; continue; }
      if(c==="γ"){ out += FRONT.indexOf(d) >= 0 ? "y" : "g"; i += 1; continue; }
      if(ACC[c]){ out += ACC[c]; i += 1; continue; }
      out += BASE[c] !== undefined ? BASE[c] : c;
      i += 1;
    }
    return out;
  }

  /* Transliterate any string: Greek words are converted, everything else passes
     through. The Greek question mark ";" becomes "?" and the raised dot "·" ";". */
  function translit(s){
    s = String(s == null ? "" : s);
    return s.replace(new RegExp("["+L+"Α-ΩΆΈΉΊΌΎΏΪΫ]+", "g"), word => {
      const upper = word.length > 1 && word === word.toUpperCase();
      let t = trWord(word.toLowerCase());
      if(upper) return t.toUpperCase();
      if(word[0] !== word[0].toLowerCase()) t = t.charAt(0).toUpperCase() + t.slice(1);
      return t;
    }).replace(/;/g, "?").replace(/;/g, "?").replace(/·/g, ";");
  }

  /* Loose phonetic key for comparing typed answers. Both sides are reduced to the
     same skeleton, so every common way of writing Greek in Latin letters agrees:
       efharisto = efcharisto = eyxaristw = ευχαριστώ
       yia sou = geia sou = ya sou = γεια σου
       dhen = den = δεν · kalimera = καλημερα */
  function answerKey(s){
    let t = translit(String(s || "").toLowerCase());
    t = t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    t = t.replace(/[^a-z0-9 ]+/g, " ");
    const rules = [
      [/ey/g, "ef"], [/ay/g, "af"],               // greeklish writes υ as y: eyxaristw
      [/8/g, "th"], [/th/g, "8"],                 // θ (greeklish writes 8)
      [/dh/g, "d"],                               // δ
      [/ch|kh/g, "h"], [/x(?=[aeiouy])/g, "h"],   // χ written as ch / kh / x
      [/ks/g, "x"], [/ps/g, "ψ"],
      [/gh/g, "g"], [/ph/g, "f"],
      [/h(?![aeiou])/g, "i"],                     // greeklish writes η as h: kalhmera
      [/mp|mb/g, "b"], [/nt|nd/g, "d"], [/ng|gk/g, "g"],
      [/eu/g, "ef"], [/au/g, "af"], [/v/g, "f"], // αυ/ευ/β: f and v collapse
      [/w/g, "o"], [/ou/g, "u"],
      [/ai/g, "e"], [/ei|oi|ui|ee|y/g, "i"],
      [/g(?=[ie])/g, "i"],                        // γεια: gia = yia = ia
      [/([a-z8ψ])\1+/g, "$1"]                     // doubled letters
    ];
    rules.forEach(([re, to]) => { t = t.replace(re, to); });
    return t.replace(/i+/g, "i").replace(/\s+/g, "");    // word gaps don't matter: yiasou = yia sou
  }

  function hasGreek(s){ return GREEK_RE.test(String(s || "")); }

  root.translit = translit;
  root.answerKey = answerKey;
  root.hasGreek = hasGreek;
})(typeof window !== "undefined" ? window : globalThis);
