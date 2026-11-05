/* ============================================================================
   SPANISH QUEST — CONTENT FILE
   ----------------------------------------------------------------------------
   This is the file you edit to add or fix lessons. Nothing here is code logic —
   it's just the stories, quizzes and power lessons. Safe to edit by hand.

   WHO IT'S FOR
   ------------
   Absolute beginners (~10 Spanish words) flying to MEXICO in ~2 months.
   A sprint to getting by and having fun. Three rules:
     1. No conjugation drills. Verbs are ready-made chunks: quiero, ¿me da…?,
        necesito, ¿puedo…?, me gusta, hay, voy a…, fui a…
     2. Cognates first (hotel, taxi, delicioso…) — new words hang off them.
     3. Mexican Spanish only: ustedes, carro, camión, jugo, celular, ¿mande?,
        ahorita, ¡qué padre!, la cuenta, la propina.

   LEVELS
   ------
   L0 Cero (day 1) · L1 Sobrevivir (weeks 1–2) · L2 De viaje (weeks 3–5)
   · L3 Platicar (weeks 6–8). Shown to the learner as "Nivel 0…3".

   HOW A STORY WORKS
   -----------------
   {
     id:       unique slug, prefixed with the level: "l1-tacos" (never reuse an id)
     level:    "L0" | "L1" | "L2" | "L3"
     diff:     1..n  (order WITHIN a level; lower = shown first)
     titleEs:  Spanish title
     titleEn:  English title
     text:     the scene. Use \n between dialogue lines (lines start with "— ").
               Wrap anything tappable as [spanish|english]:
                 ¿[Dónde está|where is] [el baño|the bathroom]?
               • punctuation (¿ ¡ ? ! . ,) goes OUTSIDE the brackets
               • nouns keep their article: [la cuenta|the check] — the engine
                 still treats "article + noun" as one WORD (not a phrase)
               • never use a plain " inside a string — use « » or “ ”
               Every glossed item becomes a spaced-repetition flashcard.
     quiz:     array of questions (see below)
   }

   QUESTION TYPES
   --------------
   Multiple choice:
     { q:"...", opts:["a","b","c"], a:1, skill:"comprehension" }
        a = index of the correct option (0-based)
   Fill in the blank:
     { q:"Type the Spanish for “please”:", opts:[], a:["por favor"], type:"fill",
       skill:"courtesy", explain:"why this is right" }
        a = array of accepted answers (case-, accent- and ¿¡-insensitive)
   Optional flags on any question:
     trick:true   -> a careful-reading question (give it an explain)
     explain:"…"  -> shown after answering (HTML allowed, use <b> for bold)

   Question language: English at L0–L1, simple Spanish at L2–L3.

   SKILLS: the skill string must match a key in SKILLS below. That's how the
   weak-spot coaching knows what to drill. "vocab-*" skills get topped up with
   word questions from their stories; the others never get padded.

   NATIVE CHECK: all Spanish here is AI-DRAFT until a Mexican Spanish speaker
   has read it (see _DECISION_RECORD.md ADR-S03).
   ========================================================================== */

const SKILLS = {
  "comprehension":   { name:"Reading the scene", lesson:"Read the whole scene before answering — the answer is often in the last line. Watch the little flip words: <b>pero</b> (but), <b>no</b> (not), <b>también</b> (also), <b>más</b> (more)." },
  "vocab-daily":     { name:"Everyday words", lesson:"Everyday words. To make them stick, say each one out loud inside a tiny sentence of your own: <b>Quiero agua.</b> <b>¿Dónde está el hotel?</b>" },
  "vocab-food":      { name:"Food & drink", lesson:"Food & drink: <b>el agua</b> water, <b>el café</b>, <b>la cerveza</b> beer, <b>el pollo</b> chicken, <b>la carne</b> meat, <b>los frijoles</b> beans, <b>la tortilla</b>. And the big one: <b>¿pica?</b> — is it spicy?" },
  "vocab-travel":    { name:"Getting around", lesson:"Getting around: <b>a la derecha</b> right, <b>a la izquierda</b> left, <b>derecho</b> straight ahead, <b>la cuadra</b> the block, <b>cerca</b> near, <b>lejos</b> far, <b>el boleto</b> the ticket." },
  "vocab-numbers":   { name:"Numbers, prices & time", lesson:"Numbers and money: <b>uno, dos, tres</b>… <b>diez</b>, <b>veinte</b>, <b>cien</b>. Prices are in <b>pesos</b>. When in doubt, ask <b>¿Cuánto es?</b> and hold up your phone's calculator — totally normal." },
  "vocab-cognates":  { name:"Free words (cognates)", lesson:"Free words! <b>-tion → -ción</b> (información), <b>-ity → -idad</b> (ciudad), <b>-ous → -oso</b> (delicioso). Watch the false friends: <b>embarazada</b> = pregnant, <b>éxito</b> = success, <b>ropa</b> = clothes." },
  "courtesy":        { name:"Magic words", lesson:"Magic words open every door: <b>por favor</b>, <b>gracias</b>, <b>de nada</b>. <b>Disculpe</b> to get attention, <b>perdón</b> for oops, <b>con permiso</b> to squeeze past. Lead with <b>buenos días / buenas tardes</b> — it's polite in Mexico." },
  "phrases":         { name:"Power phrases", lesson:"Learn the chunk, swap the noun: <b>Quiero</b> ___ · <b>¿Me da</b> ___? · <b>Necesito</b> ___ · <b>¿Puedo</b> ___? · <b>¿Hay</b> ___? · <b>Me gusta</b> ___. No conjugation needed." },
  "questions":       { name:"Question words", lesson:"<b>¿qué?</b> what · <b>¿dónde?</b> where · <b>¿cuánto?</b> how much · <b>¿cuándo?</b> when · <b>¿cómo?</b> how · <b>¿quién?</b> who · <b>¿a qué hora?</b> at what time." },
  "pronunciation":   { name:"The sounds", lesson:"Spanish is spelled the way it sounds. Vowels never change: <b>a e i o u</b> = ah, eh, ee, oh, oo. <b>h</b> is silent, <b>j</b> sounds like English h, <b>ll</b> and <b>y</b> like y, <b>ñ</b> like ny." },
  "mexican":         { name:"Mexican Spanish", lesson:"Talk like a local: <b>¿mande?</b> (pardon?), <b>ahorita</b> (now… or later), <b>¡qué padre!</b> / <b>chido</b> (cool), <b>órale</b> (OK / wow), <b>¿neta?</b> (really?). Say <b>carro</b>, <b>celular</b>, <b>jugo</b>." },
  "translation":     { name:"Translation", lesson:"Go both ways. Don't just recognise Spanish → English — make yourself say the Spanish from the English, out loud. That's where speaking comes from." },
  "voy-a":           { name:"Voy a… (the future)", lesson:"The future cheat code: <b>voy a</b> + any verb as it appears in the dictionary. <b>Voy a comer</b> (I'm going to eat), <b>voy a comprar</b>, <b>vamos a la playa</b> (let's go to the beach). Zero conjugation." },
  "past-chunks":     { name:"The past in chunks", lesson:"The past as ready-made chunks: <b>fui a</b> (I went to), <b>comí</b> (I ate), <b>compré</b> (I bought), <b>vi</b> (I saw), <b>estuvo padre</b> (it was great), <b>me gustó</b> (I liked it). Memorise them whole." },
  "ser-estar":       { name:"Soy… / Estoy…", lesson:"Two ways to say 'I am': <b>soy</b> for who you are (<b>soy de Canadá</b>, <b>soy doctor</b>) and <b>estoy</b> for how or where you are right now (<b>estoy cansado</b>, <b>estoy en el hotel</b>)." }
};

/* ============================================================================
   L0
   ========================================================================== */
