// Tests for greek.js:   node tools/test_greek.js
// 1. translit() on words a learner meets, against hand-checked pronunciations.
// 2. answerKey(): common Latin spellings must match the Greek answer; different words must not.
require("../greek.js");
const { translit, answerKey, answerMatch } = globalThis;
let fails = 0;
const eq = (got, want, what) => { if (got !== want) { fails++; console.log(`✗ ${what}: got «${got}» want «${want}»`); } };

const TR = {
  "καλημέρα":"kaliméra", "ευχαριστώ":"efharistó", "παρακαλώ":"parakaló", "γεια σου":"yia sou",
  "Γεια σας":"Yia sas", "συγγνώμη":"signómi", "ναι":"ne", "όχι":"óhi", "νερό":"neró",
  "Ελλάδα":"Eládha", "θάλασσα":"thálasa", "μπύρα":"bíra", "ομπρέλα":"ombréla", "πέντε":"pénde",
  "Άντε":"Ánde", "γκαρσόνι":"garsóni", "Αγγλικά":"Angliká", "τζατζίκι":"dzadzíki", "τσάι":"tsái",
  "παιδί":"pedhí", "είμαι":"íme", "αύριο":"ávrio", "αυτό":"aftó", "Ευρώ":"Evró", "ευρώ":"evró",
  "εύκολο":"éfkolo", "Πειραιάς":"Pireás", "ξενοδοχείο":"xenodhohío", "βοήθεια":"voíthia",
  "πλοίο":"plío", "δύο":"dhío", "τέσσερα":"tésera", "εννιά":"eniá", "κόκκινο":"kókino",
  "Γιώργος":"Yiórgos", "γυναίκα":"yinéka", "ψωμί":"psomí", "Ακρόπολη":"Akrópoli",
  "λογαριασμό":"logariasmó", "σουβλάκι":"souvláki", "χωριάτικη":"horiátiki", "Καλώς ήρθατε":"Kalós írthate",
  "ΑΝΔΡΩΝ":"ANDHRON", "ΓΥΝΑΙΚΩΝ":"YINEKON", "ΤΑΞΙ":"TAXI", "Τι κάνεις;":"Ti kánis?",
  "Πού είναι η τουαλέτα;":"Poú íne i toualéta?", "δεν καταλαβαίνω":"dhen katalavéno",
  "φεγγάρι":"fengári", "μία":"mía", "Ο Νίκος":"O Níkos", "πρωινό":"proinó", "γάλα":"gála",
  "σιγά σιγά":"sigá sigá", "Γεια μας!":"Yia mas!", "Θα ήθελα":"Tha íthela", "κρασί":"krasí",
  "ευχαριστούμε":"efharistoúme", "Ζάχαρη":"Záhari", "φραπέ":"frapé", "λεωφορείο":"leoforío",
  "αεροδρόμιο":"aerodhrómio", "ρολόι":"rolói", "κορόιδο":"koróidho", "Ευαγγελία":"Evangelía"
};
Object.entries(TR).forEach(([g, w]) => eq(translit(g), w, `translit ${g}`));

const SAME = [
  ["εντάξει", ["entaksi", "entaxi", "endaksi", "entaksei", "εντάξει", "εντάξι"]],
  ["έχω", ["exw", "exo", "eho", "echo", "ekho", "εχω"]],
  ["μου αρέσει", ["moy aresei", "mou aresei", "mu aresi"]],
  ["γιαγιά", ["giagia", "yiayia", "yaya"]],
  ["έξι", ["eksi", "exi", "εξι"]],
  ["δε μου αρέσει", ["de mou aresi"]],
  ["ευχαριστώ", ["efharisto","efcharisto","efkharisto","eyxaristw","efxaristo","evharisto","Efharistó","ευχαριστω","ΕΥΧΑΡΙΣΤΩ"]],
  ["γεια σου", ["yia sou","ya sou","geia sou","gia sou","yiasou","yia su","Γεια σου","γεια σου!"]],
  ["καλημέρα", ["kalimera","kalhmera","Kaliméra","καλημερα"]],
  ["παρακαλώ", ["parakalo","parakalw"]],
  ["δεν καταλαβαίνω", ["den katalaveno","dhen katalaveno","den katalavaino"]],
  ["συγγνώμη", ["signomi","sygnomi","signomi","sygnwmh","συγνωμη"]],
  ["νερό", ["nero","nerò"]],
  ["θέλω", ["thelo","8elw","thelw"]],
  ["όχι", ["ohi","oxi","ochi"]],
  ["ναι", ["ne","nai"]],
  ["μπύρα", ["bira","mpyra","byra","mbira"]],
  ["Θα ήθελα έναν καφέ", ["tha ithela enan kafe","8a h8ela enan kafe"]],
  ["ένα", ["ena"]],
  ["Πού είναι;", ["pou einai","pou ine?","Που ειναι"]]
];
SAME.forEach(([g, list]) => list.forEach(t => { if (!answerMatch(t, [g])) { fails++; console.log(`✗ «${t}» should match «${g}»: ${answerKey(t)} ≠ ${answerKey(g)}`); } }));

const DIFF = [["ναι","όχι"],["ένα","δύο"],["καλημέρα","καληνύχτα"],["νερό","κρασί"],["θέλω","έχω"],["μία","ένα"],["τρία","τέσσερα"],["εδώ","εκεί"],["έχω","έξω"],["έξι","έχει"]];
DIFF.forEach(([a, b]) => { if (answerKey(a) === answerKey(b)) { fails++; console.log(`✗ «${a}» and «${b}» collide: ${answerKey(a)}`); } });

console.log(fails ? `\n${fails} failure(s)` : `OK — ${Object.keys(TR).length} transliterations, ${SAME.reduce((n, [, l]) => n + l.length, 0)} spellings, ${DIFF.length} distinct pairs`);
process.exit(fails ? 1 : 0);
