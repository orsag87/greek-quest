/* ============================================================================
   GREEK QUEST — CONTENT FILE
   ----------------------------------------------------------------------------
   This is the file you edit to add or fix lessons. Nothing here is code logic —
   it's just the stories, quizzes, power lessons and the level-check questions.

   WHO IT'S FOR
   ------------
   Picks up where Duolingo leaves off — but the learner might be anywhere from
   "never seen the alphabet" to "finished the Duolingo tree". So:
     L0 Alphabet & first words · L1 First steps (survival) · L2 On the road
     · L3 Chatting (past + future) · L4 Beyond Duolingo (να-forms, opinions,
     "used to", how Greeks really talk). Shown as "Level 0…4".
   A level check on first open (PLACEMENT, at the bottom) puts them in the
   right place; every level stays one tap away.

   The trip: Athens (Plaka, Monastiraki, Piraeus) → the island of Naxos, with a
   day trip to Santorini. Characters: Μαρία, Νίκος (a Naxian), κύριος Γιώργος,
   Νίκος's grandma. "You" are Sam, from Canada.

   HOW A STORY WORKS
   -----------------
   {
     id:       unique slug, prefixed with the level: "l1-taverna" (never reuse an id)
     level:    "L0" … "L4"
     diff:     1..n  (order WITHIN a level; lower = shown first)
     titleGr:  Greek title
     titleEn:  English title
     text:     the scene. Use \n between lines (dialogue lines start with "— ").
               Wrap anything tappable as [greek|english]:
                 [Πού είναι|where is] [η τουαλέτα|the toilet];
               • punctuation (; ! . , ·) goes OUTSIDE the brackets.
                 The Greek question mark is ";" — use it, it's taught in L0.
               • nouns keep their article: [το νερό|the water] — the engine
                 still treats "article + noun" as one WORD (not a phrase)
               • the same Greek item must always get the same English gloss
                 (the validator warns otherwise) — e.g. παρακαλώ is always
                 "please / you're welcome"
               • never use a plain " inside a string — use « » or “ ”
               • NEVER type the pronunciation — the engine adds it (greek.js)
               Every glossed item becomes a spaced-repetition flashcard.
     quiz:     array of questions (see below)
   }

   QUESTION TYPES
   --------------
   Multiple choice:
     { q:"...", opts:["a","b","c"], a:1, skill:"comprehension" }
        a = index of the correct option (0-based)
   Fill in the blank:
     { q:"Type the Greek for “thank you”:", opts:[], a:["ευχαριστώ"], type:"fill",
       skill:"courtesy", explain:"why this is right" }
        a = accepted answers, in Greek. The learner may type Greek OR Latin
        letters (efharisto), any accents — answerKey() in greek.js matches them.
   Optional flags on any question:
     trick:true   -> a careful-reading question (give it an explain)
     notr:true    -> never show the Latin-letter pronunciation on this question.
                     REQUIRED on alphabet-reading questions, where the
                     pronunciation would give the answer away.
     explain:"…"  -> shown after answering (HTML allowed; put Greek in <b>, it
                     becomes tappable and gets its pronunciation)

   Questions are in English at every level (with the Greek quoted), so a
   learner never gets stuck on the question itself.

   SKILLS: the skill string must match a key in SKILLS below. That's how the
   weak-spot coaching knows what to drill. "vocab-*" skills get topped up with
   word questions from their stories; the others never get padded.

   NATIVE CHECK: all Greek here is AI-DRAFT until a Greek speaker has read it
   (see _DECISION_RECORD.md ADR-G04).
   ========================================================================== */

const SKILLS = {
  "comprehension":   { name:"Reading the scene", lesson:"Read the whole scene before answering — the answer is often in the last line. Watch the little flip words: <b>αλλά</b> (but), <b>δεν</b> (not), <b>και</b> (and / also), <b>πιο</b> (more)." },
  "vocab-daily":     { name:"Everyday words", lesson:"Everyday words. To make them stick, say each one out loud inside a tiny sentence of your own: <b>Θέλω νερό.</b> <b>Πού είναι το ξενοδοχείο;</b>" },
  "vocab-food":      { name:"Food & drink", lesson:"Food & drink: <b>το νερό</b> water, <b>ο καφές</b> coffee, <b>η μπύρα</b> beer, <b>το κρασί</b> wine, <b>το ψωμί</b> bread, <b>το ψάρι</b> fish, <b>η χωριάτικη</b> Greek salad. And at the end: <b>Τον λογαριασμό, παρακαλώ.</b>" },
  "vocab-travel":    { name:"Getting around", lesson:"Getting around: <b>αριστερά</b> left, <b>δεξιά</b> right, <b>ευθεία</b> straight on, <b>κοντά</b> near, <b>μακριά</b> far, <b>το εισιτήριο</b> ticket, <b>το πλοίο</b> ferry, <b>το λιμάνι</b> port." },
  "vocab-numbers":   { name:"Numbers, prices & time", lesson:"Numbers and money: <b>ένα, δύο, τρία</b>… <b>δέκα</b>, <b>είκοσι</b>, <b>εκατό</b>. Prices are in <b>ευρώ</b>. When in doubt, ask <b>Πόσο κάνει;</b> and hold up your phone's calculator — totally normal." },
  "vocab-cognates":  { name:"Free words (English is full of Greek)", lesson:"Free words — English borrowed thousands from Greek: <b>μουσική</b> music, <b>θέατρο</b> theatre, <b>φαρμακείο</b> pharmacy, <b>πρόβλημα</b> problem. Watch the trap: <b>ναι</b> = YES, and <b>όχι</b> = no." },
  "courtesy":        { name:"Magic words", lesson:"Magic words: <b>παρακαλώ</b> (please / you're welcome), <b>ευχαριστώ</b> (thank you), <b>συγγνώμη</b> (sorry / excuse me). Greet first: <b>καλημέρα</b> in the morning, <b>καλησπέρα</b> later on. <b>Γεια σας</b> for strangers, <b>γεια σου</b> for friends." },
  "phrases":         { name:"Power phrases", lesson:"Learn the chunk, swap the noun: <b>Θα ήθελα</b> ___ · <b>Έχετε</b> ___; · <b>Πού είναι</b> ___; · <b>Υπάρχει</b> ___; · <b>Πόσο κάνει;</b> · <b>Δεν καταλαβαίνω.</b>" },
  "questions":       { name:"Question words", lesson:"<b>τι;</b> what · <b>πού;</b> where · <b>πότε;</b> when · <b>πόσο;</b> how much · <b>πώς;</b> how · <b>ποιος;</b> who · <b>γιατί;</b> why. Greek writes the question mark as a semicolon: <b>;</b>" },
  "alphabet":        { name:"The alphabet", lesson:"The letters that lie: Ρ is r, Η is i, ν is n, Β is v, Χ is a throaty h, Υ is i. Letter teams: ου = oo, αι = e, ει and οι = i, μπ = b, ντ = d. Practise on signs: <b>ΤΑΞΙ</b>, <b>ΜΕΤΡΟ</b>, <b>ΦΑΡΜΑΚΕΙΟ</b>." },
  "greek-life":      { name:"Local Greek", lesson:"Talk like a local: <b>έλα</b> (come on / hi), <b>άντε</b> (go on!), <b>σιγά σιγά</b> (slowly, slowly), <b>τέλεια</b> (perfect), <b>κανένα πρόβλημα</b> (no problem), <b>γεια μας</b> (cheers), <b>καλή όρεξη</b> (enjoy your meal)." },
  "translation":     { name:"Translation", lesson:"Go both ways. Don't just recognise Greek → English — make yourself say the Greek from the English, out loud. That's where speaking comes from." },
  "articles":        { name:"Ο, η, το (the)", lesson:"Every noun has a gender, and «the» shows it: <b>ο καφές</b> (masculine), <b>η μπύρα</b> (feminine), <b>το νερό</b> (neuter). After a verb they often become <b>τον</b> / <b>την</b>: <b>θα ήθελα τον λογαριασμό</b>." },
  "likes":           { name:"Μου αρέσει (I like)", lesson:"<b>Μου αρέσει</b> + one thing, <b>μου αρέσουν</b> + several: <b>μου αρέσει η θάλασσα</b>, <b>μου αρέσουν οι ελιές</b>. Literally «it pleases me». <b>Δεν μου αρέσει</b> = I don't like." },
  "verbs":           { name:"Verb endings", lesson:"Most verbs share endings: <b>θέλω, θέλεις, θέλει, θέλουμε, θέλετε, θέλουν</b>. The -άω group: <b>μιλάω, μιλάς, μιλάει, μιλάμε, μιλάτε, μιλάνε</b>. The -ετε / -άτε form is also the polite «you»." },
  "past":            { name:"The past", lesson:"Learn the «I» form whole: <b>πήγα</b> I went, <b>έφαγα</b> I ate, <b>ήπια</b> I drank, <b>είδα</b> I saw, <b>έκανα</b> I did. The endings run -α, -ες, -ε, -αμε, -ατε, -αν." },
  "future":          { name:"The future with θα", lesson:"<b>θα</b> + the short verb form: <b>θα πάω</b> I'll go, <b>θα φάω</b> I'll eat, <b>θα πιω</b> I'll drink, <b>θα δω</b> I'll see. And the classic Greek answer to any plan: <b>θα δούμε</b> — we'll see." },
  "pronouns":        { name:"My, your, his…", lesson:"They go AFTER the noun: <b>το κινητό μου</b> my phone, <b>το κινητό σου</b> your phone, <b>του</b> his, <b>της</b> her, <b>μας</b> our, <b>σας</b> your (polite / plural), <b>τους</b> their." },
  "states":          { name:"How you feel", lesson:"<b>Είμαι κουρασμένος</b> (a man) / <b>κουρασμένη</b> (a woman) = I'm tired. Hunger and thirst are verbs: <b>πεινάω</b>, <b>διψάω</b>. Weather «makes»: <b>κάνει ζέστη</b> it's hot, <b>κάνει κρύο</b> it's cold." },
  "na":              { name:"να + verb", lesson:"Greek has no «to go» — it says <b>να πάω</b>. <b>Θέλω να πάω</b> I want to go · <b>Πρέπει να φύγω</b> I have to leave · <b>Μπορείς να με βοηθήσεις;</b> Can you help me? After να, use the same short form as after θα." },
  "opinions":        { name:"Opinions", lesson:"<b>Νομίζω ότι…</b> I think that · <b>Συμφωνώ</b> I agree · <b>Δεν συμφωνώ</b> I disagree · <b>Εξαρτάται</b> it depends · <b>Έχεις δίκιο</b> you're right · <b>πιο</b> + word = more: <b>πιο ακριβό</b>." },
  "imperfect":       { name:"Πήγα or πήγαινα?", lesson:"<b>πήγα</b> = I went (once, done). <b>πήγαινα</b> = I used to go / I was going (again and again, or in the background). Same pairs: <b>έφαγα / έτρωγα</b>, <b>είδα / έβλεπα</b>." }
};

/* ============================================================================
   L0 — Alphabet & first words
   ========================================================================== */