/* LEVEL L0 — Cero · Zero */
const STORIES_L0 = [

  { id:"l0-hola", level:"L0", diff:1, titleEs:"¡Hola!", titleEn:"Hi!",
    text:"— ¡[Hola|hi]! [Me llamo|my name is] Ana. ¿[Y tú|and you]?\n— ¡[Hola|hi]! [Me llamo|my name is] Sam.\n— [Mucho gusto|nice to meet you], Sam.\n— [Mucho gusto|nice to meet you], Ana. ¿[Cómo estás|how are you]?\n— [Muy|very] [bien|good / fine], [gracias|thank you]. ¿[Y tú|and you]?\n— [Bien|good / fine], [gracias|thank you]. ¡[Todo bien|all good]!",
    quiz:[
      { q:"What is her name?", opts:["Sam","Ana","Sofía"], a:1, skill:"comprehension" },
      { q:"What does «mucho gusto» mean?", opts:["nice to meet you","how are you","thank you very much"], a:0, skill:"courtesy" },
      { q:"Ana says «¿Y tú?». What does it mean?", opts:["are you OK?","who are you?","and you?"], a:2, skill:"vocab-daily", explain:"<b>¿Y tú?</b> = and you? Toss it back after any answer." },
      { q:"Type the Spanish for “thank you”:", opts:[], a:["gracias"], type:"fill", skill:"courtesy", explain:"<b>gracias</b> = thank you." }
    ]},

  { id:"l0-aeropuerto", level:"L0", diff:2, titleEs:"¡Bienvenido a México!", titleEn:"Welcome to Mexico!",
    text:"[El aeropuerto|the airport] de Cancún.\n— [Buenos días|good morning]. [Su pasaporte|your passport], [por favor|please].\n— [Aquí está|here it is].\n— ¿[Turismo|tourism]?\n— [Sí|yes]. [Una semana|one week].\n— ¡[Perfecto|perfect]! [Bienvenido|welcome] a México.\n— ¡[Gracias|thank you]!\n[Afuera|outside] [hay|there is / there are] [un taxi|a taxi].\n— ¿[Adónde|where to]?\n— [Al hotel|to the hotel] Sol, [por favor|please].\n— ¡[Perfecto|perfect]!",
    quiz:[
      { q:"What does the officer ask for?", opts:["your ticket","your passport","your hotel"], a:1, skill:"vocab-travel" },
      { q:"How long is your trip?", opts:["one week","one day","one month"], a:0, skill:"comprehension" },
      { q:"Where do you ask the taxi to take you?", opts:["the airport","the beach","Hotel Sol"], a:2, skill:"vocab-travel" },
      { q:"«Turismo» is a free word (a cognate). It means…", opts:["turtle","tourism","tour bus"], a:1, skill:"vocab-cognates", explain:"<b>turismo</b> = tourism. Say it at immigration and you're through." }
    ]},

  { id:"l0-cafe", level:"L0", diff:3, titleEs:"Un café, por favor", titleEn:"A coffee, please",
    text:"En [una cafetería|a coffee shop] de Oaxaca.\n— ¡[Buenos días|good morning]! ¿[Qué va a querer|what will you have]?\n— [Un café|a coffee], [por favor|please].\n— ¿[Grande|large] [o|or] [chico|small]?\n— [Chico|small], [por favor|please].\n— ¿[Algo más|anything else]?\n— No, [gracias|thank you].\n— [Aquí tiene|here you go].\n— ¡[Gracias|thank you]!\n— [De nada|you're welcome].\nMmm… ¡[delicioso|delicious]!",
    quiz:[
      { q:"What size coffee do you order?", opts:["large","small","medium"], a:1, skill:"comprehension" },
      { q:"The barista asks «¿Algo más?». What does it mean?", opts:["anything else?","how much?","for here?"], a:0, skill:"vocab-daily" },
      { q:"You say «gracias». The barista answers…", opts:["por favor","mucho gusto","de nada"], a:2, skill:"courtesy", explain:"<b>de nada</b> = you're welcome." },
      { q:"Type the Spanish for “please”:", opts:[], a:["por favor"], type:"fill", skill:"courtesy", explain:"<b>por favor</b> = please." }
    ]},

  { id:"l0-numeros", level:"L0", diff:4, titleEs:"Uno, dos, tres… tacos", titleEn:"One, two, three… tacos",
    text:"— ¡[Buenas noches|good evening]! ¿[Cuántos|how many]?\n— [Cinco tacos|five tacos], [por favor|please].\n— ¿Y [de tomar|to drink]?\n— [Un agua de jamaica|a hibiscus water].\nDoña Lupe [cuenta|counts]:\n[uno|one], [dos|two], [tres|three], [cuatro|four], [cinco|five].\n¡Mmm! ¡[Qué rico|how tasty]!\n— ¡[Otros cinco|five more], [por favor|please]!\n— ¡[Órale|OK / wow / come on]! [Seis|six], [siete|seven], [ocho|eight], [nueve|nine]… ¡[diez|ten]!",
    quiz:[
      { q:"How many tacos do you order first?", opts:["three","five","ten"], a:1, skill:"vocab-numbers" },
      { q:"What do you drink?", opts:["a Coke","a coffee","a hibiscus water"], a:2, skill:"vocab-food", explain:"<b>agua de jamaica</b> = a sweet, cold hibiscus drink. Every taco stand has it." },
      { q:"How many tacos do you eat in total?", opts:["ten","five","eight"], a:0, skill:"vocab-numbers", explain:"cinco + <b>otros cinco</b> (five more) = <b>diez</b>." },
      { q:"Type the Spanish for “three”:", opts:[], a:["tres"], type:"fill", skill:"vocab-numbers", explain:"<b>tres</b> = three." }
    ]},

  { id:"l0-bano", level:"L0", diff:5, titleEs:"¿Dónde está el baño?", titleEn:"Where's the bathroom?",
    text:"— [Disculpe|excuse me]. ¿[Dónde está|where is] [el baño|the bathroom]?\n— [Al fondo|at the back], [a la derecha|to the right].\n— ¿[Aquí|here]?\n— No, [ahí|there].\n— ¡[Gracias|thank you]!\n[Hay|there is / there are] [dos puertas|two doors]: «H» [y|and] «M».\n«H» [es para|is for] [hombres|men].\n¡[Ojo|watch out]! «M» [es para|is for] [mujeres|women].",
    quiz:[
      { q:"Where is the bathroom?", opts:["at the back, to the left","at the back, to the right","next to the door"], a:1, skill:"vocab-travel" },
      { q:"You point and ask «¿Aquí?». What are you asking?", opts:["there?","now?","here?"], a:2, skill:"vocab-daily", explain:"<b>aquí</b> = here · <b>ahí</b> = there." },
      { q:"Which door is for men?", opts:["«M»","«H»","both"], a:1, skill:"comprehension", trick:true, explain:"<b>H</b> = <b>hombres</b> (men). <b>M</b> = <b>mujeres</b> (women). The classic tourist mistake!" },
      { q:"What do you say first to get someone's attention?", opts:["disculpe","de nada","mucho gusto"], a:0, skill:"courtesy", explain:"<b>disculpe</b> = excuse me." }
    ]},

  { id:"l0-no-entiendo", level:"L0", diff:6, titleEs:"Sí, no, no entiendo", titleEn:"Yes, no, I don't understand",
    text:"[En el mercado|at the market]. [La señora|the lady] [habla|talks] [muy rápido|very fast].\n— ¿[Mande|pardon?]? [No entiendo|I don't understand]. [Más despacio|slower], [por favor|please].\n— ¿[Cuántos|how many]… [mangos|mangoes]?\n— Mmm… [no sé|I don't know]. ¿[Habla inglés|do you speak English]?\n— No, no. ¿[Tres|three]?\n— ¡[Sí|yes]! [Tres|three], [por favor|please]. ¡[Gracias|thank you]!",
    quiz:[
      { q:"What's the problem at the market?", opts:["the mangoes are expensive","the lady talks very fast","the market is closed"], a:1, skill:"comprehension" },
      { q:"«¿Mande?» is the polite Mexican way to say…", opts:["how much?","hello?","pardon?"], a:2, skill:"mexican", explain:"Mexicans say <b>¿mande?</b> when they didn't catch something. Much politer than «¿qué?»." },
      { q:"How do you ask «Do you speak English?»", opts:["¿Habla inglés?","¿Mande?","¿Cuántos?"], a:0, skill:"phrases" },
      { q:"Type the Spanish for “I don't understand”:", opts:[], a:["no entiendo"], type:"fill", skill:"phrases", explain:"<b>no entiendo</b> = I don't understand. Add <b>más despacio, por favor</b> and you're saved." }
    ]}

];

const LESSONS_L0 = [

  { id:"l0L-sonidos", level:"L0", diff:1, title:"Los sonidos", titleEn:"The sounds",
    body:"Good news: Spanish is spelled the way it sounds. Learn these and you can read anything out loud.<br><br>• <b>Vowels never change:</b> a (ah), e (eh), i (ee), o (oh), u (oo). <b>taco</b> = TAH-koh.<br>• <b>h</b> is silent: <b>hola</b> = OH-lah.<br>• <b>j</b> is a breathy English h: <b>jugo</b> (juice) = HOO-goh.<br>• <b>ll</b> and <b>y</b> sound like English y: <b>pollo</b> (chicken) = POH-yoh, <b>yo</b> (I) = yoh.<br>• <b>ñ</b> = ny, like canyon: <b>mañana</b> (tomorrow) = mah-NYAH-nah.<br>• <b>rr</b> rolls, like a little purr: <b>burrito</b>.<br>• An accent mark shows where to push: <b>café</b> = kah-FEH.<br><br>💡 Pro tip: Don't sweat a perfect rr. Mexicans will understand you, and they'll love that you tried.",
    practice:[
      { q:"In Spanish, the letter h is…", opts:["silent","like English h","like English j"], a:0, skill:"pronunciation", explain:"<b>hola</b> = OH-lah. The h is silent." },
      { q:"«pollo» (chicken) sounds like…", opts:["POH-loh","POL-low","POH-yoh"], a:2, skill:"pronunciation", explain:"<b>ll</b> sounds like English y." },
      { q:"In «café», which part do you push?", opts:["the start: KAH-feh","the end: kah-FEH","neither, it's flat"], a:1, skill:"pronunciation", explain:"The accent mark on <b>é</b> shows where to push." },
      { q:"Translate: «jugo»", opts:["chicken","juice","tomorrow"], a:1, skill:"translation" },
      { q:"Translate into Spanish: «tomorrow»", opts:["pollo","yo","mañana"], a:2, skill:"translation", explain:"<b>mañana</b> = tomorrow (mah-NYAH-nah)." }
    ]},

  { id:"l0L-gratis", level:"L0", diff:2, title:"Palabras gratis", titleEn:"Free words (cognates)",
    body:"You already know hundreds of Spanish words. Most just need a new ending:<br>• <b>-tion → -ción</b>: información, estación (station)<br>• <b>-ity → -idad</b>: ciudad (city), universidad<br>• <b>-ous → -oso</b>: famoso, delicioso<br>• <b>-al</b> stays the same: hospital, normal<br>• <b>-ic → -ico / -ica</b>: fantástico, música<br><br>⚠️ <b>False friends</b> look familiar and lie:<br>• <b>embarazada</b> = pregnant (NOT embarrassed)<br>• <b>éxito</b> = success (NOT exit; the exit sign says <b>SALIDA</b>)<br>• <b>ropa</b> = clothes (NOT rope)<br><br>💡 Pro tip: Embarrassed in Mexico? Say <b>¡qué oso!</b> Literally «what a bear!»",
    practice:[
      { q:"«Estación» means…", opts:["station","statue","state"], a:0, skill:"vocab-cognates" },
      { q:"How do you say «city»?", opts:["universidad","hospital","ciudad"], a:2, skill:"vocab-cognates" },
      { q:"Your friend says she is «embarazada». She is…", opts:["embarrassed","pregnant","hungry"], a:1, skill:"vocab-cognates", trick:true, explain:"<b>embarazada</b> = pregnant. For embarrassed, say <b>¡qué oso!</b>" },
      { q:"Translate: «ropa»", opts:["rope","robe","clothes"], a:2, skill:"translation", explain:"<b>ropa</b> = clothes." },
      { q:"Translate into Spanish: «exit»", opts:["salida","éxito","estación"], a:0, skill:"translation", explain:"<b>éxito</b> = success. The exit is <b>la salida</b>." }
    ]},

  { id:"l0L-magicas", level:"L0", diff:3, title:"Palabras mágicas", titleEn:"Magic words",
    body:"Three words that open every door:<br>• <b>por favor</b> = please<br>• <b>gracias</b> = thank you<br>• <b>de nada</b> = you're welcome<br><br>Three ways to say «sorry / excuse me»:<br>• <b>perdón</b> = sorry (oops, I bumped you)<br>• <b>disculpe</b> = excuse me (to get someone's attention)<br>• <b>con permiso</b> = excuse me (squeezing past)<br><br>Say hi by the clock:<br>• <b>buenos días</b> = good morning (until noon)<br>• <b>buenas tardes</b> = good afternoon (until dark)<br>• <b>buenas noches</b> = good evening / good night<br><br>💡 Pro tip: Didn't catch that? Say <b>¿mande?</b>, the polite Mexican «pardon?». A bare «¿qué?» can sound rude. And greet before you ask: «Buenas tardes… ¿dónde está el baño?»<br><br>💡 <b>usted</b> or <b>tú</b>? You don't have to choose: the polite chunks this app teaches (<b>¿Me da…?</b>, <b>Disculpe</b>, <b>¿Tiene…?</b>) are already the respectful <b>usted</b> form — right for waiters, drivers, pharmacists and anyone older. With new friends your own age you'll hear <b>tú</b> (<b>¿Tienes…?</b>, <b>Disculpa</b>). Being too polite with a friend is charming; being too casual with an official is the one that stings.",
    practice:[
      { q:"You need to squeeze past someone on the metro. You say…", opts:["perdón","con permiso","de nada"], a:1, skill:"courtesy", explain:"<b>con permiso</b> = excuse me (passing)." },
      { q:"It's 3 p.m. You walk into a shop and say…", opts:["buenos días","buenas noches","buenas tardes"], a:2, skill:"courtesy", explain:"<b>buenas tardes</b> runs from noon until dark." },
      { q:"You didn't hear the waiter. The polite Mexican way to say «pardon?» is…", opts:["¿mande?","¿qué?","¿cómo estás?"], a:0, skill:"mexican", explain:"<b>¿mande?</b> is polite. A bare «¿qué?» can sound rude." },
      { q:"Translate: «de nada»", opts:["you're welcome","thank you","please"], a:0, skill:"translation" },
      { q:"Translate into Spanish: «excuse me» (to call the waiter)", opts:["con permiso","disculpe","perdón"], a:1, skill:"translation", explain:"<b>disculpe</b> gets someone's attention. <b>con permiso</b> is for squeezing past." }
    ]},

  { id:"l0L-numeros", level:"L0", diff:4, title:"Números 0–20", titleEn:"Numbers 0–20",
    body:"<b>0–10:</b> cero, uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez<br><br><b>11–15</b> have their own names. Spot the <b>-ce</b> ending:<br>• once (11), doce (12), trece (13), catorce (14), quince (15)<br><br><b>16–19</b> are «ten and…» squished into one word, <b>dieci-</b> + the number:<br>• dieciséis (16), diecisiete (17), dieciocho (18), diecinueve (19)<br><br><b>20</b> = veinte<br><br>💡 Pro tip: Hold up fingers while you say the number. «Tres, por favor» + three fingers = no surprise plate of ten tacos. Before a thing, <b>uno</b> shrinks to <b>un</b> or <b>una</b>: un taco, una torta.",
    practice:[
      { q:"What number is «quince»?", opts:["5","15","50"], a:1, skill:"vocab-numbers" },
      { q:"How do you say 12?", opts:["doce","dos","diez"], a:0, skill:"vocab-numbers", explain:"<b>doce</b> = 12 · <b>dos</b> = 2 · <b>diez</b> = 10." },
      { q:"«Dieciocho» is…", opts:["8","80","18"], a:2, skill:"vocab-numbers", explain:"dieci + ocho = ten and eight = <b>18</b>." },
      { q:"Translate: «tres tacos»", opts:["ten tacos","three tacos","two tacos"], a:1, skill:"translation" },
      { q:"Type the number 20 in Spanish:", opts:[], a:["veinte"], type:"fill", skill:"translation", explain:"<b>veinte</b> = 20." }
    ]}

];

