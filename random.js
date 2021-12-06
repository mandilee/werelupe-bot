
/* "COIN FLIP" (Return 0 or 1) */
function coinFlip(){
var x = Math.floor(Math.random() * 2);
return x
}

/*/function to get a random Int in a range
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
*/

/*  ISLAND MYSTIC */

const w1 = ["Your ability to","Your ability to smell will","Your confidence will","Your direction in life will","Your luck will","Your sense of direction will","Your sense of self will","You will accidentally","You will accidentally discard","You will be assaulted by","You will be attacked by","You will be chased by","You will be taunted by","You will come across","You will defeat in single combat","You will defend yourself against","You will discover","You will eventually","You will fight off","You will find","You will happen across","You will have","You will lose","You will misplace","You will mistakenly crush","You will quickly","You will rapidly","You will reveal","You will slowly","You will suddenly","You will suffer injuries from","You will totally forget","You will unearth"]

const w2 = ["a Blumaroo Plushie","a Cement Mixer","a Chia plushie","a Gold Bike","a golden Juppie","a Kau Plushie","a bottled Faerie","a cool weapon","a fabulous weapon","a flock of","a golden Juppie","a keychain","a negg","a pack of","a paint brush","a Rod of Supernova","a trio of","a valuable artifact","all your food","alter","amazing fortune","amazing luck","an Aisha plushie","an apple","an army of","awful fortune","bad fortune","bad luck","cease","change","countless","decide to","demonic fortune","demonic luck","discard","dissapointing fortune","dissapointing luck","drink fish oil","drink mutant slime","drink oven grease","drink stale sweat","eat","evil fortune","excellent fortune","gold and jewels","good fortune","good luck","hear","horrible fortune","horrible luck","incredible fortune","incredible luck","legions of","make a decision to","many Neopoints","most of your Neopoints","nasty fortune","nasty luck","outrageous fortune","outrageous luck","perilous fortune","perilous luck","rare Neggs","realise that you forgot to","realise that you have to","realise that you must","realise you have to","run fast","scores of","see","several","sing","some of your Neopoints","somebody else's trousers","stolen from you","terrible fortune","terrible luck","that you forgot to","that you must","treacherous fortune","treacherous luck","unexpected fortune","unexpected luck","ungodly luck","unusual fortune","unusual luck","vast riches","you have to","your Neggs","your best friend's items"]

const w3 = ["at the","deranged","enormous","enraged","evil","feed your pets","flying","four-headed","gargle with","gigantic","give your Neopet","glow-in-the-dark","hug your","huge","in","in the","insane","invisible","look after your","never eat","on","play","play with your","psychotic","purple","radioactive","rampaging","snarling","stealthy","stop","three-headed","to"]

const w4 = ["Acaras.","a Green Negg.","a petpet.","a strange way.","Bank.","bananas.","Battle Magic Shop.","Blumaroos.","burp repeatedly.","bury all your clothes.","Cheat.","Chias.","Dice-A-Roo.","Eyries.","Faerieland.","Faeries.","Food Shop.","Gormball.","Happy Valley.","Kaus.","Kiko Lake.","Kikos.","Haunted Woods.","Ice Caves.","jelly.","korrall some kaus!.","Kyries.","Lennies.","Lupes.","Magic Shop.","Maraqua.","mashed potatoes.","Monoceri.","Mutants.","Mystery Island.","NeoQuest II.","Neopet.","Neopia Central.","Nimmos.","Pant Devils.","paint your left ear green.","pretend your name is Keith.","put your finger in your ear.","repeatedly.","Sausages.","Scorchios.","Shoyrus.","Sloth's Minions.","Smoothie Shop.","Space Station.","Techos.","Terror Mountain.","unexpectedly.","Uni Meadows.","wearing a hat.","Wishing Well.","without your noticing.","Zafaras."]



function islandMystic(){
var phrase1 = w1[Math.floor(Math.random()*w1.length)];
var phrase2 = w2[Math.floor(Math.random()*w2.length)];
var phrase3 = w3[Math.floor(Math.random()*w3.length)];
var phrase4 = w4[Math.floor(Math.random()*w4.length)];

var fortune = phrase1 + " " + phrase2 + " " + phrase3+ " " + phrase4;
return fortune
}


/* SHOULD I GAMBLE?? */

const noGamble = ["Nope, don't do it.", "NO! Put it in the bank instead!!!","if you have to ask, you know the answer already (it's no.)"]
const yesGamble = ["BET IT ALL", "yolo, do it", "if you have to ask, you know the answer already (it's yes.)"]

function peerPressure(){
let fate = coinFlip();
var array = [];
var phrase = ""

if (fate == 0)
{
  array = noGamble
}
else if (fate == 1)
{
  array = yesGamble
}

phrase = array[Math.floor(Math.random()*array.length)];
return phrase

}



module.exports = { islandMystic, coinFlip, peerPressure }