const STORIES_L0 = [

  { id:"l0-geia", level:"L0", diff:1, titleGr:"Γεια σου!", titleEn:"Hi!",
    text:"— [Γεια σου|hi / bye]! [Με λένε|my name is] Μαρία. [Εσένα πώς σε λένε|what's your name];\n— [Γεια σου|hi / bye]! [Με λένε|my name is] Sam.\n— [Χάρηκα|nice to meet you], Sam.\n— [Χάρηκα|nice to meet you], Μαρία. [Τι κάνεις|how are you];\n— [Καλά|fine / well], [ευχαριστώ|thank you]. [Εσύ|and you];\n— [Πολύ καλά|very well]!",
    quiz:[
      { q:"What is her name?", opts:["Sam","Μαρία","Ελένη"], a:1, skill:"comprehension" },
      { q:"What does «χάρηκα» mean?", opts:["nice to meet you","how are you","thank you very much"], a:0, skill:"courtesy" },
      { q:"Sam asks «Τι κάνεις;». Sam wants to know…", opts:["her name","how she is","where she's from"], a:1, skill:"vocab-daily", explain:"<b>Τι κάνεις;</b> = how are you? (literally «what are you doing?»). Answer: <b>Καλά, ευχαριστώ!</b>" },
      { q:"Type the Greek for “thank you”:", opts:[], a:["ευχαριστώ"], type:"fill", skill:"courtesy", explain:"<b>ευχαριστώ</b> = thank you. The stress is on the last syllable." }
    ]},

  { id:"l0-aerodromio", level:"L0", diff:2, titleGr:"Καλώς ήρθατε!", titleEn:"Welcome to Greece!",
    text:"[Το αεροδρόμιο|the airport] [της Αθήνας|of Athens].\n— [Καλημέρα|good morning]. [Το διαβατήριο|the passport], [παρακαλώ|please / you're welcome].\n— [Ορίστε|here you go].\n— [Τουρισμός|tourism];\n— [Ναι|yes]. [Μία εβδομάδα|one week].\n— [Καλώς ήρθατε|welcome] [στην Ελλάδα|in / to Greece]!\n— [Ευχαριστώ|thank you]!\n[Έξω|outside] [έχει|there is / there are] [ταξί|taxi].\n— [Πού πάμε|where to];\n— [Στην Πλάκα|in / to Plaka], [παρακαλώ|please / you're welcome].",
    quiz:[
      { q:"What does the officer ask for?", opts:["your ticket","your passport","your hotel"], a:1, skill:"vocab-travel" },
      { q:"How long is your trip?", opts:["one week","one day","one month"], a:0, skill:"comprehension" },
      { q:"Where does the taxi take you?", opts:["back to the airport","to Plaka","to the port"], a:1, skill:"comprehension" },
      { q:"«Τουρισμός» is a free word — English has it too. It means…", opts:["tourism","a tour bus","a tourist map"], a:0, skill:"vocab-cognates", explain:"<b>τουρισμός</b> = tourism. Lots of Greek is like this — English borrowed it." }
    ]},

  { id:"l0-kafes", level:"L0", diff:3, titleGr:"Ένα φρέντο, παρακαλώ", titleEn:"An iced coffee, please",
    text:"[Μια καφετέρια|a café] [στην Αθήνα|in Athens].\n— [Γεια σας|hello / goodbye (polite)]! [Τι θα πάρετε|what will you have];\n— [Ένα φρέντο εσπρέσο|an iced espresso (freddo)], [παρακαλώ|please / you're welcome].\n— [Σκέτο|no sugar], [μέτριο|medium sweet] [ή|or] [γλυκό|sweet];\n— [Μέτριο|medium sweet], [παρακαλώ|please / you're welcome].\n— [Κάτι άλλο|anything else];\n— [Όχι|no], [ευχαριστώ|thank you].\n— [Ορίστε|here you go].\n— [Ευχαριστώ|thank you]!\n— [Παρακαλώ|please / you're welcome].\nΜμμ… [τέλεια|perfect / great]!",
    quiz:[
      { q:"How sweet do you want your coffee?", opts:["no sugar","medium sweet","sweet"], a:1, skill:"comprehension" },
      { q:"The waiter asks «Κάτι άλλο;». It means…", opts:["anything else?","how much?","for here?"], a:0, skill:"vocab-daily" },
      { q:"You say «ευχαριστώ». The waiter answers «παρακαλώ». Here it means…", opts:["please","you're welcome","goodbye"], a:1, skill:"courtesy", trick:true, explain:"<b>παρακαλώ</b> does a lot of jobs: please, you're welcome, and «can I help you?» in shops. After a thank-you it's «you're welcome»." },
      { q:"Type the Greek for “no”:", opts:[], a:["όχι"], type:"fill", skill:"vocab-daily", explain:"<b>όχι</b> = no. And yes is <b>ναι</b> — it sounds like «neh». Really!" }
    ]},

  { id:"l0-souvlaki", level:"L0", diff:4, titleGr:"Ένα, δύο, τρία… σουβλάκια", titleEn:"One, two, three… souvlaki",
    text:"[Ένα σουβλατζίδικο|a souvlaki shop] [στο Μοναστηράκι|in Monastiraki].\n— [Καλησπέρα|good evening]! [Τι θα πάρετε|what will you have];\n— [Τρία σουβλάκια|three souvlaki] [με πίτα|in pita bread], [παρακαλώ|please / you're welcome].\n— [Τίποτα άλλο|nothing else? (= anything else?)];\n— [Και|and / also] [δύο μπύρες|two beers].\nΟ κύριος Γιώργος [μετράει|counts]: [ένα|one], [δύο|two], [τρία|three].\nΜμμ! [Πολύ νόστιμο|very tasty]!\n— [Άλλα δύο|two more], [παρακαλώ|please / you're welcome]!\n— [Μάλιστα|certainly]! [Τέσσερα|four], [πέντε|five]… [πέντε σουβλάκια|five souvlaki] [συνολικά|in total]!",
    quiz:[
      { q:"How many souvlaki do you order first?", opts:["two","three","five"], a:1, skill:"vocab-numbers" },
      { q:"What do you drink?", opts:["water","wine","beer"], a:2, skill:"vocab-food", explain:"<b>δύο μπύρες</b> = two beers. <b>η μπύρα</b> — μπ sounds like b." },
      { q:"How many souvlaki in total?", opts:["five","three","ten"], a:0, skill:"vocab-numbers", explain:"<b>τρία</b> + <b>άλλα δύο</b> (two more) = <b>πέντε</b>." },
      { q:"Type the Greek for “two”:", opts:[], a:["δύο","δυο"], type:"fill", skill:"vocab-numbers", explain:"<b>δύο</b> = two. The δ is a soft «th», like in «this»." }
    ]},

  { id:"l0-toualeta", level:"L0", diff:5, titleGr:"Πού είναι η τουαλέτα;", titleEn:"Where's the toilet?",
    text:"— [Συγγνώμη|excuse me / sorry]. [Πού είναι|where is] [η τουαλέτα|the toilet];\n— [Εκεί|there], [δεξιά|right / on the right].\n— [Εδώ|here];\n— [Όχι|no], [εκεί|there]!\n— [Ευχαριστώ|thank you]!\n[Υπάρχουν|there are] [δύο πόρτες|two doors]: «ΑΝΔΡΩΝ» [και|and / also] «ΓΥΝΑΙΚΩΝ».\n«ΑΝΔΡΩΝ» [είναι για|is for] [τους άντρες|men].\n[Προσοχή|careful]! «ΓΥΝΑΙΚΩΝ» [είναι για|is for] [τις γυναίκες|women].\n[Στον τοίχο|on the wall]: «[Τα χαρτιά στο καλάθι|paper goes in the bin], [παρακαλώ|please / you're welcome]».",
    quiz:[
      { q:"Where is the toilet?", opts:["over there, on the right","right here, on the left","upstairs"], a:0, skill:"vocab-travel" },
      { q:"You point and ask «Εδώ;». You're asking…", opts:["there?","now?","here?"], a:2, skill:"vocab-daily", explain:"<b>εδώ</b> = here · <b>εκεί</b> = there." },
      { q:"Which door is for women?", opts:["«ΑΝΔΡΩΝ»","«ΓΥΝΑΙΚΩΝ»","both"], a:1, skill:"comprehension", trick:true, explain:"<b>ΓΥΝΑΙΚΩΝ</b> = women's — think <i>gynaecologist</i>. <b>ΑΝΔΡΩΝ</b> = men's — think <i>android</i>. English borrowed both roots." },
      { q:"The sign says «Τα χαρτιά στο καλάθι». What should you do?", opts:["flush the paper","put used paper in the bin","take a paper towel"], a:1, skill:"comprehension", explain:"Greek pipes are narrow: used toilet paper goes in the little bin, not down the toilet. Hotels too — everybody does it." }
    ]},

  { id:"l0-katalaveno", level:"L0", diff:6, titleGr:"Ναι, όχι, δεν καταλαβαίνω", titleEn:"Yes, no, I don't understand",
    text:"[Στη λαϊκή|at the street market]. [Η κυρία|the lady] [μιλάει|talks] [πολύ γρήγορα|very fast].\n— [Συγγνώμη|excuse me / sorry], [δεν καταλαβαίνω|I don't understand]. [Πιο σιγά|slower], [παρακαλώ|please / you're welcome].\n— [Πόσα|how many]… [ροδάκινα|peaches];\n— Μμμ… [δεν ξέρω|I don't know]. [Μιλάτε αγγλικά|do you speak English];\n— [Λίγο|a little]… [Τρία|three];\n— [Ναι|yes]! [Τρία|three], [παρακαλώ|please / you're welcome]. [Ευχαριστώ|thank you]!",
    quiz:[
      { q:"What's the problem at the market?", opts:["the peaches are expensive","the lady talks very fast","the market is closed"], a:1, skill:"comprehension" },
      { q:"What does «ναι» mean?", opts:["no","yes","maybe"], a:1, skill:"vocab-cognates", trick:true, explain:"<b>ναι</b> = YES. It sounds like «neh» (and a bit like «nay»), but it means yes. No is <b>όχι</b>." },
      { q:"How do you ask «Do you speak English?»", opts:["Μιλάτε αγγλικά;","Δεν καταλαβαίνω.","Πόσα;"], a:0, skill:"phrases" },
      { q:"Type the Greek for “I don't understand”:", opts:[], a:["δεν καταλαβαίνω"], type:"fill", skill:"phrases", explain:"<b>δεν καταλαβαίνω</b> = I don't understand. Add <b>πιο σιγά, παρακαλώ</b> (slower, please) and you're saved." }
    ]}
];

const LESSONS_L0 = [

  { id:"l0L-alfavito1", level:"L0", diff:1, title:"Το αλφάβητο (1)", titleEn:"The alphabet, part 1: the friendly letters",
    body:"Good news: you already know about half of the Greek alphabet — from English and from maths class. Learn these and you can read your first signs today.<br><br><b>Letters that look AND sound like English:</b><br>• Α α = a, as in «father»: <b>ταξί</b> = taxi<br>• Ε ε = e, as in «pet»: <b>μετρό</b> = metro<br>• Ι ι = i, as in «see»: <b>κιλό</b> = kilo<br>• Ο ο = o: <b>μόνο</b> = only<br>• Κ κ = k: <b>καφές</b> = coffee<br>• Μ μ = m: <b>μαμά</b> = mum<br>• Τ τ = t: <b>τένις</b> = tennis<br>• Ζ ζ = z: <b>ζέβρα</b> = zebra<br><br><b>Letters you know from maths:</b><br>• Π π (pi) = p: <b>πίτσα</b> = pizza<br>• Λ λ (lambda) = l: <b>λεμόνι</b> = lemon<br>• Σ σ ς (sigma) = s. At the end of a word it's written ς: <b>σαλάτα</b> = salad, <b>καφές</b><br>• Δ δ (delta) = a soft «th», as in «this»: <b>δέκα</b> = ten<br>• Θ θ (theta) = «th», as in «thin»: <b>θέατρο</b> = theatre<br>• Φ φ (phi) = f: <b>φέτα</b> = feta<br>• Ψ ψ (psi) = ps: <b>ψάρι</b> = fish<br>• Ξ ξ (xi) = x: <b>ταξί</b><br>• Ω ω (omega) = o, same as Ο: <b>ωραία</b> = lovely<br><br>💡 The little mark ´ shows which part to stress: <b>ταξί</b> = ta-XI, <b>μετρό</b> = me-TRO. Every word of two or more syllables has one.",
    practice:[
      { q:"Read this sign: ΤΑΞΙ", opts:["taxi","tax","toxic"], a:0, skill:"alphabet", notr:true },
      { q:"Read this word: μετρό", opts:["meter","metro","motor"], a:1, skill:"alphabet", notr:true },
      { q:"Which letter makes the «p» sound?", opts:["Π","Ρ","Φ"], a:0, skill:"alphabet", notr:true, explain:"Π π is pi = p. Careful: Ρ looks like a P but it's an r (next lesson)." },
      { q:"Read this word: πίτσα", opts:["pita","pizza","piste"], a:1, skill:"alphabet", notr:true, explain:"π = p, ί = i, τσ = ts, α = a: <b>πίτσα</b> = pizza. (Pita is <b>πίτα</b>.)" },
      { q:"Type how «καφές» (coffee) sounds — Latin letters are fine:", opts:[], a:["καφές"], type:"fill", skill:"alphabet", notr:true, explain:"κ = k, α = a, φ = f, έ = e, ς = s: <b>καφές</b> = ka-FES." }
    ]},

  { id:"l0L-alfavito2", level:"L0", diff:2, title:"Το αλφάβητο (2)", titleEn:"The alphabet, part 2: the tricky letters",
    body:"These look like English letters but LIE. Learn them and you can read everything.<br><br>• Ρ ρ = <b>r</b> (not p!): <b>Ρόδος</b> = Rhodes<br>• Η η = <b>i</b> (not h!): <b>νησί</b> = island<br>• Ν ν = <b>n</b> — small ν looks like a v: <b>νερό</b> = water<br>• Υ υ = <b>i</b> (not y): <b>μύθος</b> = myth<br>• Χ χ = a throaty <b>h</b> (not x!): <b>όχι</b> = no<br>• Β β = <b>v</b> (not b!): <b>βανίλια</b> = vanilla<br>• Γ γ = a soft g, and before e or i sounds it's a y: <b>γάλα</b> = milk, <b>γεια</b> = hi<br><br><b>Letter teams — two letters, one sound:</b><br>• ου = oo: <b>μουσική</b> = music<br>• αι = e: <b>και</b> = and<br>• ει and οι = i: <b>είναι</b> = is<br>• μπ = b: <b>μπύρα</b> = beer<br>• ντ = d: <b>ντομάτα</b> = tomato<br>• αυ / ευ = av / ev (or af / ef): <b>ευχαριστώ</b> = thank you<br><br>💡 And the strangest one: the Greek question mark is <b>;</b> — a semicolon. «Πού;» = Where?",
    practice:[
      { q:"The Greek letter Ρ sounds like…", opts:["p","r","b"], a:1, skill:"alphabet", notr:true, explain:"Ρ ρ = r. It's the one that fools everybody." },
      { q:"Read this word: νερό (water)", opts:["vero","nero","hero"], a:1, skill:"alphabet", notr:true, explain:"Small ν is an n, not a v: <b>νερό</b> = ne-RO." },
      { q:"Which spelling makes a «b» sound?", opts:["β","μπ","π"], a:1, skill:"alphabet", notr:true, explain:"β is v. For b, Greek writes μπ: <b>μπύρα</b> = beer." },
      { q:"What does this sign say? ΜΠΥΡΑ", opts:["beer","mirror","pear"], a:0, skill:"alphabet", notr:true, explain:"ΜΠ = b, Υ = i, Ρ = r, Α = a → «bira»: <b>μπύρα</b>, beer." },
      { q:"A Greek sentence ends with «;». It's…", opts:["a question","a list","a quote"], a:0, skill:"alphabet", notr:true, explain:"The Greek question mark looks like our semicolon. <b>Τι κάνεις;</b> = How are you?" }
    ]},

  { id:"l0L-dorean", level:"L0", diff:3, title:"Δωρεάν λέξεις", titleEn:"Free words — English is full of Greek",
    body:"You already know hundreds of Greek words — English borrowed them. Read these out loud and you'll recognise them:<br>• <b>τηλέφωνο</b> = telephone<br>• <b>μουσική</b> = music<br>• <b>θέατρο</b> = theatre<br>• <b>μουσείο</b> = museum<br>• <b>φαρμακείο</b> = pharmacy (look for the green cross)<br>• <b>πρόβλημα</b> = problem<br>• <b>ιδέα</b> = idea<br>• <b>φωτογραφία</b> = photo<br>• <b>κέντρο</b> = centre<br>• <b>ΕΞΟΔΟΣ</b> = exit (think «exodus») · <b>ΕΙΣΟΔΟΣ</b> = entrance<br><br>⚠️ <b>The one trap everybody falls into:</b><br>• <b>ναι</b> = YES (it sounds like «neh»)<br>• <b>όχι</b> = no (it sounds a bit like «OK» — it isn't!)<br><br>💡 Greeks often nod UP for no, with a little click of the tongue. A nod down or a tilt of the head means yes.",
    practice:[
      { q:"«Φαρμακείο» means…", opts:["a farm","a pharmacy","a market"], a:1, skill:"vocab-cognates" },
      { q:"The sign over the door says ΕΞΟΔΟΣ. That's…", opts:["the exit","the entrance","the toilet"], a:0, skill:"vocab-cognates", explain:"<b>έξοδος</b> = exit — like «exodus». The entrance is <b>είσοδος</b>." },
      { q:"«Πρόβλημα» means…", opts:["programme","problem","profile"], a:1, skill:"vocab-cognates" },
      { q:"Your Greek friend says «όχι». She means…", opts:["OK","no","yes"], a:1, skill:"vocab-cognates", trick:true, explain:"<b>όχι</b> = no, even though it sounds a bit like «OK». Yes is <b>ναι</b>." },
      { q:"Translate into Greek: «music»", opts:["μουσείο","μουσική","μύθος"], a:1, skill:"translation", explain:"<b>μουσική</b> = music. <b>μουσείο</b> = museum, <b>μύθος</b> = myth." }
    ]},

  { id:"l0L-magikes", level:"L0", diff:4, title:"Μαγικές λέξεις", titleEn:"Magic words",
    body:"Three words that open every door:<br>• <b>παρακαλώ</b> = please — and also «you're welcome», and «can I help you?» in shops<br>• <b>ευχαριστώ</b> = thank you · <b>ευχαριστώ πολύ</b> = thank you very much<br>• <b>συγγνώμη</b> = sorry / excuse me<br><br>Hello and goodbye:<br>• <b>γεια σου</b> = hi / bye, to one friend<br>• <b>γεια σας</b> = hello / goodbye, polite — or to a group<br>• <b>καλημέρα</b> = good morning (until early afternoon)<br>• <b>καλησπέρα</b> = good evening (from late afternoon)<br>• <b>καληνύχτα</b> = good night (only when leaving or going to bed)<br><br>💡 <b>σου</b> or <b>σας</b>? Use <b>γεια σας</b> with a shopkeeper, a waiter, anyone older, or a group; <b>γεια σου</b> with a friend or a kid. The phrases this app teaches for shops and taxis (<b>Έχετε…;</b>, <b>Μιλάτε αγγλικά;</b>) are already the polite form.",
    practice:[
      { q:"You walk into a shop at 10 a.m. You say…", opts:["καλημέρα","καληνύχτα","καλησπέρα"], a:0, skill:"courtesy" },
      { q:"You're leaving a taverna at 11 p.m. to go to bed. You say…", opts:["καλημέρα","καληνύχτα","χάρηκα"], a:1, skill:"courtesy", explain:"<b>καληνύχτα</b> is for leaving at night. Arriving in the evening, it's <b>καλησπέρα</b>." },
      { q:"You greet an older shopkeeper. You say…", opts:["γεια σου","γεια σας","γεια μας"], a:1, skill:"courtesy", explain:"<b>γεια σας</b> is the polite one. <b>γεια μας</b> means «cheers!» — save it for the drinks." },
      { q:"Translate: «συγγνώμη»", opts:["sorry / excuse me","thank you","please"], a:0, skill:"translation" },
      { q:"Type the Greek for “please”:", opts:[], a:["παρακαλώ"], type:"fill", skill:"translation", explain:"<b>παρακαλώ</b> = please (and you're welcome)." }
    ]},

  { id:"l0L-arithmoi", level:"L0", diff:5, title:"Αριθμοί 0–10", titleEn:"Numbers 0–10",
    body:"<b>μηδέν</b> 0 · <b>ένα</b> 1 · <b>δύο</b> 2 · <b>τρία</b> 3 · <b>τέσσερα</b> 4 · <b>πέντε</b> 5 · <b>έξι</b> 6 · <b>επτά</b> 7 · <b>οκτώ</b> 8 · <b>εννιά</b> 9 · <b>δέκα</b> 10<br><br>You'll also hear <b>εφτά</b> for 7, <b>οχτώ</b> for 8 and <b>εννέα</b> for 9 — same numbers, both are fine.<br><br>💡 «One» changes with the thing: <b>ένας καφές</b> (a coffee), <b>μία μπύρα</b> (a beer), <b>ένα νερό</b> (a water). Three and four do it too: <b>τρεις μπύρες</b>, <b>τρία νερά</b>. Mix them up and people still understand — hold up fingers and smile.",
    practice:[
      { q:"What number is «πέντε»?", opts:["5","15","50"], a:0, skill:"vocab-numbers" },
      { q:"How do you say 8?", opts:["οκτώ","έξι","δέκα"], a:0, skill:"vocab-numbers" },
      { q:"«Εννιά» is…", opts:["7","9","10"], a:1, skill:"vocab-numbers" },
      { q:"Translate: «δύο νερά»", opts:["two waters","ten waters","two wines"], a:0, skill:"translation" },
      { q:"Type the number 10 in Greek:", opts:[], a:["δέκα"], type:"fill", skill:"vocab-numbers", explain:"<b>δέκα</b> = 10 — like «decade»." }
    ]}

];