/* ============================================================================
   L1
   ========================================================================== */
/* LEVEL L1 — Sobrevivir · Survival */
const STORIES_L1 = [

  { id:"l1-tacos", level:"L1", diff:1, titleEs:"Tacos al pastor", titleEn:"Pastor tacos",
    text:"[Son las diez de la noche|it's ten at night] en CDMX. Doña Lupe [tiene|has] [un puesto|a stand] de tacos en [la esquina|the corner].\n— ¡[Buenas noches|good evening]! ¿[Qué va a querer|what will you have]?\n— ¿[Me da|can I have] [tres tacos|three tacos] de pastor, [por favor|please]?\n— ¿[Con todo|with everything]?\n— Sí, con todo.\nDoña Lupe [pone|puts on] [la cebolla|the onion] y [el cilantro|the cilantro].\n— ¿[La salsa verde|the green salsa] [pica|is spicy]?\n— [Poquito|a little]. [La roja|the red one] [pica más|is spicier].\n— ¡Perfecto! Y [un refresco|a soda], por favor.\n— [Aquí tiene|here you go].\n— ¿[Cuánto es|how much is it (total)]?\n— [Ochenta pesos|eighty pesos].",
    quiz:[
      { q:"What do you order?", opts:["two tacos and a water","three tacos and a soda","three quesadillas and a juice"], a:1, skill:"vocab-food", explain:"<b>tres tacos</b> = three tacos, <b>un refresco</b> = a soda." },
      { q:"You say «con todo». What does Doña Lupe put on your tacos?", opts:["cheese and cream","only salsa","onion and cilantro"], a:2, skill:"mexican", explain:"At a taco stand, <b>con todo</b> (with everything) means onion and cilantro." },
      { q:"Which salsa is spicier?", opts:["the red one","the green one","neither, both are mild"], a:0, skill:"comprehension", explain:"<b>La roja pica más</b> = the red one is spicier. The green one? <b>Poquito</b> (a little)." },
      { q:"Type the Spanish for “can I have” (to order):", opts:[], a:["me da"], type:"fill", skill:"phrases", explain:"<b>¿Me da…?</b> = can I have…? It's the everyday way to order in Mexico." }
    ]},

  { id:"l1-taxi", level:"L1", diff:2, titleEs:"El taxi de Don Beto", titleEn:"Don Beto's taxi",
    text:"[Estás|you are] en Playa del Carmen, en el taxi de Don Beto.\n— [Buenas tardes|good afternoon]. ¿[A dónde vamos|where are we going]?\n— [Al hotel|to the hotel] Sol, [por favor|please].\n— ¡[Órale|OK / wow / come on]! ¿Es [su primera vez|your first time] en Playa del Carmen?\n— [Perdón|sorry]… ¡[más despacio|slower], por favor!\nDon Beto [se ríe|laughs] y [maneja|drives] más despacio.\n[Miras|you look at] [el mapa|the map] en [el celular|the cell phone].\n— [Aquí|here], [a la izquierda|to the left]. [Luego|then] [derecho|straight ahead].\n— ¿Y el hotel?\n— [En la esquina|on the corner], [a la derecha|to the right]. ¡[Aquí está bien|here is fine]!\n— ¿[Cuánto es|how much is it (total)]?\n— [Cien pesos|a hundred pesos].\n— [Aquí tiene|here you go]. ¡[Gracias|thank you]!",
    quiz:[
      { q:"Where do you ask Don Beto to take you?", opts:["to the airport","to the Hotel Sol","to the market"], a:1, skill:"comprehension", explain:"<b>Al hotel Sol, por favor</b> = to the Hotel Sol, please." },
      { q:"You say «¡Más despacio, por favor!». What does Don Beto do?", opts:["He drives slower","He speaks in English","He stops the taxi"], a:0, skill:"comprehension", trick:true, explain:"<b>Más despacio</b> = slower. You meant «talk slower», but Don Beto laughs and slows the taxi down. 😄" },
      { q:"What does «derecho» mean?", opts:["to the right","to the left","straight ahead"], a:2, skill:"vocab-travel", trick:true, explain:"Careful: <b>derecho</b> = straight ahead. <b>A la derecha</b> = to the right." },
      { q:"Type the Spanish for “here is fine” (to stop the taxi):", opts:[], a:["aquí está bien"], type:"fill", skill:"phrases", explain:"<b>Aquí está bien</b> = here is fine. Say it and the driver pulls over." }
    ]},

  { id:"l1-hotel", level:"L1", diff:3, titleEs:"En la recepción", titleEn:"Checking in",
    text:"[Llegas|you arrive] al Hotel Sol, en Playa del Carmen. Sofía está en [la recepción|the front desk].\n— ¡Hola, buenas tardes! ¿[En qué le puedo ayudar|how can I help you]?\n— [Buenas tardes|good afternoon]. [Tengo una reservación|I have a reservation].\n— ¿[A nombre de|under the name of] [quién|who]?\n— A nombre de Sam Brown.\n— Perfecto. [Su habitación|your room] es la [doce|twelve]. [Aquí está|here is] [la llave|the key].\n— Gracias. ¿Y [el wifi|the wifi]? ¿[Cuál es|what is] [la contraseña|the password]?\n— Es «playasol», [todo junto|all one word].\n— ¿[A qué hora|at what time] es [el desayuno|the breakfast]?\n— [De siete a diez|from seven to ten], en el restaurante. Y está [incluido|included].\n— ¡[Qué padre|how cool]! [Gracias|thank you].\n— [De nada|you're welcome]. ¡[Que descanse|rest well]!",
    quiz:[
      { q:"What's the first thing you tell Sofía?", opts:["I need a taxi","Where is the bathroom?","I have a reservation"], a:2, skill:"phrases", explain:"<b>Tengo una reservación</b> = I have a reservation." },
      { q:"What is your room number?", opts:["two","twelve","ten"], a:1, skill:"vocab-numbers", explain:"<b>doce</b> = twelve." },
      { q:"When is breakfast, and do you pay extra?", opts:["7 to 10, and it's included","7 to 10, and it costs extra","10 to 12, and it's included"], a:0, skill:"comprehension", explain:"<b>De siete a diez</b> (from seven to ten), and it's <b>incluido</b> (included). ¡Qué padre!" },
      { q:"Type the Spanish for “the password”:", opts:[], a:["la contraseña","contraseña"], type:"fill", skill:"vocab-travel", explain:"<b>la contraseña</b> = the password. Ask: ¿Cuál es la contraseña del wifi?" }
    ]},

  { id:"l1-oxxo", level:"L1", diff:4, titleEs:"En el OXXO", titleEn:"At the OXXO",
    text:"[Hace mucho calor|it's very hot] en Mérida. [Entras a|you go into] [un OXXO|an OXXO (corner store)] y [tomas|you grab] [dos aguas|two (bottles of) water] y [unas papas|some chips].\n— Buenas tardes. ¿[Algo más|anything else]?\n— Sí, [una bolsa|a bag], [por favor|please].\n— Son [cuarenta y nueve cincuenta|forty-nine fifty]. ¿[En efectivo|in cash] o [con tarjeta|by card]?\n— En efectivo. [Aquí tiene|here you go] [cien|a hundred].\n— ¿[Gusta redondear|would you like to round up]?\n— Mmm… sí, ¿[por qué no|why not]?\n[La cajera|the cashier] [te da|gives you] [el cambio|the change]: [cincuenta pesos|fifty pesos].\n— ¡[Gracias|thank you]! [Hasta luego|see you later].",
    quiz:[
      { q:"What do you grab in the OXXO?", opts:["a coffee and a sandwich","a soda and some candy","two waters and some chips"], a:2, skill:"vocab-food", explain:"<b>dos aguas</b> = two (bottles of) water, <b>unas papas</b> = some chips." },
      { q:"The cashier asks «¿En efectivo o con tarjeta?». What is she asking?", opts:["Here or to go?","Cash or card?","Bag or no bag?"], a:1, skill:"vocab-daily", explain:"<b>en efectivo</b> = in cash, <b>con tarjeta</b> = by card." },
      { q:"At OXXO, what does «¿Gusta redondear?» mean?", opts:["Would you like to round up (for charity)?","Would you like a receipt?","Would you like a bag?"], a:0, skill:"mexican", explain:"OXXO cashiers ask this all the time: round your total up to the next peso, and the extra centavos go to charity." },
      { q:"You pay with 100 pesos. How much change do you get?", opts:["forty-nine pesos","a hundred pesos","fifty pesos"], a:2, skill:"vocab-numbers", trick:true, explain:"The total was 49.50, but you said sí to <b>redondear</b>, so it became 50. Your change: <b>cincuenta pesos</b>." }
    ]},

  { id:"l1-farmacia", level:"L1", diff:5, titleEs:"En la farmacia", titleEn:"At the pharmacy",
    text:"[Pasas todo el día|you spend all day] en [la playa|the beach] de Tulum. ¡Mucho sol! [Ahora|now] [entras a|you go into] [la farmacia|the pharmacy].\n— [Buenas tardes|good afternoon]. ¿[En qué le puedo ayudar|how can I help you]?\n— [Me duele la cabeza|my head hurts]. [Necesito|I need] [algo para|something for] [el dolor|the pain]. ¿[Tiene|do you have] [paracetamol|acetaminophen]?\n— [Sí|yes], [claro|of course]. ¿[Una caja|a box]?\n— Sí, [por favor|please]. ¿[Cada cuánto|how often]?\n— Una [cada ocho horas|every eight hours], [con comida|with food]. Y [tome mucha agua|drink lots of water].\n— Gracias. Y… [me duele el estómago|my stomach hurts]. ¡[Comí|I ate] muchos tacos!\n— Ja, ja. Para el estómago, [un suero|an electrolyte drink]. Es muy bueno con [el calor|the heat].\n— Perfecto. ¿[Cuánto es|how much is it (total)]?\n— [Ciento veinte pesos|a hundred twenty pesos].",
    quiz:[
      { q:"What hurts first?", opts:["your stomach","your head","your back"], a:1, skill:"comprehension", explain:"<b>Me duele la cabeza</b> = my head hurts." },
      { q:"How often do you take the paracetamol?", opts:["every two hours","once a day","every eight hours"], a:2, skill:"vocab-numbers", explain:"<b>Una cada ocho horas</b> = one every eight hours. Ask for medicine <b>by name</b> — <b>¿Tiene paracetamol?</b> — instead of accepting unnamed pills over the counter." },
      { q:"What does the pharmacist give you for your stomach?", opts:["an electrolyte drink (suero)","a soda","more tacos"], a:0, skill:"mexican", explain:"<b>Suero</b> (an electrolyte drink) is sold in every Mexican pharmacy and OXXO. Locals swear by it for heat and upset stomachs." },
      { q:"Type the Spanish for “I need”:", opts:[], a:["necesito"], type:"fill", skill:"phrases", explain:"<b>Necesito algo para…</b> = I need something for… Swap in the problem." }
    ]},

  { id:"l1-perdido", level:"L1", diff:6, titleEs:"Perdido en el centro", titleEn:"Lost downtown",
    text:"[Estás|you are] en [el centro|downtown] de Oaxaca. [Buscas|you're looking for] [el Zócalo|the main square].\n— [Disculpe|excuse me]. ¿[Dónde está|where is] el Zócalo?\n— ¿[Mande|pardon?]?\n— [Perdón|sorry]… ¿dónde está el Zócalo?\n— ¡Ah! Está [a dos cuadras|two blocks away]. [Siga|keep going] [derecho|straight ahead] y [en la esquina|on the corner], [a la izquierda|to the left].\n— ¿Está [lejos|far]?\n— No, está muy [cerca|near]. [Cinco minutos|five minutes] [caminando|on foot].\n— ¡[Muchas gracias|thank you very much]!\n— [De nada|you're welcome]. ¡Y [pruebe|try] [el mole|the mole]!\n[Caminas|you walk] dos cuadras… y [ahí está|there it is]: [la catedral|the cathedral], [la música|the music] ¡y [mucha gente|lots of people]!",
    quiz:[
      { q:"What are you looking for?", opts:["the bus station","the main square (el Zócalo)","the market"], a:1, skill:"comprehension", explain:"<b>el Zócalo</b> = the main square." },
      { q:"The woman didn't hear you. What does she say?", opts:["¡Órale!","¡Qué padre!","¿Mande?"], a:2, skill:"mexican", explain:"<b>¿Mande?</b> = pardon? It's the polite, very Mexican way to say «what?»." },
      { q:"How far is the Zócalo?", opts:["two blocks, so it's near","twenty blocks, so it's far","two kilometers"], a:0, skill:"vocab-travel", explain:"<b>A dos cuadras</b> = two blocks away. <b>Cerca</b> = near." },
      { q:"At the corner, which way do you turn?", opts:["right","left","you don't turn"], a:1, skill:"vocab-travel", explain:"<b>En la esquina, a la izquierda</b> = on the corner, to the left." }
    ]}
];