/* ============================================================================
   L1 — First steps (survival)
   ========================================================================== */
const STORIES_L1 = [

  { id:"l1-taverna", level:"L1", diff:1, titleGr:"Στην ταβέρνα", titleEn:"At the taverna",
    text:"[Μια ταβέρνα|a taverna] [στην Πλάκα|in / to Plaka]. [Ο σερβιτόρος|the waiter] [έρχεται|comes over].\n— [Καλησπέρα|good evening]! [Ο κατάλογος|the menu].\n— [Ευχαριστούμε|thank you (from us)]. [Θα θέλαμε|we'd like] [μια χωριάτικη|a Greek salad], [ένα τζατζίκι|a tzatziki] [και|and / also] [έναν μουσακά|a moussaka].\n— [Ωραία|nice / lovely]. [Και|and / also] [για να πιείτε|to drink];\n— [Μισό κιλό|half a kilo] [λευκό κρασί|white wine], [παρακαλώ|please / you're welcome].\n— [Αμέσως|right away]!\n[Μετά από λίγο|a little later]:\n— [Καλή όρεξη|enjoy your meal]!\n— [Γεια μας|cheers]!",
    quiz:[
      { q:"How do you order the house wine?", opts:["by the glass","by the kilo","by the bottle"], a:1, skill:"comprehension", trick:true, explain:"House wine comes in a metal jug, ordered by weight: <b>μισό κιλό</b> is about half a litre. Very normal — and usually good." },
      { q:"What does «Καλή όρεξη!» mean?", opts:["cheers!","enjoy your meal!","good night!"], a:1, skill:"vocab-food" },
      { q:"«Χωριάτικη» is…", opts:["a Greek salad","a cheese pie","a grilled fish"], a:0, skill:"vocab-food", explain:"<b>χωριάτικη</b> (village salad): tomato, cucumber, onion, olives and a slab of feta on top." },
      { q:"Type the Greek for “cheers!”:", opts:[], a:["γεια μας","στην υγειά μας"], type:"fill", skill:"greek-life", explain:"<b>Γεια μας!</b> = cheers! (literally «our health»). Look people in the eye when you clink." }
    ]},

  { id:"l1-periptero", level:"L1", diff:2, titleGr:"Στο περίπτερο", titleEn:"At the kiosk",
    text:"[Το περίπτερο|the kiosk] [είναι|is / are] [παντού|everywhere] [στην Ελλάδα|in / to Greece].\n— [Γεια σας|hello / goodbye (polite)]! [Ένα νερό|a (bottle of) water], [παρακαλώ|please / you're welcome].\n— [Μικρό|small] [ή|or] [μεγάλο|big];\n— [Μεγάλο|big]. [Έχετε|do you have] [αντηλιακό|sunscreen];\n— [Όχι|no], [δεν έχουμε|we don't have it]. [Το σούπερ μάρκετ|the supermarket] [είναι|is / are] [εκεί|there].\n— [Εντάξει|OK]. [Πόσο κάνει|how much is it];\n— [Ένα ευρώ|one euro].\n— [Ορίστε|here you go].\n— [Ευχαριστώ|thank you], [γεια σας|hello / goodbye (polite)]!",
    quiz:[
      { q:"What do you buy at the kiosk?", opts:["a big water","a small water","sunscreen"], a:0, skill:"comprehension" },
      { q:"Why don't you get sunscreen there?", opts:["it's too expensive","they don't have it","the kiosk is closed"], a:1, skill:"comprehension" },
      { q:"«Πόσο κάνει;» means…", opts:["how much is it?","how big is it?","where is it?"], a:0, skill:"phrases" },
      { q:"Type the Greek for “OK”:", opts:[], a:["εντάξει"], type:"fill", skill:"vocab-daily", explain:"<b>εντάξει</b> = OK. Greeks say it all day long." }
    ]},

  { id:"l1-taxi", level:"L1", diff:3, titleGr:"Το ταξί", titleEn:"The taxi",
    text:"— [Καλημέρα|good morning]. [Στον Πειραιά|to Piraeus], [στο λιμάνι|at / to the port], [παρακαλώ|please / you're welcome].\n— [Ποια πύλη|which gate];\n— [Δεν ξέρω|I don't know]… [Το πλοίο|the ferry] [για Νάξο|to Naxos].\n— [Εντάξει|OK], [ξέρω|I know]. [Πάμε|let's go]!\n[Μισή ώρα|half an hour] [αργότερα|later]:\n— [Φτάσαμε|we're here]. [Τριάντα ευρώ|thirty euros].\n— [Με κάρτα|by card];\n— [Ναι|yes], [βεβαίως|of course].\n— [Ευχαριστώ|thank you]!\n— [Καλό ταξίδι|have a good trip]!",
    quiz:[
      { q:"Where are you going?", opts:["the airport","the port of Piraeus","Plaka"], a:1, skill:"vocab-travel" },
      { q:"The driver asks «Ποια πύλη;». He wants to know…", opts:["which gate","which hotel","which day"], a:0, skill:"questions" },
      { q:"How much is the ride?", opts:["€13","€30","€3"], a:1, skill:"vocab-numbers", explain:"<b>τριάντα</b> = 30. (13 is <b>δεκατρία</b>.)" },
      { q:"How do you pay?", opts:["cash","by card","you don't pay"], a:1, skill:"comprehension" }
    ]},

  { id:"l1-xenodoxeio", level:"L1", diff:4, titleGr:"Στο ξενοδοχείο", titleEn:"At the hotel",
    text:"[Στη Νάξο|in / to Naxos]. [Το ξενοδοχείο|the hotel] «Ήλιος».\n— [Καλησπέρα|good evening]. [Έχω|I have] [μια κράτηση|a booking]. [Με λένε|my name is] Sam Brown.\n— [Μάλιστα|certainly]… [Ένα δίκλινο|a double room], [τρεις νύχτες|three nights]. [Το διαβατήριό σας|your passport], [παρακαλώ|please / you're welcome].\n— [Ορίστε|here you go].\n— [Ευχαριστώ|thank you]. [Το δωμάτιο|the room] [είναι|is / are] [το δώδεκα|number twelve].\n— [Τι ώρα|what time] [είναι|is / are] [το πρωινό|breakfast];\n— [Από τις οκτώ|from eight] [μέχρι τις δέκα|until ten].\n— [Και|and / also] το Wi-Fi;\n— [Ο κωδικός|the password] [είναι|is / are] [στο δωμάτιο|in the room]. [Καλή διαμονή|enjoy your stay]!",
    quiz:[
      { q:"How many nights are you staying?", opts:["two","three","twelve"], a:1, skill:"comprehension" },
      { q:"What's your room number?", opts:["10","12","8"], a:1, skill:"vocab-numbers", explain:"<b>δώδεκα</b> = 12 (think «dodecagon», a 12-sided shape)." },
      { q:"When is breakfast?", opts:["from 8 to 10","from 10 to 12","from 7 to 8"], a:0, skill:"vocab-numbers" },
      { q:"«Καλή διαμονή!» means…", opts:["enjoy your stay!","good night!","see you tomorrow!"], a:0, skill:"courtesy" }
    ]},

  { id:"l1-farmakeio", level:"L1", diff:5, titleGr:"Στο φαρμακείο", titleEn:"At the pharmacy",
    text:"[Ο ήλιος|the sun] [καίει|burns]! [Στο φαρμακείο|at the pharmacy]:\n— [Καλημέρα|good morning]. [Κάηκα|I got burnt] [από τον ήλιο|by the sun]. [Έχετε|do you have] [κάτι|something];\n— [Ναι|yes], [αυτή την κρέμα|this cream]. [Δύο φορές|twice] [την ημέρα|a day].\n— [Έχω|I have] [και|and / also] [πονοκέφαλο|a headache]. [Έχετε|do you have] [παρακεταμόλη|paracetamol];\n— [Βεβαίως|of course].\n— [Πόσο κάνουν|how much are] [όλα μαζί|altogether];\n— [Δεκαπέντε ευρώ|fifteen euros].\n— [Ευχαριστώ πολύ|thank you very much]!\n— [Περαστικά|get well soon]!",
    quiz:[
      { q:"Why do you go to the pharmacy?", opts:["sunburn and a headache","a cough","a mosquito bite"], a:0, skill:"comprehension" },
      { q:"How often do you use the cream?", opts:["once a day","twice a day","every hour"], a:1, skill:"comprehension" },
      { q:"The pharmacist says «Περαστικά!». It means…", opts:["get well soon!","next, please!","see you!"], a:0, skill:"courtesy", explain:"<b>Περαστικά!</b> = get well soon — say it to anyone who's ill." },
      { q:"Type the Greek for “do you have…?” (polite):", opts:[], a:["έχετε"], type:"fill", skill:"phrases", explain:"<b>Έχετε…;</b> — swap any noun in: <b>Έχετε νερό;</b> <b>Έχετε αντηλιακό;</b> Ask for medicine by its name, like here." }
    ]},

  { id:"l1-logariasmos", level:"L1", diff:6, titleGr:"Τον λογαριασμό, παρακαλώ", titleEn:"The bill, please",
    text:"[Μετά το φαγητό|after the meal]:\n— [Συγγνώμη|excuse me / sorry]! [Τον λογαριασμό|the bill], [παρακαλώ|please / you're welcome].\n— [Αμέσως|right away]! [Και|and / also] [ένα γλυκό|a dessert] — [κέρασμα|on the house]!\n— [Τέλεια|perfect / great]! [Ευχαριστούμε|thank you (from us)]!\n[Ο λογαριασμός|the bill]: [σαράντα έξι ευρώ|forty-six euros]. [Δίνεις|you hand over] [πενήντα|fifty].\n— [Κρατήστε τα ρέστα|keep the change].\n— [Να είστε καλά|thank you, be well]! [Καληνύχτα|good night]!",
    quiz:[
      { q:"What does the waiter bring for free?", opts:["a coffee","a dessert","a bottle of wine"], a:1, skill:"comprehension", explain:"<b>κέρασμα</b> = a treat on the house. Very common after a meal in Greece — enjoy it." },
      { q:"How much is the bill?", opts:["€46","€50","€64"], a:0, skill:"vocab-numbers", explain:"<b>σαράντα έξι</b> = forty + six = 46." },
      { q:"How much do you leave as a tip?", opts:["nothing","€4","€10"], a:1, skill:"vocab-numbers", trick:true, explain:"You hand over <b>πενήντα</b> (50) for a bill of 46 and say «keep the change» — that's a €4 tip, a normal 5–10%." },
      { q:"Type the Greek for “the bill” (as in «the bill, please»):", opts:[], a:["τον λογαριασμό","λογαριασμό","ο λογαριασμός","λογαριασμός"], type:"fill", skill:"phrases", explain:"<b>Τον λογαριασμό, παρακαλώ.</b> The bill won't come until you ask — rushing you would be rude." }
    ]}
];

const LESSONS_L1 = [

  { id:"l1L-thelo", level:"L1", diff:1, title:"Θα ήθελα…", titleEn:"Asking for things",
    body:"Learn the chunk, swap the noun:<br>• <b>Θα ήθελα</b> ___ = I'd like ___ (polite — use this one)<br>• <b>Θέλω</b> ___ = I want ___ (fine with friends, a bit blunt with a waiter)<br>• <b>Έχετε</b> ___; = do you have ___?<br>• <b>Μπορώ να έχω</b> ___; = can I have ___?<br>• <b>Υπάρχει</b> ___ <b>εδώ κοντά</b>; = is there a ___ nearby?<br>• <b>Πού είναι</b> ___; = where is ___?<br>• <b>Πόσο κάνει;</b> = how much is it?<br><br>Swap in anything: <b>θα ήθελα έναν καφέ</b> · <b>θα ήθελα μια μπύρα</b> · <b>θα ήθελα ένα νερό</b><br><br>💡 <b>Υπάρχει φαρμακείο εδώ κοντά;</b> (Is there a pharmacy nearby?) works for anything: an ATM, a bakery, a beach.",
    practice:[
      { q:"The most polite way to order is…", opts:["Θέλω έναν καφέ.","Θα ήθελα έναν καφέ.","Καφέ!"], a:1, skill:"phrases" },
      { q:"«Υπάρχει φαρμακείο εδώ κοντά;» means…", opts:["Is there a pharmacy nearby?","Where's the pharmacy?","The pharmacy is near here."], a:0, skill:"phrases" },
      { q:"Translate: «Do you have water?»", opts:["Έχετε νερό;","Θέλω νερό.","Πού είναι το νερό;"], a:0, skill:"translation" },
      { q:"You want to ask the price. You say…", opts:["Πόσο κάνει;","Τι κάνεις;","Πού είναι;"], a:0, skill:"phrases", trick:true, explain:"<b>Πόσο κάνει;</b> = how much is it? Careful: <b>Τι κάνεις;</b> = how are you?" },
      { q:"Type the Greek for “I'd like” (polite):", opts:[], a:["θα ήθελα"], type:"fill", skill:"phrases", explain:"<b>θα ήθελα</b> = I would like." }
    ]},

  { id:"l1L-arithmoi", level:"L1", diff:2, title:"Αριθμοί και ευρώ", titleEn:"Numbers 11–100 & euros",
    body:"<b>11–12</b> have their own names: <b>έντεκα</b> (11), <b>δώδεκα</b> (12).<br><br><b>13–19</b> are «ten» + the number, squished together: <b>δεκατρία</b> (13), <b>δεκατέσσερα</b> (14), <b>δεκαπέντε</b> (15), <b>δεκαέξι</b> (16), <b>δεκαεφτά</b> (17), <b>δεκαοχτώ</b> (18), <b>δεκαεννιά</b> (19).<br><br><b>The tens:</b> <b>είκοσι</b> 20 · <b>τριάντα</b> 30 · <b>σαράντα</b> 40 · <b>πενήντα</b> 50 · <b>εξήντα</b> 60 · <b>εβδομήντα</b> 70 · <b>ογδόντα</b> 80 · <b>ενενήντα</b> 90 · <b>εκατό</b> 100<br><br>Then just add: <b>είκοσι πέντε</b> = 25, <b>σαράντα έξι</b> = 46.<br><br><b>Money:</b> <b>ευρώ</b> never changes (ένα ευρώ, δέκα ευρώ). Cents are <b>λεπτά</b>: €2.50 = <b>δύο ευρώ και πενήντα</b>.<br><br>💡 Ask <b>Πόσο κάνει;</b> and if the answer flies past you, hold out your phone's calculator. Everybody does it.",
    practice:[
      { q:"What number is «δεκαπέντε»?", opts:["5","15","50"], a:1, skill:"vocab-numbers" },
      { q:"How do you say 30?", opts:["τριάντα","τρία","δεκατρία"], a:0, skill:"vocab-numbers" },
      { q:"«Σαράντα έξι ευρώ» is…", opts:["€46","€64","€16"], a:0, skill:"vocab-numbers" },
      { q:"Translate: «εκατό»", opts:["10","100","1,000"], a:1, skill:"translation" },
      { q:"Type the number 20 in Greek:", opts:[], a:["είκοσι"], type:"fill", skill:"vocab-numbers", explain:"<b>είκοσι</b> = 20 (like «icosahedron», the 20-sided die)." }
    ]},

  { id:"l1L-erotiseis", level:"L1", diff:3, title:"Ερωτήσεις", titleEn:"Question words",
    body:"• <b>τι;</b> = what?<br>• <b>πού;</b> = where?<br>• <b>πότε;</b> = when?<br>• <b>πόσο;</b> = how much? · <b>πόσα;</b> = how many?<br>• <b>πώς;</b> = how?<br>• <b>ποιος;</b> = who? / which?<br>• <b>γιατί;</b> = why? — and the answer starts with <b>γιατί</b> too: it also means «because»!<br>• <b>τι ώρα;</b> = what time?<br><br>💡 The Greek question mark is <b>;</b>. And watch the accent: <b>πού;</b> = where?, but <b>που</b> without it means «that / which».",
    practice:[
      { q:"«Πού είναι η παραλία;» asks…", opts:["where the beach is","when the beach opens","how far the beach is"], a:0, skill:"questions" },
      { q:"«Γιατί;» means…", opts:["why?","who?","when?"], a:0, skill:"questions" },
      { q:"Your friend answers «Γιατί είμαι κουρασμένος». Here «γιατί» means…", opts:["because","why","but"], a:0, skill:"questions", trick:true, explain:"<b>γιατί</b> is both «why?» and «because». The question mark tells you which." },
      { q:"Translate: «Τι ώρα;»", opts:["What time?","How much?","What's that?"], a:0, skill:"translation" },
      { q:"Type the Greek for “where?”:", opts:[], a:["πού"], type:"fill", skill:"questions", explain:"<b>πού;</b> = where? <b>Πού είναι…;</b> = where is…?" }
    ]},

  { id:"l1L-arthra", level:"L1", diff:4, title:"Ο, η, το", titleEn:"«The» and gender",
    body:"Every Greek noun is masculine, feminine or neuter — and «the» tells you which:<br>• <b>ο</b> (masculine): <b>ο καφές</b> the coffee, <b>ο λογαριασμός</b> the bill — often ends in -ος, -ας, -ης<br>• <b>η</b> (feminine): <b>η μπύρα</b> the beer, <b>η παραλία</b> the beach — often ends in -α, -η<br>• <b>το</b> (neuter): <b>το νερό</b> the water, <b>το ταξί</b>, <b>το σουβλάκι</b> — often ends in -ο, -ι, -μα<br><br>«A / one» follows the same pattern: <b>ένας καφές</b> · <b>μία μπύρα</b> · <b>ένα νερό</b><br><br>💡 After a verb, ο and η change a little: <b>θα ήθελα τον λογαριασμό</b>, <b>έχετε την κρέμα;</b>. That's why the stories say <b>τον</b> and <b>την</b>. Get it wrong and people still understand — keep talking.",
    practice:[
      { q:"Which is right?", opts:["ο μπύρα","η μπύρα","το μπύρα"], a:1, skill:"articles", explain:"<b>μπύρα</b> ends in -α → feminine → <b>η μπύρα</b>." },
      { q:"In «το νερό», the word νερό is…", opts:["masculine","feminine","neuter"], a:2, skill:"articles" },
      { q:"How do you say «a coffee»?", opts:["ένας καφές","μία καφές","ένα καφές"], a:0, skill:"articles", explain:"<b>ο καφές</b> is masculine, so «a coffee» is <b>ένας καφές</b>." },
      { q:"Asking for the bill: «Θα ήθελα ___ λογαριασμό.»", opts:["ο","τον","το"], a:1, skill:"articles", explain:"After the verb, <b>ο</b> becomes <b>τον</b>: <b>θα ήθελα τον λογαριασμό</b>." },
      { q:"Translate: «η παραλία»", opts:["the beach","a beach","the pool"], a:0, skill:"translation" }
    ]}

];

/* ============================================================================
   L2 — On the road
   ========================================================================== */