const LESSONS_L1 = [

  { id:"l1L-quiero", level:"L1", diff:1, title:"Quiero… / ¿Me da…?", titleEn:"Ordering anything",
    body:"Two chunks will feed you for the whole trip. Learn them once, then just swap the noun.<br><br><b>Quiero…</b> = I want…<br><b>¿Me da…?</b> = can I have…?<br>Add <b>por favor</b> and you're golden.<br><br>• <b>Quiero un café, por favor.</b> = I want a coffee, please.<br>• <b>¿Me da dos tacos, por favor?</b> = can I have two tacos, please?<br>• <b>¿Me da la cuenta?</b> = can I have the check?<br>• <b>Quiero agua, por favor.</b> = I want water, please.<br>• <b>¿Me da una bolsa?</b> = can I have a bag?<br>• <b>Quiero una cerveza.</b> = I want a beer.<br><br>💡 <b>Pro tip:</b> in Mexico, <b>¿Me da…?</b> is the everyday way to order: taco stands, OXXO, bakeries, everywhere. It sounds friendly, not pushy. (Spain says «me pone». Skip that one here.)",
    practice:[
      { q:"What does «¿Me da…?» mean?", opts:["can I have…?","where is…?","how much is…?"], a:0, skill:"phrases", explain:"<b>¿Me da…?</b> = can I have…?" },
      { q:"How do you say “I want a coffee, please”?", opts:["¿Dónde está un café?","Quiero un café, por favor.","Un café es bueno."], a:1, skill:"phrases", explain:"<b>Quiero</b> = I want. Add <b>por favor</b>." },
      { q:"Translate: «¿Me da la cuenta?»", opts:["Where is the bathroom?","I want the menu.","Can I have the check?"], a:2, skill:"translation", explain:"<b>la cuenta</b> = the check." },
      { q:"Type in Spanish: “can I have two tacos, please?”", opts:[], a:["me da dos tacos por favor"], type:"fill", skill:"translation", explain:"<b>¿Me da dos tacos, por favor?</b>" },
      { q:"In Mexico, what's the everyday way to order at a taco stand?", opts:["«Me pone…»","«¿Dónde está…?»","«¿Me da…?»"], a:2, skill:"phrases", explain:"<b>¿Me da…?</b> is the Mexican everyday order. «Me pone» is Spain." }
    ]},

  { id:"l1L-donde", level:"L1", diff:2, title:"¿Dónde está…?", titleEn:"Finding anything",
    body:"<b>¿Dónde está…?</b> = where is…? Add any place and you'll never stay lost for long.<br><br>• <b>¿Dónde está el baño?</b> = where is the bathroom?<br>• <b>¿Dónde está el metro?</b> = where is the metro?<br><br>Start with <b>Disculpe</b> (excuse me). Then listen for:<br>• <b>a la derecha</b> = to the right<br>• <b>a la izquierda</b> = to the left<br>• <b>derecho</b> = straight ahead (not «right»!)<br>• <b>en la esquina</b> = on the corner<br>• <b>a dos cuadras</b> = two blocks away<br>• <b>cerca</b> = near · <b>lejos</b> = far<br><br>💡 <b>Pro tip:</b> Mexicans give directions in <b>cuadras</b> (blocks). And if someone says <b>«aquí nomás»</b> (just right here), it might still be a few blocks. Keep walking and ask again.",
    practice:[
      { q:"What does «derecho» mean?", opts:["to the right","straight ahead","behind"], a:1, skill:"vocab-travel", trick:true, explain:"<b>derecho</b> = straight ahead. <b>a la derecha</b> = to the right." },
      { q:"How do you say “to the left”?", opts:["a la izquierda","a la derecha","lejos"], a:0, skill:"vocab-travel", explain:"<b>a la izquierda</b> = to the left." },
      { q:"Translate: «Está a dos cuadras, en la esquina.»", opts:["It's two minutes away, on the left.","It's far, near the metro.","It's two blocks away, on the corner."], a:2, skill:"translation", explain:"<b>a dos cuadras</b> = two blocks away, <b>en la esquina</b> = on the corner." },
      { q:"Type in Spanish: “where is the bathroom?”", opts:[], a:["dónde está el baño"], type:"fill", skill:"translation", explain:"<b>¿Dónde está el baño?</b>" },
      { q:"A woman tells you «Está muy cerca». Good news?", opts:["No, it's very far","Yes, it's very near","No, it's closed"], a:1, skill:"vocab-travel", explain:"<b>cerca</b> = near, <b>lejos</b> = far." }
    ]},

  { id:"l1L-pesos", level:"L1", diff:3, title:"¿Cuánto cuesta?", titleEn:"Prices & pesos",
    body:"You know 0–20. Now count by tens:<br><b>veinte</b> 20 · <b>treinta</b> 30 · <b>cuarenta</b> 40 · <b>cincuenta</b> 50 · <b>sesenta</b> 60 · <b>setenta</b> 70 · <b>ochenta</b> 80 · <b>noventa</b> 90 · <b>cien</b> 100<br><br>In between, just add <b>y</b>: <b>treinta y cinco</b> = 35.<br>Over 100, cien becomes <b>ciento</b>: <b>ciento cincuenta pesos</b> = 150. And <b>doscientos pesos</b> = 200.<br><br>• <b>¿Cuánto cuesta?</b> = how much is it? (one thing)<br>• <b>¿Cuánto es?</b> = how much is it? (the total)<br>• <b>en efectivo</b> = in cash · <b>con tarjeta</b> = by card<br><br>💡 <b>Pro tip:</b> carry small bills and coins. Taco stands, markets and many taxis want <b>efectivo</b>, and a 500-peso bill can make a street vendor sigh.",
    practice:[
      { q:"What number is «setenta»?", opts:["60","70","17"], a:1, skill:"vocab-numbers", explain:"<b>setenta</b> = 70. (<b>sesenta</b> = 60.)" },
      { q:"How do you say 150 pesos?", opts:["ciento cincuenta pesos","cien y cincuenta pesos","cincuenta pesos"], a:0, skill:"vocab-numbers", explain:"Over 100, <b>cien</b> becomes <b>ciento</b>: <b>ciento cincuenta</b>." },
      { q:"You're at the register with a full basket. Which question asks for the total?", opts:["¿Cuánto cuesta?","¿Dónde está?","¿Cuánto es?"], a:2, skill:"vocab-numbers", explain:"<b>¿Cuánto es?</b> = how much is it (total). <b>¿Cuánto cuesta?</b> is for one thing." },
      { q:"Translate: «Noventa pesos, en efectivo.»", opts:["Nineteen pesos, by card.","Ninety pesos, in cash.","Nine pesos, in cash."], a:1, skill:"translation", explain:"<b>noventa</b> = 90, <b>en efectivo</b> = in cash." },
      { q:"Type in Spanish: “how much is it?” (for one thing)", opts:[], a:["cuánto cuesta"], type:"fill", skill:"translation", explain:"<b>¿Cuánto cuesta?</b>" }
    ]},

  { id:"l1L-preguntas", level:"L1", diff:4, title:"Las preguntas", titleEn:"Question words",
    body:"Seven little words unlock almost every conversation. Each comes with a travel line you can steal:<br><br>• <b>¿Qué?</b> = what? · <b>¿Qué es esto?</b> = what is this?<br>• <b>¿Dónde?</b> = where? · <b>¿Dónde está el metro?</b> = where is the metro?<br>• <b>¿Cuánto?</b> = how much? · <b>¿Cuánto cuesta?</b> = how much is it?<br>• <b>¿Cuándo?</b> = when? · <b>¿Cuándo sale el camión?</b> = when does the bus leave?<br>• <b>¿Cómo?</b> = how? · <b>¿Cómo se dice «straw»?</b> = how do you say «straw»? (It's <b>popote</b>.)<br>• <b>¿Quién?</b> = who? · <b>¿Quién es?</b> = who is it?<br>• <b>¿A qué hora?</b> = at what time? · <b>¿A qué hora es el desayuno?</b> = what time is breakfast?<br><br>💡 <b>Pro tip:</b> didn't catch something? A bare «¿Qué?» can sound blunt. In Mexico, say <b>¿Mande?</b> (pardon?).",
    practice:[
      { q:"What does «¿Cuándo?» mean?", opts:["how?","when?","how much?"], a:1, skill:"questions", explain:"<b>¿Cuándo?</b> = when? Don't mix it up with <b>¿Cuánto?</b> = how much?" },
      { q:"You want to know what time breakfast is. Which question do you need?", opts:["¿A qué hora?","¿Quién?","¿Dónde?"], a:0, skill:"questions", explain:"<b>¿A qué hora es el desayuno?</b> = what time is breakfast?" },
      { q:"Translate: «¿Cuándo sale el camión?»", opts:["Where is the bus?","How much is the bus?","When does the bus leave?"], a:2, skill:"translation", explain:"<b>¿Cuándo?</b> = when? <b>el camión</b> = the (city) bus in Mexico." },
      { q:"Type in Spanish: “where is the metro?”", opts:[], a:["dónde está el metro"], type:"fill", skill:"translation", explain:"<b>¿Dónde está el metro?</b>" },
      { q:"You didn't hear the waiter. What's the polite Mexican way to say “pardon?”", opts:["¿Qué?","¿Quién?","¿Mande?"], a:2, skill:"questions", explain:"<b>¿Mande?</b> = pardon? A bare «¿Qué?» can sound blunt." }
    ]}
];

/* ============================================================================
   L2
   ========================================================================== */