const STORIES_L2 = [

  { id:"l2-ploio", level:"L2", diff:1, titleGr:"Το πλοίο για Σαντορίνη", titleEn:"The ferry to Santorini",
    text:"[Στο πρακτορείο|at the ticket office] [στο λιμάνι|at / to the port] [της Νάξου|of Naxos].\n— [Καλημέρα|good morning]. [Δύο εισιτήρια|two tickets] [για Σαντορίνη|to Santorini], [παρακαλώ|please / you're welcome].\n— [Για σήμερα|for today];\n— [Ναι|yes]. [Τι ώρα|what time] [φεύγει|leaves] [το πλοίο|the ferry];\n— [Στις επτά και μισή|at seven thirty]. [Φτάνει|it arrives] [στις εννιά και μισή|at nine thirty].\n— [Πόσο κάνει|how much is it];\n— [Ογδόντα ευρώ|eighty euros] [τα δύο|for the two].\n— [Εντάξει|OK]. [Από ποια πύλη|from which gate];\n— [Δεν έχει πύλη|there's no gate] [εδώ|here]! [Να είστε στο λιμάνι|be at the port] [μισή ώρα νωρίτερα|half an hour early].",
    quiz:[
      { q:"Where are you going?", opts:["Santorini","Piraeus","Crete"], a:0, skill:"vocab-travel" },
      { q:"What time does the ferry leave?", opts:["7:30","7:00","9:30"], a:0, skill:"vocab-numbers", explain:"<b>στις επτά και μισή</b> = at seven and a half = 7:30." },
      { q:"How much does ONE ticket cost?", opts:["€80","€40","€18"], a:1, skill:"vocab-numbers", trick:true, explain:"<b>ογδόντα ευρώ τα δύο</b> = 80 for the two of you — so 40 each." },
      { q:"When should you be at the port?", opts:["half an hour early","an hour early","at 9:30"], a:0, skill:"comprehension" }
    ]},

  { id:"l2-paralia", level:"L2", diff:2, titleGr:"Στην παραλία", titleEn:"At the beach",
    text:"[Μια παραλία|a beach] [στη Νάξο|in / to Naxos]. [Ο ήλιος|the sun] [καίει|burns].\n— [Συγγνώμη|excuse me / sorry], [πόσο κάνουν|how much are] [οι ξαπλώστρες|the sunbeds];\n— [Δέκα ευρώ|ten euros] [με την ομπρέλα|with the umbrella]. [Αλλά|but] [αν πάρετε κάτι από το μπαρ|if you order something from the bar], [είναι δωρεάν|they're free].\n— [Τέλεια|perfect / great]! [Δύο φραπέ|two frappés], [παρακαλώ|please / you're welcome].\n— [Μάλιστα|certainly]! [Κάτι άλλο|anything else];\n— [Όχι|no], [ευχαριστώ|thank you].\n[Η θάλασσα|the sea] [είναι|is / are] [κρύα|cold] [αλλά|but] [πεντακάθαρη|crystal clear]. [Σιγά σιγά|slowly, slowly]… [μέσα|in you go]!",
    quiz:[
      { q:"How much are the sunbeds if you don't order anything?", opts:["they're free","€10","€2"], a:1, skill:"vocab-numbers" },
      { q:"How do you get the sunbeds for free?", opts:["come early","order something from the bar","bring your own umbrella"], a:1, skill:"comprehension" },
      { q:"What is the sea like?", opts:["warm and calm","cold but crystal clear","dirty"], a:1, skill:"comprehension" },
      { q:"«Σιγά σιγά» means…", opts:["hurry up","slowly, slowly","quiet, please"], a:1, skill:"greek-life", explain:"<b>σιγά σιγά</b> = slowly, slowly — the island motto. Into cold water, and through life." }
    ]},

  { id:"l2-fournos", level:"L2", diff:3, titleGr:"Στον φούρνο", titleEn:"At the bakery",
    text:"[Πρωί|morning]. [Ο φούρνος|the bakery] [μυρίζει|smells] [υπέροχα|wonderful].\n— [Καλημέρα|good morning]! [Τι είναι αυτό|what's this];\n— [Σπανακόπιτα|spinach pie]. [Κι αυτή|and this one] [είναι|is / are] [τυρόπιτα|cheese pie].\n— [Μου αρέσει|I like] [το τυρί|cheese]. [Μία τυρόπιτα|one cheese pie], [παρακαλώ|please / you're welcome]. [Και|and / also] [ένα κουλούρι|a sesame bread ring].\n— [Για εδώ|for here] [ή|or] [για πακέτο|to go];\n— [Για πακέτο|to go].\n— [Ορίστε|here you go]. [Τρία ευρώ|three euros].\n— [Ευχαριστώ|thank you]!\n— [Καλή συνέχεια|have a good day]!",
    quiz:[
      { q:"What is «σπανακόπιτα»?", opts:["cheese pie","spinach pie","sesame bread"], a:1, skill:"vocab-food", explain:"<b>σπανάκι</b> (spinach) + <b>πίτα</b> (pie) = <b>σπανακόπιτα</b>." },
      { q:"What do you buy?", opts:["a spinach pie","a cheese pie and a koulouri","two coffees"], a:1, skill:"comprehension" },
      { q:"«Για πακέτο» means…", opts:["for here","to go","in a bag"], a:1, skill:"phrases" },
      { q:"Type the Greek for “I like” (+ one thing):", opts:[], a:["μου αρέσει"], type:"fill", skill:"likes", explain:"<b>Μου αρέσει το τυρί.</b> = I like cheese." }
    ]},

  { id:"l2-laiki", level:"L2", diff:4, titleGr:"Στη λαϊκή", titleEn:"At the street market",
    text:"[Κάθε Σάββατο|every Saturday] [έχει|there is / there are] [λαϊκή|a street market].\n— [Ντομάτες|tomatoes]! [Φρέσκες ντομάτες|fresh tomatoes]! [Ένα ευρώ|one euro] [το κιλό|a kilo]!\n— [Καλημέρα|good morning]. [Ένα κιλό ντομάτες|a kilo of tomatoes], [παρακαλώ|please / you're welcome].\n— [Ορίστε|here you go]. [Τίποτα άλλο|nothing else? (= anything else?)];\n— [Ναι|yes], [μισό κιλό|half a kilo] [σταφύλια|grapes]. [Είναι γλυκά|are they sweet];\n— [Σαν μέλι|like honey]! [Δοκίμασε|try one]!\n— Μμμ… [πολύ γλυκά|very sweet]!\n— [Δύο ευρώ|two euros] [όλα|altogether]. [Και|and / also] [λίγο μαϊντανό|a bit of parsley] — [δώρο|a gift]!",
    quiz:[
      { q:"How much are the tomatoes?", opts:["€1 a kilo","€2 a kilo","€1 each"], a:0, skill:"vocab-numbers" },
      { q:"How many grapes do you buy?", opts:["a kilo","half a kilo","two kilos"], a:1, skill:"comprehension" },
      { q:"What do you get for free?", opts:["grapes","parsley","a tomato"], a:1, skill:"comprehension", explain:"<b>δώρο</b> = a gift. Market sellers love to throw in a bunch of herbs." },
      { q:"«Σαν μέλι» means…", opts:["like honey","a little sweet","not ripe yet"], a:0, skill:"vocab-food" }
    ]},

  { id:"l2-portara", level:"L2", diff:5, titleGr:"Πού είναι η Πορτάρα;", titleEn:"Where's the Portara?",
    text:"[Στη Χώρα|in Chora (the island's main town)] [της Νάξου|of Naxos].\n— [Συγγνώμη|excuse me / sorry], [πού είναι|where is] [η Πορτάρα|the Portara (the giant marble gate)];\n— [Είναι κοντά|it's close]. [Πηγαίνετε|go] [ευθεία|straight ahead] [μέχρι το λιμάνι|as far as the port]. [Μετά|then / after] [αριστερά|left], [και|and / also] [ανεβαίνετε|you go up] [στο νησάκι|onto the little island].\n— [Είναι μακριά|is it far];\n— [Όχι|no], [δέκα λεπτά|ten minutes] [με τα πόδια|on foot].\n— [Ευχαριστώ πολύ|thank you very much]!\n— [Τίποτα|don't mention it]! [Καλή βόλτα|enjoy your walk]!",
    quiz:[
      { q:"Is the Portara far?", opts:["yes, an hour away","no, ten minutes on foot","you need a taxi"], a:1, skill:"comprehension" },
      { q:"At the port, you turn…", opts:["right","left","back"], a:1, skill:"vocab-travel" },
      { q:"«Ευθεία» means…", opts:["straight ahead","on the right","upstairs"], a:0, skill:"vocab-travel" },
      { q:"Type the Greek for “left” (the direction):", opts:[], a:["αριστερά"], type:"fill", skill:"vocab-travel", explain:"<b>αριστερά</b> = left · <b>δεξιά</b> = right · <b>ευθεία</b> = straight on." }
    ]},

  { id:"l2-mixanaki", level:"L2", diff:6, titleGr:"Ένα μηχανάκι", titleEn:"Renting a scooter",
    text:"[Ένα γραφείο ενοικιάσεων|a rental office].\n— [Γεια σας|hello / goodbye (polite)]. [Θα ήθελα|I'd like] [να νοικιάσω|to rent] [ένα μηχανάκι|a scooter].\n— [Για πόσες μέρες|for how many days];\n— [Για τρεις μέρες|for three days]. [Πόσο κάνει|how much is it];\n— [Είκοσι πέντε ευρώ|twenty-five euros] [τη μέρα|a day]. [Έχετε δίπλωμα|do you have a licence];\n— [Ναι|yes], [ορίστε|here you go].\n— [Το κράνος|the helmet] — [πάντα|always]! [Η βενζίνη|the petrol] [δεν περιλαμβάνεται|isn't included].\n— [Εντάξει|OK]. [Πού είναι|where is] [το βενζινάδικο|the petrol station];\n— [Δίπλα στο σούπερ μάρκετ|next to the supermarket].",
    quiz:[
      { q:"How long do you rent the scooter for?", opts:["one day","three days","a week"], a:1, skill:"comprehension" },
      { q:"How much is it per day?", opts:["€25","€52","€20"], a:0, skill:"vocab-numbers" },
      { q:"What does the man say about the petrol?", opts:["it's included","it isn't included","it's free on Sundays"], a:1, skill:"comprehension" },
      { q:"«Το κράνος — πάντα!» means…", opts:["the helmet is free","always wear the helmet","the helmet costs extra"], a:1, skill:"comprehension" }
    ]}
];

const LESSONS_L2 = [

  { id:"l2L-aresei", level:"L2", diff:1, title:"Μου αρέσει", titleEn:"I like…",
    body:"Greek says «it pleases me»:<br>• <b>Μου αρέσει</b> + ONE thing: <b>μου αρέσει η θάλασσα</b> = I like the sea<br>• <b>Μου αρέσουν</b> + SEVERAL things: <b>μου αρέσουν οι ελιές</b> = I like olives<br>• <b>Δεν μου αρέσει</b> = I don't like<br>• <b>Σου αρέσει;</b> = do you like? (to a friend) · <b>Σας αρέσει;</b> (polite)<br>• <b>Μου άρεσε</b> = I liked it (past)<br><br>💡 Careful: <b>μου αρέσεις</b> means «I like YOU» — lovely to say, just make sure you mean it.",
    practice:[
      { q:"«Μου αρέσουν οι ελιές» means…", opts:["I like olives","I'd like olives","olives like me"], a:0, skill:"likes" },
      { q:"You like the sea (one thing). You say…", opts:["Μου αρέσει η θάλασσα.","Μου αρέσουν η θάλασσα.","Μου αρέσεις η θάλασσα."], a:0, skill:"likes", explain:"One thing → <b>μου αρέσει</b>. (<b>Μου αρέσεις</b> = I like you!)" },
      { q:"You like the beaches (several). You say…", opts:["Μου αρέσει οι παραλίες.","Μου αρέσουν οι παραλίες.","Σου αρέσουν οι παραλίες."], a:1, skill:"likes" },
      { q:"Translate: «Σας αρέσει η Νάξος;»", opts:["Do you like Naxos?","I like Naxos.","Is Naxos nice?"], a:0, skill:"translation" },
      { q:"Type the Greek for “I don't like” (+ one thing):", opts:[], a:["δεν μου αρέσει"], type:"fill", skill:"likes", explain:"<b>Δεν μου αρέσει</b> — δεν (not) goes first." }
    ]},

  { id:"l2L-ora", level:"L2", diff:2, title:"Τι ώρα είναι;", titleEn:"Time & days",
    body:"<b>Τι ώρα είναι;</b> = what time is it?<br>• <b>Είναι δύο.</b> = It's two.<br>• <b>δύο και τέταρτο</b> = 2:15 · <b>δύο και μισή</b> = 2:30 · <b>τρεις παρά τέταρτο</b> = 2:45 («three minus a quarter»)<br>• <b>στις οκτώ</b> = at eight<br>• For hours, 1, 3 and 4 take the feminine: <b>μία</b>, <b>τρεις</b>, <b>τέσσερις</b> (because η ώρα is feminine).<br><br><b>Days</b> — most are just counted from Sunday:<br><b>Δευτέρα</b> Mon («second») · <b>Τρίτη</b> Tue («third») · <b>Τετάρτη</b> Wed («fourth») · <b>Πέμπτη</b> Thu («fifth») · <b>Παρασκευή</b> Fri · <b>Σάββατο</b> Sat · <b>Κυριακή</b> Sun («the Lord's day»)<br><br><b>σήμερα</b> today · <b>αύριο</b> tomorrow · <b>χθες</b> yesterday<br><b>το πρωί</b> in the morning · <b>το μεσημέρι</b> at midday · <b>το απόγευμα</b> in the afternoon · <b>το βράδυ</b> in the evening",
    practice:[
      { q:"«Στις επτά και μισή» is…", opts:["7:30","7:15","6:30"], a:0, skill:"vocab-numbers" },
      { q:"«Τρεις παρά τέταρτο» is…", opts:["3:15","2:45","3:45"], a:1, skill:"vocab-numbers", trick:true, explain:"<b>παρά</b> = minus. Three minus a quarter = 2:45." },
      { q:"Which day is «Πέμπτη»?", opts:["Tuesday","Thursday","Friday"], a:1, skill:"vocab-daily", explain:"<b>πέντε</b> = five → <b>Πέμπτη</b> = the fifth day, counting from Sunday = Thursday." },
      { q:"Translate: «αύριο το πρωί»", opts:["tomorrow morning","this morning","yesterday morning"], a:0, skill:"translation" },
      { q:"Type the Greek for “today”:", opts:[], a:["σήμερα"], type:"fill", skill:"vocab-daily", explain:"<b>σήμερα</b> = today · <b>αύριο</b> = tomorrow · <b>χθες</b> = yesterday." }
    ]},

  { id:"l2L-kateythynseis", level:"L2", diff:3, title:"Αριστερά, δεξιά", titleEn:"Directions",
    body:"• <b>αριστερά</b> = left · <b>δεξιά</b> = right · <b>ευθεία</b> = straight ahead<br>• <b>κοντά</b> = near · <b>μακριά</b> = far<br>• <b>δίπλα</b> = next to · <b>απέναντι</b> = opposite<br>• <b>στη γωνία</b> = on the corner<br>• <b>πάνω</b> = up / upstairs · <b>κάτω</b> = down / downstairs<br><br>Three questions get you anywhere:<br>• <b>Πού είναι…;</b> = where is…?<br>• <b>Είναι μακριά;</b> = is it far?<br>• <b>Πόσα λεπτά με τα πόδια;</b> = how many minutes on foot?<br><br>💡 Greeks point with the whole hand and say <b>εκεί</b> (there) a lot. Watch the hand more than the words.",
    practice:[
      { q:"«Δίπλα στο σούπερ μάρκετ» means…", opts:["next to the supermarket","opposite the supermarket","inside the supermarket"], a:0, skill:"vocab-travel" },
      { q:"«Απέναντι» means…", opts:["opposite","next to","upstairs"], a:0, skill:"vocab-travel" },
      { q:"How do you ask «Is it far?»", opts:["Είναι μακριά;","Είναι κοντά;","Είναι εδώ;"], a:0, skill:"questions" },
      { q:"Translate: «δεξιά»", opts:["left","right","straight on"], a:1, skill:"translation" },
      { q:"Type the Greek for “near / close”:", opts:[], a:["κοντά"], type:"fill", skill:"vocab-travel", explain:"<b>κοντά</b> = near · <b>μακριά</b> = far." }
    ]},

  { id:"l2L-rimata", level:"L2", diff:4, title:"Ρήματα", titleEn:"Verb endings (present tense)",
    body:"Greek verbs change their ending for each person. Most follow <b>θέλω</b> (want):<br>• <b>θέλω</b> I want · <b>θέλεις</b> you want · <b>θέλει</b> he / she wants<br>• <b>θέλουμε</b> we want · <b>θέλετε</b> you (all / polite) want · <b>θέλουν</b> they want<br>Same endings: <b>έχω</b> (have), <b>πίνω</b> (drink), <b>μένω</b> (stay / live).<br><br>The second group ends in -άω — like <b>μιλάω</b> (speak):<br>• <b>μιλάω, μιλάς, μιλάει, μιλάμε, μιλάτε, μιλάνε</b><br>Same: <b>πάω</b> (go), <b>αγαπάω</b> (love), <b>ρωτάω</b> (ask).<br><br>And the one you need most, <b>είμαι</b> (be): <b>είμαι, είσαι, είναι, είμαστε, είστε, είναι</b>.<br><br>💡 The -ετε / -άτε ending is also the polite «you»: <b>Θέλετε;</b> <b>Μιλάτε αγγλικά;</b>",
    practice:[
      { q:"«Θέλουμε» means…", opts:["I want","we want","they want"], a:1, skill:"verbs" },
      { q:"Which one means «you speak» (polite)?", opts:["μιλάω","μιλάτε","μιλάνε"], a:1, skill:"verbs" },
      { q:"Complete: «Εμείς ___ νερό.» (we drink)", opts:["πίνω","πίνουμε","πίνουν"], a:1, skill:"verbs" },
      { q:"Translate: «Είμαστε από τον Καναδά.»", opts:["We're from Canada.","They're from Canada.","I'm from Canada."], a:0, skill:"translation" },
      { q:"Type the Greek for “I have”:", opts:[], a:["έχω"], type:"fill", skill:"verbs", explain:"<b>έχω</b> = I have · <b>έχεις</b> = you have · <b>έχει</b> = he / she has." }
    ]}

];