/* LEVEL L2 — De viaje · On the road */
const STORIES_L2 = [

  { id:"l2-mercado", level:"L2", diff:1, titleEs:"El mercado", titleEn:"The market",
    text:"[El mercado|the market] de Mérida. [Hay|there is / there are] [fruta|fruit] [por todos lados|everywhere].\n— ¡[Pásele|come on in], [pásele|come on in]! ¿[Qué le damos|what can I get you]?\n— [Buenos días|good morning]. ¿[Cuánto cuesta|how much is it] [el mango|the mango]?\n— [Cuarenta pesos|forty pesos] [el kilo|per kilo]. ¡[Está barato|it's cheap]!\n— [Quiero|I want] [un kilo|a kilo], [por favor|please]. ¿Y [la piña|the pineapple]?\n— [Treinta|thirty]. Y [la papaya|the papaya], [cincuenta|fifty]. [Está muy dulce|it's very sweet].\n— [También|also] [una piña|a pineapple] y [una papaya|a papaya]. ¿[Cuánto es|how much is it (total)]?\n— [Son ciento veinte pesos|that's 120 pesos].\n— [Me llevo todo|I'll take everything]. ¿[Me hace un descuento|can I get a discount]?\n— [Ándele|all right then]… [se lo dejo en cien|I'll do it for 100].\n— ¡[Perfecto|perfect]! [Muchas gracias|thank you very much].\n— ¿[Algo más|anything else]?\n— No, [es todo|that's all]. ¡[Hasta luego|see you later]!",
    quiz:[
      { q:"¿Cuánto cuesta el kilo de mango?", opts:["treinta pesos","cincuenta pesos","cuarenta pesos"], a:2, skill:"vocab-numbers" },
      { q:"¿Qué fruta cuesta treinta pesos?", opts:["la piña","la papaya","el mango"], a:0, skill:"vocab-food" },
      { q:"¿Cuánto pagas al final? (How much do you pay in the end?)", opts:["ciento veinte pesos","cien pesos","ochenta pesos"], a:1, skill:"comprehension", trick:true,
        explain:"The total is 120, but you ask for a discount and the seller says <b>se lo dejo en cien</b>: I'll do it for 100." },
      { q:"¿Cómo se dice “can I get a discount” en español?", opts:[], a:["me hace un descuento","me hace un descuentito"], type:"fill", skill:"phrases",
        explain:"<b>¿Me hace un descuento?</b> is fair game for crafts, souvenirs and when you're buying a lot — like here, three things at once. Haggling over a single kilo of fairly-priced fruit reads as cheap; ask for <b>un pilón</b> (a little extra thrown in) instead." }
    ]},

  { id:"l2-camion", level:"L2", diff:2, titleEs:"El ADO a Tulum", titleEn:"The ADO bus to Tulum",
    text:"[La terminal|the bus station] ADO de Playa del Carmen. [Hace calor|it's hot].\n— [Buenos días|good morning]. [Un boleto|a ticket] a Tulum, [por favor|please].\n— ¿[Sencillo|one-way] o [redondo|round trip]?\n— [Ida y vuelta|round trip], [por favor|please]. ¿[A qué hora sale|what time does it leave]?\n— [Hay|there is / there are] uno [a las diez|at ten] y [otro|another] [a las once y media|at eleven thirty].\n— [A las diez|at ten], [por favor|please].\n— [Muy bien|very good]. ¿[Ventana o pasillo|window or aisle]?\n— [Ventana|window], [por favor|please].\n— [El asiento|the seat] [doce|twelve]. [Son doscientos pesos|that's 200 pesos]. ¿[En efectivo|in cash] o [con tarjeta|by card]?\n— [En efectivo|in cash]. [Aquí tiene|here you go].\n— [Gracias|thank you]. [Sale de|it leaves from] [la puerta tres|gate three], [a la derecha|to the right]. ¡[Buen viaje|have a good trip]!\n[En el autobús|on the bus] [hace mucho frío|it's very cold]. ¡[Necesito|I need] [mi chamarra|my jacket]!",
    quiz:[
      { q:"¿A qué hora sale tu autobús?", opts:["a las once y media","a las diez","a las doce"], a:1, skill:"vocab-numbers", trick:true,
        explain:"There are two buses and you pick <b>a las diez</b> (10:00). <b>Doce</b> is your seat number, not the time." },
      { q:"¿Qué es «ida y vuelta»? (What does it mean?)", opts:["one-way","window seat","round trip"], a:2, skill:"vocab-travel",
        explain:"<b>Ida y vuelta</b> = there and back. In Mexico you'll also hear <b>redondo</b>. One-way is <b>sencillo</b>." },
      { q:"¿Hace frío o calor en el autobús? (Is it cold or hot on the bus?)", opts:["hace mucho frío","hace mucho calor","no hay asientos"], a:0, skill:"comprehension",
        explain:"On the bus, <b>hace mucho frío</b> — ADO blasts the air conditioning, so bring <b>una chamarra</b> (a jacket) even in Cancún. Word check: a <b>city</b> bus is <b>el camión</b>; long-distance lines like ADO are <b>el autobús</b> (though plenty of people say <b>el camión</b> for those too)." },
      { q:"¿Cómo se dice “what time does it leave” en español?", opts:[], a:["a qué hora sale"], type:"fill", skill:"questions",
        explain:"<b>¿A qué hora sale?</b> works for buses, boats, tours and flights." }
    ]},

  { id:"l2-cenote", level:"L2", diff:3, titleEs:"La playa y el cenote", titleEn:"The beach and the cenote",
    text:"[En la mañana|in the morning], [la playa|the beach]: [sol|sun], [mar|sea] y [tacos de pescado|fish tacos]. [En la tarde|in the afternoon], ¡[el cenote|the cenote]!\n— [Buenas tardes|good afternoon]. [Quiero nadar|I want to swim]. ¿[Hay|there is / there are] [lockers|lockers]?\n— [Sí|yes], [ahí|there], [a la izquierda|to the left].\n— ¿Y [hay|there is / there are] [baños|bathrooms]?\n— [Sí|yes], [también|also]. ¿[Tiene|do you have] [bloqueador|sunscreen]?\n— [Sí|yes], [es biodegradable|it's biodegradable].\n— [Perfecto|perfect]. [Aquí|here] [solo|only] [bloqueador biodegradable|biodegradable sunscreen]. [Primero|first], [la regadera|the shower], [por favor|please].\n— ¿[Hay|there is / there are] [chalecos|life vests]?\n— [Claro|of course]. [El chaleco|the life vest] [es obligatorio|is mandatory].\n[Diez minutos después|ten minutes later]…\n— ¿[Qué tal|how's] [el agua|the water]?\n— ¡[Está fría|it's cold]! [Muy|very], [muy|very] [fría|cold]… ¡[pero|but] [está padre|it's cool]! ¡Y [hay|there is / there are] [tortugas|turtles]!",
    quiz:[
      { q:"¿Dónde están los lockers?", opts:["a la izquierda","a la derecha","derecho"], a:0, skill:"vocab-travel" },
      { q:"¿Qué es obligatorio en el cenote? (What's mandatory?)", opts:["el bloqueador","el chaleco","los lockers"], a:1, skill:"comprehension", trick:true,
        explain:"<b>El chaleco es obligatorio</b>: the life jacket is mandatory. Sunscreen is only OK if it's biodegradable." },
      { q:"En el cenote, ¿qué bloqueador? (Which sunscreen is allowed?)", opts:["cualquier bloqueador (any kind)","mucho bloqueador (lots)","solo biodegradable"], a:2, skill:"mexican",
        explain:"Cenotes are fragile freshwater caves and chemicals hurt them. Only <b>bloqueador biodegradable</b>, and shower first at <b>la regadera</b>." },
      { q:"¿Cómo está el agua? (How's the water?)", opts:["warm and boring","cold, but cool","too dirty to swim"], a:1, skill:"comprehension",
        explain:"<b>Está fría</b> = it's cold. <b>Está padre</b> = it's cool (as in awesome)." }
    ]},

  { id:"l2-amigos", level:"L2", diff:4, titleEs:"Diego", titleEn:"Meeting Diego",
    text:"[La terraza|the rooftop] del hostal en Tulum. [Un chavo|a young guy] [con una guitarra|with a guitar].\n— ¡[Hola|hi]! [Soy Diego|I'm Diego]. ¿[Cómo estás|how are you]?\n— [Bien|good / fine], [gracias|thank you]. [Mucho gusto|nice to meet you].\n— [Igualmente|likewise]. ¿[De dónde eres|where are you from]?\n— [Soy de Canadá|I'm from Canada]. ¿[Y tú|and you]?\n— [Soy de Mérida|I'm from Mérida], [pero|but] [vivo|I live] [aquí|here]. ¿[A qué te dedicas|what do you do (for work)]?\n— [Soy turista|I'm a tourist]… y [estudiante de español|Spanish student].\n— ¡[Órale|OK / wow / come on]! ¿Y [cuánto tiempo vas a estar|how long are you staying] en México?\n— [Dos semanas|two weeks]: [una|one (feminine)] en Tulum y [una|one (feminine)] en Oaxaca.\n— ¡[Qué padre|how cool]! [Yo soy guía de cenotes|I'm a cenote guide]. [Te paso mi WhatsApp|I'll give you my WhatsApp], ¿[va|OK (deal)]?\n— ¡[Va|OK (deal)]!",
    quiz:[
      { q:"¿De dónde es Diego?", opts:["de Tulum","de Mérida","de Canadá"], a:1, skill:"comprehension", trick:true,
        explain:"Diego <b>lives</b> in Tulum (<b>vivo aquí</b>), but he's <b>from</b> Mérida: <b>soy de Mérida</b>." },
      { q:"¿Cuánto tiempo vas a estar en México?", opts:["dos semanas","dos días","dos meses"], a:0, skill:"comprehension" },
      { q:"¿Qué es «¿a qué te dedicas?»? (What does it mean?)", opts:["where are you from?","how long are you staying?","what do you do for work?"], a:2, skill:"questions",
        explain:"<b>¿A qué te dedicas?</b> is the friendly way to ask about someone's job. Answer with <b>soy</b> + what you are: <b>soy turista</b>, <b>soy maestra</b>, <b>soy estudiante</b>." },
      { q:"¿Cómo se dice “I'm from…” en español?", opts:[], a:["soy de"], type:"fill", skill:"phrases",
        explain:"<b>Soy de</b> + place: <b>soy de Canadá</b>, <b>soy de Chicago</b>, <b>soy de aquí</b>." }
    ]},

  { id:"l2-restaurante", level:"L2", diff:5, titleEs:"La cuenta, por favor", titleEn:"Dinner and the check",
    text:"Un restaurante en Tulum.\n— [Buenas noches|good evening]. [Una mesa para dos|a table for two], [por favor|please].\n— [Pásenle|come on in (you all)]. [Por aquí|this way].\n— ¿[Me da|can I have] [el menú|the menu], [por favor|please]?\n— [Claro|of course], [aquí está|here is] [la carta|the menu (the card)].\n— [Gracias|thank you]. ¿[Qué me recomienda|what do you recommend]?\n— [La cochinita pibil|slow-roasted pork (Yucatán)]. ¡[Está deliciosa|it's delicious]!\n— [Perfecto|perfect]. [Dos órdenes de cochinita|two orders of cochinita] y [dos horchatas|two horchatas (rice drinks)], [por favor|please].\n[Una hora después|an hour later]…\n— [La cuenta|the check], [por favor|please]. ¿[Aceptan tarjeta|do you take card]?\n— [Sí|yes], [claro|of course]. [Ahorita|right now (or: in a bit)] [se la traigo|I'll bring it to you].\n— ¿[La propina|the tip] [está incluida|is included]?\n— No, [no está incluida|it's not included].\n[La cuenta|the check]: [cuatrocientos pesos|four hundred pesos]. [La propina|the tip] [en México|in Mexico]: [diez o quince por ciento|10 or 15 percent]. [Dejo|I leave] [sesenta pesos|sixty pesos]. ¡[Todos contentos|everyone's happy]!",
    quiz:[
      { q:"¿Qué te recomienda el mesero?", opts:["los tacos al pastor","la cochinita pibil","la sopa de tortilla"], a:1, skill:"vocab-food",
        explain:"<b>La cochinita pibil</b>: slow-roasted pork from the Yucatán. Order it." },
      { q:"¿Cuánto es la cuenta?", opts:["cuatrocientos sesenta pesos","sesenta pesos","cuatrocientos pesos"], a:2, skill:"vocab-numbers", trick:true,
        explain:"The check is <b>cuatrocientos</b> (400). The 60 is <b>la propina</b>, which you add on top." },
      { q:"¿Cuánto es la propina normal en México? (What's a normal tip?)", opts:["diez o quince por ciento","cero, no hay propina","treinta por ciento"], a:0, skill:"mexican",
        explain:"<b>La propina</b> is usually <b>10–15%</b> and usually <b>not</b> included, so it's fair to ask: <b>¿la propina está incluida?</b>" },
      { q:"¿Cómo se dice “do you take card” en español?", opts:[], a:["aceptan tarjeta","aceptan tarjetas"], type:"fill", skill:"phrases",
        explain:"<b>¿Aceptan tarjeta?</b> Ask before you order: small places are often cash only (<b>solo efectivo</b>)." }
    ]},

  { id:"l2-planes", level:"L2", diff:6, titleEs:"¿Te late?", titleEn:"Making plans with Diego",
    text:"[Un mensaje|a message] de Diego:\n— ¡[Qué onda|what's up]! [El viernes|on Friday] [hay|there is / there are] [un concierto|a concert] en [la playa|the beach]. ¿[Te late|sound good]?\n— [El viernes|on Friday] [no puedo|I can't]. ¿Y [el sábado|on Saturday]?\n— ¡[El sábado|on Saturday] [también|also]! [A las ocho|at eight] [de la noche|at night].\n— ¡[Perfecto|perfect]! ¿[Dónde|where]?\n— ¿[Nos vemos en|shall we meet at] [el OXXO|the OXXO] de [la esquina|the corner]?\n— ¿En [el OXXO|the OXXO]? ¡Jaja! [Va|OK (deal)].\n— Y [antes|before that], [a las siete|at seven], ¿[unos tacos de pescado|some fish tacos]? ¿[Te late|sound good]?\n— ¡[Me late|I'm in]!\n— [Mañana|tomorrow] [en la mañana|in the morning] [te mando|I'll send you] [la ubicación|the location].\n— ¡[Órale|OK / wow / come on]! ¡[Nos vemos el sábado|see you Saturday]!",
    quiz:[
      { q:"¿Cuándo es el plan?", opts:["el viernes","mañana","el sábado"], a:2, skill:"comprehension", trick:true,
        explain:"Diego says <b>el viernes</b> first, but you <b>no puedo</b> (can't). The plan is <b>el sábado</b>." },
      { q:"¿A qué hora son los tacos?", opts:["a las siete","a las ocho","a las nueve"], a:0, skill:"vocab-numbers",
        explain:"Tacos <b>a las siete</b> (7:00), then the concert <b>a las ocho</b> (8:00)." },
      { q:"¿Dónde se ven? (Where do you meet?)", opts:["en la playa","en el OXXO","en el hostal"], a:1, skill:"comprehension",
        explain:"<b>¿Nos vemos en el OXXO?</b> There's one on almost every corner, so it's the easiest landmark in Mexico." },
      { q:"¿Qué es «¿te late?»? (What does it mean?)", opts:["are you late?","do you like tacos?","are you up for it?"], a:2, skill:"mexican",
        explain:"<b>¿Te late?</b> = are you up for it? / sound good? The answer: <b>¡me late!</b> = I'm in! Nothing to do with being late." }
    ]}

];