/* ============================================================================
   L3 — Chatting
   ========================================================================== */
const STORIES_L3 = [

  { id:"l3-apopou", level:"L3", diff:1, titleGr:"Από πού είσαι;", titleEn:"Where are you from?",
    text:"[Ένα μπαρ|a bar] [στη Νάξο|in / to Naxos]. [Ένας Έλληνας|a Greek guy], ο Νίκος, [σου μιλάει|talks to you].\n— [Από πού είσαι|where are you from];\n— [Είμαι από τον Καναδά|I'm from Canada]. [Εσύ|and you];\n— [Από εδώ|from here], [από τη Νάξο|from Naxos]. [Μιλάς πολύ καλά ελληνικά|you speak Greek very well]!\n— [Λίγο|a little]. [Μαθαίνω|I'm learning] [με μια εφαρμογή|with an app].\n— [Μπράβο|well done]! [Πόσο καιρό|how long] [είσαι εδώ|have you been here];\n— [Μία εβδομάδα|one week]. [Φεύγω|I leave] [την Κυριακή|on Sunday].\n— [Κρίμα|what a pity]! [Γεια μας|cheers]!",
    quiz:[
      { q:"Where is Nikos from?", opts:["Athens","Naxos","Canada"], a:1, skill:"comprehension" },
      { q:"How are you learning Greek?", opts:["with a teacher","with an app","from friends"], a:1, skill:"comprehension" },
      { q:"When do you leave?", opts:["on Saturday","on Sunday","in two weeks"], a:1, skill:"comprehension" },
      { q:"«Κρίμα!» means…", opts:["what a pity!","cheers!","great!"], a:0, skill:"greek-life" }
    ]},

  { id:"l3-xthes", level:"L3", diff:2, titleGr:"Χθες", titleEn:"Yesterday",
    text:"Η Μαρία [σε ρωτάει|asks you]: «[Τι έκανες|what did you do] [χθες|yesterday];»\n— [Πήγα|I went] [σε ένα χωριό|to a village] [στο βουνό|in the mountains], [την Απείρανθο|Apiranthos]. [Είδα|I saw] [παλιά σπίτια|old houses] [από μάρμαρο|made of marble]. [Έφαγα|I ate] [κατσίκι|goat] [σε μια ταβέρνα|in a taverna] — [πολύ νόστιμο|very tasty]! [Ήπια|I drank] [κίτρο|kitron (a Naxos liqueur)].\n— [Σου άρεσε|did you like it];\n— [Μου άρεσε πολύ|I liked it a lot]! [Αλλά|but] [έκανε πολλή ζέστη|it was very hot].\n— [Πώς πήγες|how did you get there];\n— [Με το λεωφορείο|by bus]. [Γύρισα|I came back] [το βράδυ|in the evening]. [Τέλεια μέρα|a perfect day]!",
    quiz:[
      { q:"Where did you go yesterday?", opts:["to the beach","to a mountain village","to Athens"], a:1, skill:"comprehension" },
      { q:"What did you eat?", opts:["fish","goat","souvlaki"], a:1, skill:"vocab-food" },
      { q:"How did you get there?", opts:["by bus","by taxi","by scooter"], a:0, skill:"comprehension" },
      { q:"«Έφαγα» means…", opts:["I ate","I'll eat","I eat"], a:0, skill:"past", explain:"<b>έφαγα</b> = I ate (from <b>τρώω</b>, I eat). Learn the past «I» forms whole." }
    ]},

  { id:"l3-avrio", level:"L3", diff:3, titleGr:"Αύριο", titleEn:"Tomorrow",
    text:"Ο Νίκος [σε ρωτάει|asks you]: «[Τι θα κάνεις|what will you do] [αύριο|tomorrow];»\n— [Το πρωί|in the morning] [θα πάω|I'll go] [για μπάνιο|for a swim] [στην Αγία Άννα|at Agia Anna beach]. [Το μεσημέρι|at midday] [θα φάω|I'll eat] [ψάρι|fish]. [Το βράδυ|in the evening]… [δεν ξέρω|I don't know]!\n— [Έλα μαζί μας|come with us]! [Το βράδυ|in the evening] [έχει|there is / there are] [πανηγύρι|a village festival] [στο χωριό|in the village]. [Θα έχει|there'll be] [μουσική|music], [χορό|dancing] [και|and / also] [πολύ φαγητό|lots of food].\n— [Τέλεια|perfect / great]! [Τι ώρα|what time];\n— [Θα περάσω να σε πάρω|I'll come and pick you up] [στις εννιά|at nine].\n— [Εντάξει|OK], [τα λέμε|see you]!",
    quiz:[
      { q:"What will you do in the morning?", opts:["go for a swim","eat fish","take the ferry"], a:0, skill:"comprehension" },
      { q:"What's on in the village in the evening?", opts:["a wedding","a festival","a football match"], a:1, skill:"comprehension", explain:"<b>πανηγύρι</b> = a village feast for a saint's day: live music, dancing and food until dawn." },
      { q:"What time will Nikos pick you up?", opts:["at 9","at 10","at 7"], a:0, skill:"vocab-numbers" },
      { q:"«Θα φάω» means…", opts:["I ate","I'll eat","I'm eating"], a:1, skill:"future", explain:"<b>θα</b> + verb = future: <b>θα φάω</b> = I'll eat." }
    ]},

  { id:"l3-panigyri", level:"L3", diff:4, titleGr:"Το πανηγύρι", titleEn:"The village festival",
    text:"[Στο πανηγύρι|at the festival] [έχει|there is / there are] [πολύ κόσμο|lots of people]. [Η μουσική|the music] [παίζει|plays] [δυνατά|loudly].\n— [Έλα|come on / come], [χόρεψε|dance]! [Είναι εύκολο|it's easy]!\n— [Δεν ξέρω να χορεύω|I can't dance]…\n— [Δεν πειράζει|never mind]! [Κράτα το χέρι μου|hold my hand]. [Ένα|one], [δύο|two], [τρία|three]… [Όπα|opa! (a happy shout)]!\nΗ γιαγιά του Νίκου [σου δίνει|gives you] [ένα πιάτο φαγητό|a plate of food].\n— [Φάε|eat], [φάε|eat], [παιδί μου|my dear (literally «my child»)]!\n— [Ευχαριστώ|thank you], [γιαγιά|grandma]! [Είναι πολύ νόστιμο|it's very tasty]!\n[Στις τρεις|at three] [το πρωί|in the morning], [η μουσική|the music] [παίζει|plays] [ακόμα|still].",
    quiz:[
      { q:"Why don't you want to dance at first?", opts:["you're tired","you don't know how","the music is bad"], a:1, skill:"comprehension" },
      { q:"«Δεν πειράζει» means…", opts:["never mind / no problem","don't touch","not now"], a:0, skill:"greek-life" },
      { q:"What does grandma keep saying?", opts:["drink, drink!","eat, eat!","dance, dance!"], a:1, skill:"comprehension", explain:"<b>Φάε!</b> = eat! Every Greek grandma's favourite word." },
      { q:"At 3 a.m. the music…", opts:["stops","is still playing","gets quiet"], a:1, skill:"comprehension" }
    ]},

  { id:"l3-kinito", level:"L3", diff:5, titleGr:"Έχασα το κινητό μου!", titleEn:"I lost my phone!",
    text:"— [Βοήθεια|help]! [Έχασα το κινητό μου|I lost my phone]!\n— [Ηρέμησε|calm down]. [Πού ήσουν|where were you];\n— [Στο λεωφορείο|on the bus]… [από τη Χώρα|from Chora] [για την Αγία Άννα|to Agia Anna].\n— [Πάμε|let's go] [στο ΚΤΕΛ|to the bus station (KTEL)]. [Ίσως|maybe] [το βρήκε ο οδηγός|the driver found it].\nΣτο ΚΤΕΛ:\n— [Καλησπέρα|good evening]. [Μήπως βρήκατε|did you by any chance find] [ένα μαύρο κινητό|a black phone];\n— [Ένα μαύρο κινητό|a black phone]… [Αυτό|this one];\n— [Ναι|yes]! [Αυτό είναι|that's it]! [Ευχαριστώ πάρα πολύ|thank you so much]!\n— [Τίποτα|don't mention it]. [Πρόσεχε|be careful] [την άλλη φορά|next time]!",
    quiz:[
      { q:"What did you lose?", opts:["your wallet","your phone","your passport"], a:1, skill:"comprehension" },
      { q:"Where did you lose it?", opts:["on the bus","at the beach","in a taverna"], a:0, skill:"comprehension" },
      { q:"Who probably found it?", opts:["a police officer","the driver","Nikos"], a:1, skill:"comprehension" },
      { q:"Type the Greek for “help!”:", opts:[], a:["βοήθεια"], type:"fill", skill:"phrases", explain:"<b>Βοήθεια!</b> = help! In a real emergency anywhere in Greece, call <b>112</b> — they speak English." }
    ]}
];