const LESSONS_L2 = [

  { id:"l2L-hay", level:"L2", diff:1, title:"Hay / ¿Hay…?", titleEn:"There is… / Is there…?",
    body:"<b>Hay</b> means <b>there is / there are</b>. Put it in a question and it means <b>is there…? / are there…?</b> Same word, no changes. Just add a thing. (The h is silent: say it like “eye”.)<br><br>• <b>¿Hay baño?</b> — Is there a bathroom?<br>• <b>¿Hay wifi?</b> — Is there wifi? (say “wee-fee”)<br>• <b>¿Hay tacos de pastor?</b> — Are there pastor tacos?<br>• <b>Sí, hay.</b> — Yes, there are.<br>• <b>No hay.</b> — There isn't any. / We're out.<br>• <b>Hay un OXXO en la esquina.</b> — There's an OXXO on the corner.<br><br>💡 Pro tip: <b>No hay</b> is the answer you'll hear the most: sold out, none left, not today. Don't argue. Just ask <b>¿Hay otro?</b> (is there another one?) and smile.",
    practice:[
      { q:"What does «¿Hay wifi?» mean?", opts:["Where is the wifi?","Is there wifi?","I want wifi."], a:1, skill:"phrases" },
      { q:"How do you say “There isn't any.”?", opts:["No hay.","No sé.","No entiendo."], a:0, skill:"phrases",
        explain:"<b>No hay</b> = there isn't any / we're out. <b>No sé</b> = I don't know." },
      { q:"You ask «¿Hay tacos de pastor?» and they have them. What do they say?", opts:["No hay.","¿Hay otro?","Sí, hay."], a:2, skill:"phrases",
        explain:"<b>Sí, hay</b> = yes, there are. The question and the answer use the same word." },
      { q:"Translate: «Hay un OXXO en la esquina.»", opts:["Is there an OXXO on the corner?","There's an OXXO on the corner.","The OXXO is closed."], a:1, skill:"translation",
        explain:"No question marks, so it's a statement: <b>hay</b> = there is." },
      { q:"Translate into Spanish: “Is there a bathroom?”", opts:[], a:["hay baño","hay un baño","hay baños"], type:"fill", skill:"translation",
        explain:"<b>¿Hay baño?</b> The most useful three syllables in Mexico." }
    ]},

  { id:"l2L-gusta", level:"L2", diff:2, title:"Me gusta / No me gusta", titleEn:"Likes and dislikes",
    body:"Forget verbs. To say you like something, grab the chunk <b>me gusta</b> (I like) and add one thing. Liking more than one thing? Use its twin, <b>me gustan</b>.<br><br>• <b>Me gusta el mango.</b> — I like mango.<br>• <b>Me gustan los tacos.</b> — I like tacos.<br>• <b>No me gusta lo picante.</b> — I don't like spicy food.<br>• <b>¿Te gusta el mezcal?</b> — Do you like mezcal? (asking a friend)<br>• <b>¡Me encanta!</b> — I love it!<br>• <b>Me encanta Oaxaca.</b> — I love Oaxaca.<br><br>💡 Pro tip: Not into heat? Say <b>no me gusta lo picante</b> before you order. And when someone promises «no pica» (it's not spicy)… taste it first. In Mexico, spicy is a matter of opinion.",
    practice:[
      { q:"What does «¡Me encanta!» mean?", opts:["I don't like it.","I love it!","Do you like it?"], a:1, skill:"phrases" },
      { q:"You like tacos (lots of them). Which one sounds right?", opts:["Me gustan los tacos.","Me gusta los tacos.","No me gustan los tacos."], a:0, skill:"phrases",
        explain:"More than one thing → <b>me gustan</b>. One thing → <b>me gusta</b>." },
      { q:"How do you ask a friend “Do you like mezcal?”", opts:["¿Hay mezcal?","¿Me gusta el mezcal?","¿Te gusta el mezcal?"], a:2, skill:"phrases",
        explain:"<b>¿Te gusta…?</b> asks your friend. <b>Me gusta</b> is about you." },
      { q:"Translate: «No me gusta lo picante.»", opts:["I love spicy food.","I don't like spicy food.","Is it spicy?"], a:1, skill:"translation" },
      { q:"Translate into Spanish: “I like mango.”", opts:[], a:["me gusta el mango","me gustan los mangos"], type:"fill", skill:"translation",
        explain:"<b>Me gusta el mango.</b> Mango season in Mexico is spring and summer. You're welcome." }
    ]},

  { id:"l2L-horas", level:"L2", diff:3, title:"Días y horas", titleEn:"Days & times",
    body:"<b>Days</b> are lowercase in Spanish, and «on Monday» is just <b>el lunes</b>.<br>• lunes (Mon) · martes (Tue) · miércoles (Wed) · jueves (Thu) · viernes (Fri) · sábado (Sat) · domingo (Sun)<br><br><b>¿A qué hora…?</b> = at what time…? Answer with <b>a las</b> + number:<br>• <b>a la una</b> — at one (one o'clock is special)<br>• <b>a las dos</b> — at two<br>• <b>a las ocho y media</b> — at eight thirty<br><br>Watch these four:<br>• <b>hoy</b> — today<br>• <b>mañana</b> — tomorrow<br>• <b>la mañana</b> — the morning<br>• <b>mañana en la mañana</b> — tomorrow morning<br><br>💡 Pro tip: For a party, «a las ocho» can mean nine-ish. For the ADO bus, it means eight sharp.",
    practice:[
      { q:"What does «mañana» mean on its own?", opts:["tomorrow","the morning","today"], a:0, skill:"vocab-numbers",
        explain:"<b>mañana</b> = tomorrow. <b>la mañana</b> = the morning. So <b>mañana en la mañana</b> = tomorrow morning." },
      { q:"How do you say “at one o'clock”?", opts:["a las uno","a la una","a las una"], a:1, skill:"vocab-numbers",
        explain:"One o'clock is special: <b>a la una</b>. Every other hour: <b>a las dos, a las tres…</b>" },
      { q:"¿Qué día sigue después del viernes? (Which day comes after Friday?)", opts:["el jueves","el domingo","el sábado"], a:2, skill:"vocab-numbers" },
      { q:"Translate: «El domingo a las ocho y media.»", opts:["On Monday at 8:30.","On Sunday at 8:30.","On Sunday at 8:15."], a:1, skill:"translation",
        explain:"<b>domingo</b> = Sunday, <b>y media</b> = half past (:30)." },
      { q:"Translate into Spanish: “tomorrow morning”", opts:[], a:["mañana en la mañana","mañana por la mañana"], type:"fill", skill:"translation",
        explain:"<b>Mañana en la mañana</b> is how Mexicans say it. Yes, the word shows up twice." }
    ]},

  { id:"l2L-necesito", level:"L2", diff:4, title:"Necesito… / ¿Puedo…?", titleEn:"Needs & permission",
    body:"Two chunks that solve almost any problem.<br><br><b>Necesito</b> + a thing = I need…<br>• <b>Necesito un taxi.</b> — I need a taxi.<br>• <b>Necesito ayuda.</b> — I need help.<br>• <b>Necesito un cargador para mi celular.</b> — I need a charger for my phone.<br><br><b>¿Puedo</b> + an action? = Can I…?<br>• <b>¿Puedo pagar con tarjeta?</b> — Can I pay by card?<br>• <b>¿Puedo sentarme aquí?</b> — Can I sit here?<br><br><b>¿Se puede…?</b> = Is it OK to…? (asking about the rules)<br>• <b>¿Se puede nadar aquí?</b> — Can you swim here?<br>• <b>¿Se pueden tomar fotos?</b> — Are photos allowed?<br><br>💡 Pro tip: The happiest answers you'll hear are <b>¡claro!</b> (of course!) and <b>sí, se puede</b>. The saddest: <b>solo efectivo</b>, cash only.",
    practice:[
      { q:"What does «¿Puedo sentarme aquí?» mean?", opts:["Where can I sit?","I need a seat here.","Can I sit here?"], a:2, skill:"phrases" },
      { q:"How do you say “I need help.”?", opts:["Necesito ayuda.","Puedo ayuda.","Hay ayuda."], a:0, skill:"phrases" },
      { q:"At the cenote, you want to know if swimming is allowed. What do you ask?", opts:["¿Necesito nadar?","¿Se puede nadar aquí?","¿Hay nadar?"], a:1, skill:"phrases",
        explain:"<b>¿Se puede…?</b> asks about the rules: is it OK (for anyone) to…?" },
      { q:"Translate: «Necesito un cargador para mi celular.»", opts:["Can I charge my phone?","Is there a charger here?","I need a charger for my phone."], a:2, skill:"translation",
        explain:"<b>Necesito</b> = I need. <b>Celular</b> is what Mexicans call a phone." },
      { q:"Translate into Spanish: “Can I pay by card?”", opts:[], a:["puedo pagar con tarjeta"], type:"fill", skill:"translation",
        explain:"<b>¿Puedo pagar con tarjeta?</b> If the answer is <b>solo efectivo</b>, it's cash only." }
    ]}

];

/* ============================================================================
   L3
   ========================================================================== */
/* LEVEL L3 — Platicar · Chatting */
const STORIES_L3 = [

  { id:"l3-que-onda", level:"L3", diff:1, titleEs:"¿Qué onda?", titleEn:"What's up?",
    text:"Es viernes [en la noche|at night] en CDMX, en [la terraza|the terrace] de un bar. Diego está con [sus amigos|his friends].\n— ¡[Qué onda|what's up]! [Te presento a|let me introduce you to] Mariana y a Toño.\n— ¡[Hola|hi]! [Mucho gusto|nice to meet you].\n— [Igualmente|likewise]. ¿Quieres [una chela|a beer (casual)]? — pregunta Toño.\n— ¡[Sí|yes]! [Gracias|thank you].\n— ¿[De dónde eres|where are you from]? — pregunta Mariana.\n— [Soy de|I'm from] Canadá. [Aprendo español|I'm learning Spanish] con [una app|an app].\n— ¡[No manches|no way]! ¿[Neta|really]? ¡[Hablas muy bien|you speak very well]!\n— [Gracias|thank you]. [Poquito|just a little].\n— ¡[Qué padre|how cool]!\n— [Oye|hey], [güey|dude (friends only)], ¿[vamos por unos tacos|shall we go get tacos]? — le dice Toño a Diego.\n— ¡[Órale|OK / wow / come on]! ¿[Ahorita|right now (or: in a bit)]?\n— Sí, [ahorita|right now (or: in a bit)]. Hay un [lugar|place] muy [chido|cool] [a dos cuadras|two blocks away].\nDiego te dice [en voz baja|quietly]: — «Güey» es «dude». [Solo con amigos|only with friends], ¿eh?",
    quiz:[
      { q:"¿Qué es «una chela»?", opts:["a taco","a beer","a friend"], a:1, skill:"mexican", explain:"<b>una chela</b> = a beer — casual Mexican slang." },
      { q:"¿Qué van a comer los amigos?", opts:["pizza","mole","tacos"], a:2, skill:"comprehension", explain:"Toño says <b>¿vamos por unos tacos?</b> — shall we go get tacos?" },
      { q:"¿Con quién puedes decir «güey»?", opts:["con tus amigos","con el taxista","con la abuela de Diego"], a:0, skill:"mexican", trick:true, explain:"<b>güey</b> = dude. Diego says: <b>solo con amigos</b> — only with friends." },
      { q:"Escribe en español: “how cool!”", opts:[], a:["qué padre","qué chido"], type:"fill", skill:"mexican", explain:"<b>¡Qué padre!</b> = how cool! (<b>¡Qué chido!</b> works too.)" }
    ]},

  { id:"l3-manana", level:"L3", diff:2, titleEs:"Mañana voy a…", titleEn:"Tomorrow I'm going to…",
    text:"Estás en Oaxaca. Diego [te llama|calls you].\n— ¿[Bueno|hello? (answering the phone)]?\n— ¡[Qué onda|what's up]! Oye, ¿[qué vas a hacer|what are you going to do] [mañana|tomorrow]?\n— [En la mañana|in the morning] [voy a visitar|I'm going to visit] Monte Albán. ¡[Muy temprano|very early], a las siete!\n— ¡[Qué padre|how cool]! ¿Y [después|after that]?\n— Después [voy a comer|I'm going to eat] [una tlayuda|a tlayuda (giant crispy tortilla)] en [el mercado|the market]. Y [voy a comprar|I'm going to buy] [un regalo|a gift] para [mi mamá|my mom].\n— ¿[Vas a ir|are you going to go] a Hierve el Agua?\n— Mañana no. [El viernes|on Friday]. [Voy a ir|I'm going to go] en [un tour|a tour].\n— ¿Y [en la noche|at night]?\n— [No sé|I don't know]. ¿[Por qué|why]?\n— ¡[Vamos a tomar|let's have (a drink)] [un mezcal|a mezcal] en [el centro|downtown]! ¿[Te late|sound good]?\n— ¡[Órale|OK / wow / come on]! ¿[A qué hora|at what time]?\n— A las ocho. [Paso por ti|I'll pick you up] al hotel.\n— ¡[Va|deal / OK]! [Nos vemos|see you].",
    quiz:[
      { q:"¿Qué vas a visitar mañana en la mañana?", opts:["Hierve el Agua","el centro","Monte Albán"], a:2, skill:"comprehension" },
      { q:"¿Qué vas a comprar para tu mamá?", opts:["un regalo","una tlayuda","un mezcal"], a:0, skill:"voy-a", explain:"<b>voy a comprar un regalo</b> = I'm going to buy a gift." },
      { q:"¿Cuándo vas a ir a Hierve el Agua?", opts:["mañana","el viernes","en la noche"], a:1, skill:"comprehension", trick:true, explain:"Diego asks about tomorrow, but you say <b>mañana no. El viernes</b> — not tomorrow, on Friday." },
      { q:"Escribe en español: “I'm going to eat”", opts:[], a:["voy a comer"], type:"fill", skill:"voy-a", explain:"<b>voy a</b> (I'm going to) + <b>comer</b> (to eat)." }
    ]},

  { id:"l3-ayer", level:"L3", diff:3, titleEs:"Ayer fui a…", titleEn:"Yesterday I went to…",
    text:"Es lunes. Estás en [un café|a café] con Diego.\n— ¿Qué tal [el fin de semana|the weekend]? ¿[Qué hiciste|what did you do]?\n— [Ayer|yesterday] [fui a|I went to] Xochimilco con [unos amigos|some friends].\n— ¡[Órale|OK / wow / come on]! ¿Y [qué tal estuvo|how was it]?\n— ¡[Estuvo padre|it was cool]! [Vi|I saw] [las trajineras|the trajineras (colorful boats)], [los mariachis|the mariachis]… ¡y [un ajolote|an axolotl]! [Se llama|its name is] Lolo.\n— ¿[Neta|really]? ¡[Qué chido|how cool]! ¿Y [comiste algo|did you eat anything]?\n— Sí, [comí|I ate] [un elote|corn on the cob] [con limón y chile|with lime and chili]. ¡[Estuvo delicioso|it was delicious]!\n— ¿Y [compraste algo|did you buy anything]?\n— Sí, [compré|I bought] [unas flores|some flowers] para [el cuarto|the room].\n— ¿Y [te gustó|did you like it]?\n— ¡[Me gustó mucho|I liked it a lot]! ¿Y tú? ¿[Qué hiciste|what did you do]?\n— Yo, [nada|nothing]. [Trabajé|I worked] [todo el día|all day].\n— ¡Ay, Diego! [La próxima vez|next time], [vamos juntos|we'll go together].\n— ¡[Va|deal / OK]! Y [te invito|my treat] [un elote|corn on the cob].",
    quiz:[
      { q:"¿Adónde fuiste ayer?", opts:["a Oaxaca","a Xochimilco","a la playa"], a:1, skill:"past-chunks", explain:"<b>Ayer fui a Xochimilco</b> = yesterday I went to Xochimilco." },
      { q:"¿Qué compraste?", opts:["un ajolote","un elote","unas flores"], a:2, skill:"past-chunks", trick:true, explain:"You <b>saw</b> (vi) an axolotl and <b>ate</b> (comí) an elote — you <b>bought</b> (compré) flowers." },
      { q:"¿Qué significa «estuvo padre»?", opts:["it was cool","my dad was there","it was far"], a:0, skill:"mexican", trick:true, explain:"<b>padre</b> = father, but <b>¡qué padre!</b> / <b>estuvo padre</b> = cool / it was cool." },
      { q:"Escribe en español: “I liked it a lot”", opts:[], a:["me gustó mucho"], type:"fill", skill:"past-chunks", explain:"<b>me gustó</b> = I liked it · <b>mucho</b> = a lot." }
    ]},

  { id:"l3-muertos", level:"L3", diff:4, titleEs:"Día de Muertos", titleEn:"Day of the Dead",
    text:"Es [el dos de noviembre|November 2nd] en Oaxaca. Diego te invita a [su casa|his house].\n— [Pasa|come in], pasa. [Mira|look], [esta es|this is] [la ofrenda|the altar (offering)] de mi familia.\nHay [velas|candles], [fotos|photos], [comida|food] y muchas [flores naranjas|orange flowers].\n— ¡[Qué bonita|how pretty]! ¿Quién es [el señor|the man] de la foto?\n— Es [mi abuelo|my grandpa], Don Chema. [Le gustaba mucho|he really liked] [el mole|the mole]. [Por eso|that's why] hay mole en la ofrenda.\n— ¿Y las flores naranjas?\n— Es [el cempasúchil|the marigold]. [Dicen que|they say] su color y su olor [guían a las almas|guide the souls] [a casa|home].\n— [Toma|here you go], [el pan de muerto|Day of the Dead bread]. Es [dulce|sweet].\n— Mmm, ¡[está delicioso|it's delicious]!\n— Y mira [las calaveras|the skulls] [de azúcar|made of sugar]. ¡Esta es [para ti|for you]! [Tiene tu nombre|it has your name].\n— ¡[Qué padre|how cool]! [Muchas gracias|thank you very much].\n— [Para nosotros|for us], este día [no es triste|isn't sad]. Es [una fiesta|a party] para [recordar a la familia|remember the family].",
    quiz:[
      { q:"¿Quién es el señor de la foto?", opts:["el papá de Diego","el abuelo de Diego","un amigo de Diego"], a:1, skill:"comprehension", explain:"<b>Es mi abuelo, Don Chema</b> = it's my grandpa." },
      { q:"¿Cómo se llama la flor naranja?", opts:["la ofrenda","el mole","el cempasúchil"], a:2, skill:"mexican", explain:"<b>el cempasúchil</b> = the marigold, the orange flower of Día de Muertos." },
      { q:"¿Qué tiene la calavera de azúcar?", opts:["tu nombre","una vela","una foto"], a:0, skill:"comprehension", explain:"<b>Tiene tu nombre</b> = it has your name." },
      { q:"¿El Día de Muertos es triste?", opts:["sí, es un día muy triste","no, es una fiesta para recordar a la familia","no, es una fiesta para turistas"], a:1, skill:"mexican", trick:true, explain:"Diego says <b>no es triste</b> — it's a party to remember the family." }
    ]},

  { id:"l3-emergencia", level:"L3", diff:5, titleEs:"Una emergencia pequeña", titleEn:"A small emergency",
    text:"Estás en el hotel en Playa del Carmen. [Buscas|you look for] tu celular… ¡[no está|it's not there]!\n— [Disculpe|excuse me], Sofía, ¿[me puede ayudar|can you help me]? [Perdí mi celular|I lost my phone]. [Tengo|I have] [mi cartera|my wallet], pero el celular no.\n— [No se preocupe|don't worry]. ¿[Vino en taxi|did you come by taxi]?\n— Sí. ¡Ay, [creo que|I think] está en el taxi! ¿[Dónde está|where is] [la policía|the police]?\n— [Primero|first], [vamos a llamar|let's call] a su celular. ¿[Cuál es su número|what's your number]?\nSofía [llama|calls]. [Suena|it rings]… y [alguien|someone] [contesta|answers]:\n— ¿[Bueno|hello? (answering the phone)]?\n— Hola, [habla Sofía|this is Sofía], del hotel. ¿[Quién habla|who's speaking]?\n— Soy Beto, [el taxista|the taxi driver]. ¡[Lo encontré|I found it]! Está en [el asiento|the seat]. [Ahorita|right now (or: in a bit)] [se lo llevo|I'll bring it to you] al hotel.\n[Cuarenta minutos después|forty minutes later] (¡[ahorita|right now (or: in a bit)]!), [llega|arrives] Don Beto con tu celular.\n— ¡[Mil gracias|thanks a million], Don Beto!\n— [De nada|you're welcome]. ¡[Que le vaya bien|all the best]!",
    quiz:[
      { q:"¿Qué perdiste?", opts:["tu cartera","tu celular","tu boleto"], a:1, skill:"past-chunks", trick:true, explain:"You still have <b>mi cartera</b> (my wallet) — you lost <b>mi celular</b> (my phone)." },
      { q:"¿Quién contesta el teléfono?", opts:["Don Beto, el taxista","la policía","Diego"], a:0, skill:"comprehension", explain:"<b>Soy Beto, el taxista</b> — the taxi driver found it." },
      { q:"Don Beto dice «ahorita». ¿Cuándo llega?", opts:["en dos minutos","mañana","en cuarenta minutos"], a:2, skill:"mexican", trick:true, explain:"<b>ahorita</b> = right now… or in a bit. In Mexico, that can mean 40 minutes!" },
      { q:"Escribe en español: “I lost my phone”", opts:[], a:["perdí mi celular"], type:"fill", skill:"past-chunks", explain:"<b>perdí</b> = I lost · <b>mi celular</b> = my phone." }
    ]}
];