const LESSONS_L3 = [

  { id:"l3L-aoristos", level:"L3", diff:1, title:"Το παρελθόν", titleEn:"The past",
    body:"The past verbs you'll use every day — learn the «I» form whole:<br>• <b>πήγα</b> I went · <b>ήρθα</b> I came<br>• <b>έφαγα</b> I ate · <b>ήπια</b> I drank<br>• <b>είδα</b> I saw · <b>έκανα</b> I did / made<br>• <b>αγόρασα</b> I bought · <b>κολύμπησα</b> I swam<br>• <b>ήμουν</b> I was · <b>είχα</b> I had<br>• <b>μου άρεσε</b> I liked it<br><br>Then change the ending for the person — <b>-α, -ες, -ε, -αμε, -ατε, -αν</b>:<br><b>πήγα, πήγες, πήγε, πήγαμε, πήγατε, πήγαν</b><br><br>💡 Many past forms jump the stress back or grow an extra ε at the front: <b>τρώω → έφαγα</b>, <b>κάνω → έκανα</b>. That's why it pays to learn them as words, not rules.",
    practice:[
      { q:"«Ήπια» means…", opts:["I drank","I drink","I'll drink"], a:0, skill:"past" },
      { q:"«Είδα» means…", opts:["I saw","I gave","I knew"], a:0, skill:"past" },
      { q:"Yesterday we went to the beach: «Χθες ___ στην παραλία.»", opts:["πάμε","πήγαμε","θα πάμε"], a:1, skill:"past" },
      { q:"Translate: «Αγόρασα ένα καπέλο.»", opts:["I bought a hat.","I want a hat.","I lost a hat."], a:0, skill:"translation" },
      { q:"Type the Greek for “I ate”:", opts:[], a:["έφαγα"], type:"fill", skill:"past", explain:"<b>έφαγα</b> = I ate." }
    ]},

  { id:"l3L-mellon", level:"L3", diff:2, title:"Θα…", titleEn:"The future",
    body:"Put <b>θα</b> in front of a verb and it's the future:<br>• <b>θα πάω</b> I'll go · <b>θα έρθω</b> I'll come<br>• <b>θα φάω</b> I'll eat · <b>θα πιω</b> I'll drink<br>• <b>θα δω</b> I'll see · <b>θα κάνω</b> I'll do<br><br>Notice: for a one-off plan, the verb after θα is a short form — and it looks a lot like the past without its front: <b>έφαγα → θα φάω</b>, <b>ήπια → θα πιω</b>, <b>είδα → θα δω</b>.<br><br>The same θα is in the polite <b>θα ήθελα</b> (I would like).<br><br>💡 The most Greek answer to any plan: <b>Θα δούμε.</b> — We'll see.",
    practice:[
      { q:"«Θα πάω» means…", opts:["I went","I'll go","I go"], a:1, skill:"future" },
      { q:"Your friend answers your plan with «Θα δούμε». She means…", opts:["we saw it","we'll see","let's meet"], a:1, skill:"future" },
      { q:"Tomorrow I'll eat fish: «Αύριο ___ ψάρι.»", opts:["έφαγα","θα φάω","τρώω"], a:1, skill:"future" },
      { q:"Translate: «Θα έρθεις;»", opts:["Will you come?","Did you come?","Are you home?"], a:0, skill:"translation" },
      { q:"Type the Greek for “I'll drink”:", opts:[], a:["θα πιω"], type:"fill", skill:"future", explain:"<b>θα πιω</b> = I'll drink. (<b>ήπια</b> = I drank.)" }
    ]},

  { id:"l3L-ktitika", level:"L3", diff:3, title:"Μου, σου, του", titleEn:"My, your, his…",
    body:"In Greek, «my / your / his» go AFTER the noun:<br>• <b>το κινητό μου</b> my phone<br>• <b>το κινητό σου</b> your phone<br>• <b>το κινητό του</b> his phone · <b>το κινητό της</b> her phone<br>• <b>το κινητό μας</b> our phone<br>• <b>το κινητό σας</b> your phone (polite, or you all)<br>• <b>το κινητό τους</b> their phone<br><br>The same little words also mean «to me / to you…»: <b>μου αρέσει</b> (it pleases me), <b>σου δίνω</b> (I give you), <b>πες μου</b> (tell me).<br><br>💡 You've known this since day one: <b>γεια σου</b> is literally «your health», <b>γεια μας</b> «our health».",
    practice:[
      { q:"«Το διαβατήριό μου» means…", opts:["my passport","your passport","our passport"], a:0, skill:"pronouns" },
      { q:"«Η μητέρα της» means…", opts:["her mother","his mother","your mother"], a:0, skill:"pronouns" },
      { q:"Which one is «my phone»?", opts:["το κινητό μου","μου το κινητό","το μου κινητό"], a:0, skill:"pronouns", explain:"The little word goes after the noun: <b>το κινητό μου</b>." },
      { q:"Translate: «Το σπίτι μας είναι εδώ.»", opts:["Our house is here.","Your house is here.","My house is here."], a:0, skill:"translation" },
      { q:"Type the Greek for “my phone” (phone = κινητό):", opts:[], a:["το κινητό μου","κινητό μου"], type:"fill", skill:"pronouns", explain:"<b>το κινητό μου</b> = my phone." }
    ]},

  { id:"l3L-eimai", level:"L3", diff:4, title:"Πώς είσαι;", titleEn:"How you feel",
    body:"Feelings with <b>είμαι</b> (I am) — the ending shows if you're a man or a woman:<br>• <b>Είμαι κουρασμένος</b> / <b>κουρασμένη</b> = I'm tired<br>• <b>Είμαι χαρούμενος</b> / <b>χαρούμενη</b> = I'm happy<br><br>But some feelings are verbs:<br>• <b>πεινάω</b> = I'm hungry · <b>διψάω</b> = I'm thirsty<br>• <b>κρυώνω</b> = I'm cold · <b>ζεσταίνομαι</b> = I'm hot<br><br>The weather «makes»: <b>κάνει ζέστη</b> = it's hot · <b>κάνει κρύο</b> = it's cold<br>And <b>έχω</b> (I have): <b>έχω πονοκέφαλο</b> = I have a headache · <b>έχεις δίκιο</b> = you're right<br><br>💡 Don't say «είμαι ζέστη» — that's «I am heat». Say <b>ζεσταίνομαι</b>, or point at the sun and say <b>κάνει ζέστη!</b>",
    practice:[
      { q:"«Πεινάω» means…", opts:["I'm hungry","I'm thirsty","I'm tired"], a:0, skill:"states" },
      { q:"The weather is really hot. You say…", opts:["Κάνει ζέστη.","Είμαι ζέστη.","Έχω ζέστη."], a:0, skill:"states" },
      { q:"A woman says she's tired:", opts:["Είμαι κουρασμένος.","Είμαι κουρασμένη.","Έχω κουρασμένη."], a:1, skill:"states" },
      { q:"Translate: «Έχεις δίκιο.»", opts:["You're right.","You're tired.","You have a dog."], a:0, skill:"translation" },
      { q:"Type the Greek for “I'm thirsty”:", opts:[], a:["διψάω","διψώ"], type:"fill", skill:"states", explain:"<b>διψάω</b> = I'm thirsty · <b>πεινάω</b> = I'm hungry." }
    ]}

];

/* ============================================================================
   L4 — Beyond Duolingo
   ========================================================================== */
const STORIES_L4 = [

  { id:"l4-tilefono", level:"L4", diff:1, titleGr:"Κράτηση στο τηλέφωνο", titleEn:"Booking by phone",
    text:"— [Εμπρός|hello? (answering the phone)];\n— [Γεια σας|hello / goodbye (polite)]. [Θα ήθελα να κλείσω|I'd like to book] [ένα τραπέζι|a table] [για απόψε|for tonight].\n— [Βεβαίως|of course]. [Για πόσα άτομα|for how many people];\n— [Για τέσσερα άτομα|for four people], [γύρω στις εννιά|around nine].\n— [Στις εννιά|at nine] [είμαστε γεμάτοι|we're full]. [Μπορείτε στις δέκα|can you make it at ten];\n— [Ναι|yes], [κανένα πρόβλημα|no problem]. [Θα μπορούσαμε να καθίσουμε|could we sit] [έξω|outside], [κοντά στη θάλασσα|near the sea];\n— [Θα προσπαθήσω|I'll try]. [Το όνομά σας|your name];\n— Sam. [Ευχαριστώ πολύ|thank you very much]!\n— [Εμείς ευχαριστούμε|thank YOU (literally «we thank you»)]. [Τα λέμε|see you] [απόψε|tonight]!",
    quiz:[
      { q:"How many people is the table for?", opts:["two","four","nine"], a:1, skill:"comprehension" },
      { q:"Why can't you have 9:00?", opts:["they're closed","they're full","it's too early"], a:1, skill:"comprehension" },
      { q:"What time is the booking in the end?", opts:["9:00","10:00","10:30"], a:1, skill:"vocab-numbers" },
      { q:"«Θα μπορούσαμε να καθίσουμε έξω;» is…", opts:["a polite request to sit outside","an order to sit outside","a question about the weather"], a:0, skill:"na", explain:"<b>Θα μπορούσαμε να…;</b> = could we…? The softest way to ask for anything." }
    ]},

  { id:"l4-gnomi", level:"L4", diff:2, titleGr:"Ποιο νησί είναι το καλύτερο;", titleEn:"Which island is the best?",
    text:"Ο Νίκος [και|and / also] η Μαρία [διαφωνούν|disagree].\nΝίκος: [Νομίζω ότι|I think that] η Νάξος [είναι το καλύτερο νησί|is the best island]. [Έχει τα πάντα|it has everything]: [βουνά|mountains], [παραλίες|beaches], [φαγητό|food].\nΜαρία: [Δεν συμφωνώ|I don't agree]. Η Σαντορίνη [είναι πιο όμορφη|is more beautiful].\nΝίκος: [Πιο όμορφη|more beautiful], [ναι|yes]· [αλλά|but] [πολύ πιο ακριβή|much more expensive] [και|and / also] [γεμάτη τουρίστες|full of tourists]!\nΜαρία: [Εντάξει|OK], [έχεις δίκιο|you're right] [σ' αυτό|about that]. [Εσύ τι λες|what do you say];\n— [Κατά τη γνώμη μου|in my opinion]… [το καλύτερο νησί|the best island] [είναι εκεί που είναι οι φίλοι σου|is wherever your friends are]!\n— [Ωραία το είπες|nicely put]!",
    quiz:[
      { q:"Which island does Nikos prefer?", opts:["Santorini","Naxos","Paros"], a:1, skill:"comprehension" },
      { q:"Nikos admits that Santorini is…", opts:["more beautiful","cheaper","quieter"], a:0, skill:"comprehension" },
      { q:"«Δεν συμφωνώ» means…", opts:["I don't agree","I don't understand","I don't care"], a:0, skill:"opinions" },
      { q:"Type the Greek for “I think that…”:", opts:[], a:["νομίζω ότι","νομίζω πως"], type:"fill", skill:"opinions", explain:"<b>Νομίζω ότι…</b> (or <b>νομίζω πως…</b>) = I think that…" }
    ]},

  { id:"l4-minima", level:"L4", diff:3, titleGr:"Ένα μήνυμα", titleEn:"A message",
    text:"[Ένα μήνυμα|a message] [από τη Μαρία|from Maria]:\n«[Γεια|hi]! [Θέλεις να πάμε για καφέ|do you want to go for a coffee] [αύριο|tomorrow]; [Πρέπει να δουλέψω|I have to work] [το πρωί|in the morning], [αλλά|but] [μπορούμε να βρεθούμε|we can meet] [στις πέντε|at five].»\n[Απαντάς|you reply]:\n«[Ναι|yes], [θέλω πολύ|I'd love to]! [Πρέπει να αγοράσω|I have to buy] [δώρα|gifts] [για την οικογένειά μου|for my family] [πριν φύγω|before I leave]. [Μπορείς να με βοηθήσεις|can you help me];»\n«[Φυσικά|of course]! [Ξέρω|I know] [ένα μαγαζί|a shop] [με τοπικά προϊόντα|with local products]. [Φέρε|bring] [ένα μεγάλο σακίδιο|a big backpack]! 😄»",
    quiz:[
      { q:"Why can't Maria meet in the morning?", opts:["she has to work","she's at the beach","she's asleep"], a:0, skill:"comprehension" },
      { q:"What time can you meet?", opts:["5:00","3:00","7:00"], a:0, skill:"vocab-numbers" },
      { q:"What do you need to buy?", opts:["gifts for your family","a backpack","a ferry ticket"], a:0, skill:"comprehension" },
      { q:"«Πρέπει να δουλέψω» means…", opts:["I have to work","I want to work","I worked"], a:0, skill:"na", explain:"<b>πρέπει να</b> + verb = I have to / must." }
    ]},

  { id:"l4-pasxa", level:"L4", diff:4, titleGr:"Χριστός Ανέστη!", titleEn:"Greek Easter",
    text:"[Το Πάσχα|Easter] [είναι η μεγαλύτερη γιορτή|is the biggest celebration] [στην Ελλάδα|in / to Greece].\n[Το Μεγάλο Σάββατο|on Holy Saturday], [λίγο πριν τα μεσάνυχτα|just before midnight], [όλοι|everyone] [πηγαίνουν στην εκκλησία|goes to church] [με ένα κερί|with a candle].\n[Στις δώδεκα|at twelve] [ο παπάς|the priest] [λέει|says]: «[Χριστός Ανέστη|Christ is risen]!» [και|and / also] [όλοι|everyone] [απαντούν|answer]: «[Αληθώς Ανέστη|truly He is risen]!»\n[Μετά|then / after] [τσουγκρίζουν|they crack together] [κόκκινα αυγά|red eggs] [και|and / also] [τρώνε|eat] [μαγειρίτσα|magiritsa (Easter soup)].\n[Την Κυριακή|on Sunday] [ψήνουν|they roast] [αρνί|lamb] [στη σούβλα|on the spit] [όλη μέρα|all day].",
    quiz:[
      { q:"When do people go to church with candles?", opts:["Saturday, just before midnight","Sunday morning","Friday at noon"], a:0, skill:"comprehension" },
      { q:"Someone says «Χριστός Ανέστη!». You answer…", opts:["Αληθώς Ανέστη!","Καλό Πάσχα!","Γεια μας!"], a:0, skill:"greek-life", explain:"From midnight on Easter Saturday, the greeting is <b>Χριστός Ανέστη!</b> and the answer is <b>Αληθώς Ανέστη!</b> Before that, people wish each other <b>Καλό Πάσχα</b>." },
      { q:"What colour are the Easter eggs?", opts:["red","gold","blue"], a:0, skill:"comprehension" },
      { q:"What's roasted on the spit on Sunday?", opts:["lamb","goat","pork"], a:0, skill:"vocab-food" }
    ]},

  { id:"l4-paidi", level:"L4", diff:5, titleGr:"Όταν ήμουν παιδί", titleEn:"When I was a kid",
    text:"Ο Νίκος [θυμάται|remembers]:\n«[Όταν ήμουν παιδί|when I was a kid], [κάθε καλοκαίρι|every summer] [πήγαινα|I used to go] [στο χωριό της γιαγιάς μου|to my grandma's village]. [Ξυπνούσα νωρίς|I'd wake up early] [και|and / also] [έτρωγα|I'd eat] [ψωμί με μέλι|bread with honey]. [Μετά|then / after] [έπαιζα|I'd play] [ποδόσφαιρο|football] [με τους φίλους μου|with my friends] [όλη μέρα|all day].\n[Ένα καλοκαίρι|one summer] [έσπασα|I broke] [το παράθυρο του παπά|the priest's window] [με την μπάλα|with the ball]! [Η γιαγιά μου|my grandma] [θύμωσε πολύ|got really angry]… [αλλά|but] [μετά|then / after] [μου έδωσε|she gave me] [ένα γλυκό|a dessert]. [Τι ωραία χρόνια|what lovely years]!»",
    quiz:[
      { q:"Where did Nikos spend his summers as a kid?", opts:["at the beach","at his grandma's village","in Athens"], a:1, skill:"comprehension" },
      { q:"What did he eat in the mornings?", opts:["bread with honey","eggs","cake"], a:0, skill:"comprehension" },
      { q:"What happened one summer?", opts:["he broke the priest's window","he lost his ball","he got lost"], a:0, skill:"comprehension" },
      { q:"«Κάθε καλοκαίρι πήγαινα…» means…", opts:["every summer I used to go…","one summer I went…","every summer I'll go…"], a:0, skill:"imperfect", explain:"<b>πήγαινα</b> = I used to go (again and again). <b>πήγα</b> = I went (once)." }
    ]}
];