const LESSONS_L3 = [

  { id:"l3L-voya", level:"L3", diff:1, title:"Voy a…", titleEn:"The future cheat code",
    body:"The best trick in Spanish: <b>voy a</b> + any verb in its dictionary form (the one ending in -ar, -er or -ir) = <b>I'm going to…</b> No endings to learn. Ever.<br>• <b>Voy a comer</b> tacos. = I'm going to eat tacos.<br>• <b>Voy a visitar</b> Oaxaca. = I'm going to visit Oaxaca.<br>• <b>Voy a comprar</b> un regalo. = I'm going to buy a gift.<br>• <b>Vamos a…</b> = we're going to… / let's…: <b>¡Vamos a bailar!</b> = Let's dance!<br>• <b>¿Vas a…?</b> = are you going to…? <b>¿Vas a ir a la playa?</b> = Are you going to go to the beach?<br>• <b>¿Qué vas a hacer?</b> = What are you going to do?<br>💡 Pro tip: when a Mexican friend proposes a plan, answer <b>¡Órale!</b> or <b>¡Va!</b> — OK, deal!",
    practice:[
      { q:"¿Qué significa «Voy a comprar un regalo»?", opts:["I bought a gift","I'm going to buy a gift","I want a gift"], a:1, skill:"voy-a", explain:"<b>voy a</b> + <b>comprar</b> = I'm going to buy." },
      { q:"How do you say “Let's dance!”?", opts:["¡Voy a bailar!","¿Vas a bailar?","¡Vamos a bailar!"], a:2, skill:"voy-a", explain:"<b>vamos a…</b> = we're going to… / let's…" },
      { q:"Translate: «¿Qué vas a hacer?»", opts:["What are you going to do?","What did you do?","What do you want?"], a:0, skill:"translation" },
      { q:"Translate: “I'm going to visit Oaxaca.”", opts:["Fui a Oaxaca.","Voy a visitar Oaxaca.","¿Vas a visitar Oaxaca?"], a:1, skill:"translation" },
      { q:"Type the Spanish for “I'm going to eat”:", opts:[], a:["voy a comer"], type:"fill", skill:"voy-a", explain:"<b>voy a</b> + <b>comer</b> (to eat) = I'm going to eat." }
    ]},

  { id:"l3L-pasado", level:"L3", diff:2, title:"El pasado en bloques", titleEn:"The past in chunks",
    body:"Don't build the past tense. Just memorize these 8 blocks whole, like phrases:<br>• <b>fui</b> = I went (<b>fui a</b> = I went to)<br>• <b>comí</b> = I ate<br>• <b>compré</b> = I bought<br>• <b>vi</b> = I saw<br>• <b>hice</b> = I did / I made<br>• <b>estuvo</b> = it was (for experiences)<br>• <b>me gustó</b> = I liked it<br>• <b>perdí</b> = I lost<br>Examples: <b>Ayer fui a Tulum.</b> = Yesterday I went to Tulum. · <b>Comí tacos.</b> · <b>Vi un cenote.</b> · <b>Perdí mi celular.</b> = I lost my phone.<br>💡 Pro tip: when someone asks <b>¿Qué tal estuvo?</b> (How was it?), answer <b>¡Estuvo padre!</b> (it was cool), <b>¡Estuvo delicioso!</b> (it was delicious), <b>Estuvo bien</b> (it was OK) or <b>¡Me gustó mucho!</b> (I liked it a lot).",
    practice:[
      { q:"¿Qué significa «vi»?", opts:["I went","I lost","I saw"], a:2, skill:"past-chunks", explain:"<b>vi</b> = I saw · <b>Vi un cenote</b> = I saw a cenote." },
      { q:"Diego asks «¿Qué tal estuvo?» about your dinner. You loved it. You say…", opts:["¡Estuvo delicioso!","¡Voy a comer!","Perdí mi celular."], a:0, skill:"past-chunks", explain:"<b>¡Estuvo delicioso!</b> = it was delicious." },
      { q:"Translate: «Ayer fui a Tulum.»", opts:["Tomorrow I'm going to Tulum.","I like Tulum.","Yesterday I went to Tulum."], a:2, skill:"translation" },
      { q:"Translate: “I lost my phone.”", opts:["Compré mi celular.","Perdí mi celular.","Vi mi celular."], a:1, skill:"translation" },
      { q:"Type the Spanish for “I ate”:", opts:[], a:["comí"], type:"fill", skill:"past-chunks", explain:"<b>comí</b> = I ate · <b>Comí tacos</b> = I ate tacos." }
    ]},

  { id:"l3L-mexicano", level:"L3", diff:3, title:"Español mexicano", titleEn:"Talk like a local",
    body:"Mexican Spanish has its own flavor. Drop these and people smile:<br>• <b>¿Mande?</b> = pardon? (the polite Mexican «what?»)<br>• <b>ahorita</b> = right now… or in a bit… or maybe later. The famous flexible word!<br>• <b>¡Qué padre!</b> / <b>¡Qué chido!</b> = how cool!<br>• <b>¡Órale!</b> = OK! / wow! / come on!<br>• <b>¿Neta?</b> = really? (<b>la neta</b> = the truth)<br>• <b>¡No manches!</b> = no way! (mild and friendly)<br>• <b>¿Te late?</b> = sound good? / are you in?<br>• <b>güey</b> = dude. <b>Friends only</b>, never with staff or older people.<br>💡 Pro tip: if a waiter says <b>ahorita</b>, it's coming soon. If a friend says <b>ahorita vengo</b> (be right back), order another taco.",
    practice:[
      { q:"¿Qué significa «¿neta?»?", opts:["really?","nice","the net"], a:0, skill:"mexican", explain:"<b>¿Neta?</b> = really? · <b>la neta</b> = the truth." },
      { q:"How do you say “how cool!” in Mexico?", opts:["¡No manches!","¡Qué padre!","¿Mande?"], a:1, skill:"mexican", explain:"<b>¡Qué padre!</b> or <b>¡Qué chido!</b> = how cool!" },
      { q:"Translate: «¿Tacos? ¿Te late?»", opts:["Tacos? Are you late?","Tacos? Really?","Tacos? Sound good?"], a:2, skill:"translation", explain:"<b>¿Te late?</b> = sound good? / are you in? — nothing to do with being late!" },
      { q:"Translate: “No way!” (friendly)", opts:["¡No manches!","¡Órale!","Ahorita."], a:0, skill:"translation" },
      { q:"Who can you call «güey»?", opts:["the hotel receptionist","your friend Diego","Diego's grandmother"], a:1, skill:"mexican", trick:true, explain:"<b>güey</b> = dude — <b>friends only</b>, never with staff or older people." }
    ]},

  { id:"l3L-soy-estoy", level:"L3", diff:4, title:"Soy… / Estoy…", titleEn:"I am… (two ways)",
    body:"Spanish has two ways to say «I am». Learn them as chunks.<br><b>Soy…</b> = who you are:<br>• <b>Soy Ana.</b> = I'm Ana.<br>• <b>Soy de Canadá.</b> = I'm from Canada.<br>• <b>Soy maestro / maestra.</b> = I'm a teacher.<br><b>Estoy…</b> = how or where you are right now:<br>• <b>Estoy bien.</b> = I'm good.<br>• <b>Estoy cansado / cansada.</b> = I'm tired (man / woman).<br>• <b>Estoy en el hotel.</b> = I'm at the hotel.<br>• <b>Estoy en Oaxaca.</b> = I'm in Oaxaca.<br>Quick test: could it change by tomorrow? Use <b>estoy</b>.<br>💡 Pro tip: no «un» with jobs — say <b>soy maestra</b>, not «soy una maestra». And if you mix up soy and estoy, people still understand. Smile and keep talking.",
    practice:[
      { q:"¿Qué significa «Estoy cansada»?", opts:["I'm from Cansada","I'm tired","I'm a teacher"], a:1, skill:"ser-estar", explain:"<b>Estoy cansada</b> = I'm tired (a woman says it). How you are right now → <b>estoy</b>." },
      { q:"Translate: “I'm from Canada.”", opts:["Soy de Canadá.","Estoy de Canadá.","Estoy en Canadá."], a:0, skill:"translation", explain:"Where you're from = who you are → <b>soy de…</b>" },
      { q:"You're at the hotel right now. You say…", opts:["Soy el hotel.","Soy en el hotel.","Estoy en el hotel."], a:2, skill:"ser-estar", explain:"Where you are right now → <b>estoy en…</b>" },
      { q:"Translate: «Soy maestra y estoy en Oaxaca.»", opts:["I'm tired and I'm in Oaxaca.","I'm a teacher and I'm in Oaxaca.","I'm from Oaxaca and I'm a teacher."], a:1, skill:"translation" },
      { q:"Type the Spanish for “I'm tired” (a man says it):", opts:[], a:["estoy cansado"], type:"fill", skill:"ser-estar", explain:"<b>Estoy cansado</b> (man) · <b>Estoy cansada</b> (woman)." }
    ]}
];

/* ============================================================================
   ASSEMBLY — the engine reads these three.
   ========================================================================== */
const STORIES = [...STORIES_L0, ...STORIES_L1, ...STORIES_L2, ...STORIES_L3];
const LESSONS = [...LESSONS_L0, ...LESSONS_L1, ...LESSONS_L2, ...LESSONS_L3];

/* Expose for the app (works as plain <script> include). */
window.SKILLS = SKILLS;
window.STORIES = STORIES;
window.LESSONS = LESSONS;