const LESSONS_L4 = [

  { id:"l4L-na", level:"L4", diff:1, title:"Να + ρήμα", titleEn:"«To do» in Greek: να",
    body:"Greek has no «to go», «to eat». Instead it says <b>να</b> + the verb, with the person on it:<br>• <b>Θέλω να πάω</b> = I want to go<br>• <b>Πρέπει να φύγω</b> = I have to leave<br>• <b>Μπορώ να έρθω;</b> = Can I come?<br>• <b>Ξέρω να μαγειρεύω</b> = I know how to cook<br><br>After να, a one-off action takes the same short form as after θα: <b>θα πάω → να πάω</b>, <b>θα φάω → να φάω</b>, <b>θα δω → να δω</b>, <b>θα αγοράσω → να αγοράσω</b>.<br><br>Both verbs change with the person: <b>θέλεις να πας</b> (you want to go), <b>θέλουμε να πάμε</b> (we want to go).<br><br>💡 να alone makes a soft wish or command: <b>Να προσέχεις!</b> (take care!), <b>Να είστε καλά!</b> (be well!).",
    practice:[
      { q:"«Πρέπει να φύγω» means…", opts:["I have to leave","I want to leave","I left"], a:0, skill:"na" },
      { q:"Complete: «Θέλω ___ στην παραλία.» (I want to go)", opts:["πάω","να πάω","να πήγα"], a:1, skill:"na" },
      { q:"Complete: «Θέλουμε να ___.» (we want to eat)", opts:["φάμε","φάω","έφαγα"], a:0, skill:"na", explain:"Both verbs take the person: <b>θέλουμε να φάμε</b> = we want to eat." },
      { q:"Translate: «Μπορείς να με βοηθήσεις;»", opts:["Can you help me?","Do you want to help me?","Did you help me?"], a:0, skill:"translation" },
      { q:"Type the Greek for “I want to go”:", opts:[], a:["θέλω να πάω"], type:"fill", skill:"na", explain:"<b>θέλω να πάω</b> = I want to go." }
    ]},

  { id:"l4L-gnomi", level:"L4", diff:2, title:"Νομίζω ότι…", titleEn:"Giving your opinion",
    body:"• <b>Νομίζω ότι…</b> / <b>Νομίζω πως…</b> = I think that…<br>• <b>Πιστεύω ότι…</b> = I believe that…<br>• <b>Κατά τη γνώμη μου…</b> = in my opinion…<br>• <b>Συμφωνώ</b> = I agree · <b>Δεν συμφωνώ</b> = I disagree<br>• <b>Έχεις δίκιο</b> = you're right · <b>Δεν έχεις άδικο</b> = you're not wrong<br>• <b>Εξαρτάται</b> = it depends<br>• <b>Σίγουρα</b> = definitely · <b>Μάλλον</b> = probably · <b>Δεν νομίζω</b> = I don't think so<br><br><b>Comparing:</b> <b>πιο</b> + adjective = more: <b>πιο όμορφη</b> (more beautiful), <b>πιο ακριβό</b> (more expensive). The best: <b>ο καλύτερος</b> / <b>η καλύτερη</b> / <b>το καλύτερο</b>.<br><br>💡 Greeks love a good debate over coffee — disagreeing loudly is friendly, not rude.",
    practice:[
      { q:"«Εξαρτάται» means…", opts:["it depends","it's expensive","it's finished"], a:0, skill:"opinions" },
      { q:"«Μάλλον» means…", opts:["probably","more","never"], a:0, skill:"opinions" },
      { q:"Your friend makes a good point. You say…", opts:["Έχεις δίκιο.","Δεν συμφωνώ.","Εξαρτάται."], a:0, skill:"opinions" },
      { q:"Translate: «Η Αθήνα είναι πιο μεγάλη.»", opts:["Athens is bigger.","Athens is the biggest.","Athens is very big."], a:0, skill:"translation" },
      { q:"Type the Greek for “I agree”:", opts:[], a:["συμφωνώ"], type:"fill", skill:"opinions", explain:"<b>συμφωνώ</b> = I agree — think «symphony», sounding together." }
    ]},

  { id:"l4L-paratatikos", level:"L4", diff:3, title:"Πήγα ή πήγαινα;", titleEn:"«I went» or «I used to go»?",
    body:"Greek has two pasts, and the difference is like English «I went» vs «I used to go / I was going»:<br>• <b>πήγα</b> = I went (once, done) · <b>πήγαινα</b> = I used to go / I was going<br>• <b>έφαγα</b> = I ate · <b>έτρωγα</b> = I used to eat / I was eating<br>• <b>έπαιξα</b> = I played · <b>έπαιζα</b> = I used to play<br>• <b>είδα</b> = I saw · <b>έβλεπα</b> = I used to watch / I was watching<br><br><b>Telling a story:</b> the background in the «used to / was -ing» form, the events in the simple one:<br><b>Έβλεπα τηλεόραση όταν χτύπησε το τηλέφωνο.</b> = I was watching TV when the phone rang.<br><br>💡 Clue words: <b>κάθε μέρα</b>, <b>κάθε καλοκαίρι</b>, <b>συνήθως</b> (usually) → «used to». <b>Χθες</b>, <b>μια φορά</b> (once) → the simple past.",
    practice:[
      { q:"«Κάθε μέρα έτρωγα ψάρι» means…", opts:["Every day I used to eat fish.","Every day I'll eat fish.","I ate a fish once."], a:0, skill:"imperfect" },
      { q:"Once, yesterday: «Χθες ___ στο μουσείο.»", opts:["πήγα","πήγαινα","πάω"], a:0, skill:"imperfect", explain:"One finished trip yesterday → <b>πήγα</b>." },
      { q:"The background: «___ στο μπαλκόνι όταν άρχισε η βροχή.» (I was sitting)", opts:["Κάθισα","Καθόμουν","Θα κάτσω"], a:1, skill:"imperfect", explain:"Ongoing background → <b>καθόμουν</b> (I was sitting) when the rain started." },
      { q:"Translate: «Όταν ήμουν μικρός, έπαιζα μπάλα.»", opts:["When I was little, I used to play ball.","When I was little, I played ball once.","When I'm older, I'll play ball."], a:0, skill:"translation" },
      { q:"Type the Greek for “I used to go” (from πάω):", opts:[], a:["πήγαινα"], type:"fill", skill:"imperfect", explain:"<b>πήγαινα</b> = I used to go · <b>πήγα</b> = I went." }
    ]},

  { id:"l4L-dopios", level:"L4", diff:4, title:"Σαν ντόπιος", titleEn:"Sound like a local",
    body:"The words Duolingo never taught you — you'll hear them every five minutes:<br>• <b>Έλα!</b> = come on! / hi! (answering the phone) / no way!<br>• <b>Άντε!</b> = go on! / hurry up! / finally!<br>• <b>Ρε</b> = hey, mate — friends only: <b>έλα ρε!</b><br>• <b>Τέλεια!</b> = perfect! · <b>Κανένα πρόβλημα</b> = no problem<br>• <b>Σιγά σιγά</b> = slowly, slowly · but <b>Σιγά!</b> on its own, with a look = «big deal!»<br>• <b>Πω πω!</b> = wow / oh my<br>• <b>Χαλαρά</b> = chill, relax<br>• <b>Τα λέμε</b> = see you · <b>Καλή συνέχεια</b> = have a good rest of the day<br>• <b>Χρόνια πολλά!</b> = happy birthday / name day / holiday — said on any celebration<br><br>Two words with no English match:<br>• <b>κέφι</b> = joyful high spirits, the mood when the dancing starts<br>• <b>φιλότιμο</b> = pride in doing right by others<br><br>💡 Careful with an open palm pushed toward someone's face (the <b>μούντζα</b>) — it's a rude gesture. A normal wave is fine.",
    practice:[
      { q:"Your friend calls and answers with «Έλα!». It means…", opts:["hi! / go ahead!","come here right now!","goodbye!"], a:0, skill:"greek-life" },
      { q:"«Χρόνια πολλά!» is said…", opts:["on birthdays, name days and holidays","when someone sneezes","when you leave"], a:0, skill:"greek-life" },
      { q:"Your friend brags about a tiny fish he caught. You tease him…", opts:["Σιγά!","Μπράβο!","Περαστικά!"], a:0, skill:"greek-life", explain:"<b>Σιγά!</b> with a raised eyebrow = «big deal!» (<b>Περαστικά</b> = get well soon.)" },
      { q:"Translate: «Κανένα πρόβλημα.»", opts:["No problem.","No way.","Not now."], a:0, skill:"translation" },
      { q:"Type the Greek for “see you!” (casual):", opts:[], a:["τα λέμε"], type:"fill", skill:"greek-life", explain:"<b>Τα λέμε!</b> = see you! (literally «we'll talk»)." }
    ]}

];

/* ============================================================================
   THE LEVEL CHECK (placement) — first open, and ⚙ Settings ▸ Retake.
   Self-contained questions (no story needed), 6 per level; the engine draws 3 per
   level, shuffles the options and adds "I don't know". Passing a level = 2 right;
   the learner is placed at the first level they don't pass (app.js, PLACEMENT).
   Rules: four options; exactly one right; alphabet-reading items need notr:true.
   ========================================================================== */
const PLACEMENT = {
  L0:[
    { q:"Read this sign: ΤΑΞΙ", opts:["taxi","tax","toxic","tie"], a:0, notr:true },
    { q:"How does «νερό» sound?", opts:["neró","veró","heró","peró"], a:0, notr:true },
    { q:"Which letter makes the «r» sound?", opts:["Ρ","Π","Β","Η"], a:0, notr:true },
    { q:"What does «ευχαριστώ» mean?", opts:["thank you","please","sorry","goodbye"], a:0 },
    { q:"What does «ναι» mean?", opts:["yes","no","nine","hi"], a:0 },
    { q:"«Καλημέρα» means…", opts:["good morning","good night","good luck","thank you"], a:0 }
  ],
  L1:[
    { q:"«Θα ήθελα έναν καφέ» means…", opts:["I'd like a coffee","I had a coffee","I don't like coffee","The coffee is cold"], a:0 },
    { q:"«Πόσο κάνει;» means…", opts:["How much is it?","How are you?","Where is it?","What time is it?"], a:0 },
    { q:"Which is correct?", opts:["η μπύρα","ο μπύρα","το μπύρα","τα μπύρα"], a:0 },
    { q:"«Δεκαπέντε» is…", opts:["15","50","5","12"], a:0 },
    { q:"«Έχετε τουαλέτα;» means…", opts:["Do you have a toilet?","Where's the toilet?","Is the toilet free?","I need a toilet."], a:0 },
    { q:"«Ο λογαριασμός» is…", opts:["the bill","the menu","the waiter","the table"], a:0 }
  ],
  L2:[
    { q:"Complete: «Εμείς ___ ελληνικά.» (we speak)", opts:["μιλάμε","μιλάω","μιλάνε","μιλάς"], a:0 },
    { q:"«Μου αρέσουν οι ελιές» means…", opts:["I like olives","I'd like olives","I have olives","I don't like olives"], a:0 },
    { q:"«Τρεις παρά τέταρτο» is…", opts:["2:45","3:15","3:45","4:45"], a:0 },
    { q:"«Πηγαίνετε ευθεία και μετά δεξιά» means…", opts:["Go straight, then right","Go right, then straight","Turn left, then right","It's straight on, on the right"], a:0 },
    { q:"«Παρασκευή» is…", opts:["Friday","Tuesday","Sunday","Thursday"], a:0 },
    { q:"«Για πακέτο» means…", opts:["to go (takeaway)","for the parcel","by post","in a bag"], a:0 }
  ],
  L3:[
    { q:"«Χθες πήγαμε στην παραλία» means…", opts:["Yesterday we went to the beach","Tomorrow we'll go to the beach","We go to the beach every day","Yesterday they went to the beach"], a:0 },
    { q:"Complete: «Αύριο ___ ψάρι.» (I'll eat)", opts:["θα φάω","έφαγα","τρώω","θα έφαγα"], a:0 },
    { q:"«Το κινητό της» means…", opts:["her phone","his phone","my phone","your phone"], a:0 },
    { q:"«Πεινάω» means…", opts:["I'm hungry","I'm thirsty","I'm tired","I'm cold"], a:0 },
    { q:"«Είδα» is the past of…", opts:["βλέπω (see)","δίνω (give)","ξέρω (know)","λέω (say)"], a:0 },
    { q:"«Κάνει κρύο» means…", opts:["It's cold","I'm cold","It's cool!","It makes ice"], a:0 }
  ],
  L4:[
    { q:"Complete: «Πρέπει ___ αύριο.» (I have to leave)", opts:["να φύγω","φύγω","θα φύγω","έφυγα"], a:0 },
    { q:"«Όταν ήμουν μικρή, έπαιζα πιάνο» means…", opts:["When I was little, I used to play the piano","When I was little, I played the piano once","When I'm older, I'll play the piano","I was playing the piano a moment ago"], a:0 },
    { q:"«Εξαρτάται» means…", opts:["it depends","it's included","it's expensive","it's finished"], a:0 },
    { q:"«Θα μπορούσατε να μου φέρετε νερό;» is…", opts:["a polite request for water","an order for water","a complaint about the water","a question about the price of water"], a:0 },
    { q:"«Χρόνια πολλά!» is said…", opts:["on birthdays, name days and holidays","when someone sneezes","when you leave","when you meet someone"], a:0 },
    { q:"Choose the right word: «Νομίζω ___ έχεις δίκιο.»", opts:["ότι","να","θα","που"], a:0 }
  ]
};

/* ============================================================================
   ASSEMBLY — the engine reads these.
   ========================================================================== */
const STORIES = [...STORIES_L0, ...STORIES_L1, ...STORIES_L2, ...STORIES_L3, ...STORIES_L4];
const LESSONS = [...LESSONS_L0, ...LESSONS_L1, ...LESSONS_L2, ...LESSONS_L3, ...LESSONS_L4];

/* Expose for the app (works as plain <script> include). */
window.SKILLS = SKILLS;
window.STORIES = STORIES;
window.LESSONS = LESSONS;
window.PLACEMENT = PLACEMENT;
