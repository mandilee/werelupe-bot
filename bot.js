// don't edit these lines!
// needed for heroku to bring life!
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const server = express().listen(PORT, () => console.log(`Listening on ${ PORT }`))

const { Client, Intents, MessageEmbed } = require('discord.js');

const client = new Client({
  intents: [
    "GUILDS",
    "GUILD_MESSAGES", //Messages
    "GUILD_MESSAGE_REACTIONS",//need these for reactions
    "DIRECT_MESSAGES"
  ]
})


//import fetch functionality from node
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

//discord login token for werelupe bot
const token = process.env['token']

//Functions for 'random' rng response commands like dice rolls, fortunes, etc
const random = require('./random.js');

//import the GMBot
const gameBot = require('./Game/GMBot.js');

//import Compliment Giver
const cg = require('./ComplimentGiver/ComplimentGiver.js');

//import Insult Giver
const ig = require('./InsultGiver/InsultGiver.js');

//import EpicRPG
const rpg = require('./EpicRPG/EpicRPG.js');

//Function to check if a string matches regardless of case
function sameCase(str) {
  return /^[A-Z]+$/.test(str) || /^[a-z]+$/.test(str);
}

//Gets a quote & author & returns string with format "Quote - Author"
function inspire() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json()
    })
    .then(data => {
      return data[0]["q"] + " -" + data[0]["a"]
    })
}

//When the bot goes online, print a message to console.
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//Slash Commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

//RoDaddy Stuff
//initialize Game Runner
gameRunner = new gameBot.GMBot();

//Do things when users send messages to the server:
client.on("messageCreate", (message) => {//Do Not Close This Function Till Later

  //turn the message to Lower Case for comparisons
  let lowerCaseMessageContent = message.content.toLowerCase();

  /* EPIC RPG */ //Moved up to avoid bot excluder
  (new rpg.EpicRPG(message)).check();

  //Don't have the bot react to itself
  if (message.author.bot) return

  //Rodaddy's Den LOL
  if (message.content === "$rodotest") {
    //Replies
    message.channel.send("Sup Hoes");
    //Replies to User
    message.reply("Testing");
    //Sends Author a DM
    message.author.send("You are a **WEREWOLF**. SHHH Don't tell anyone.");
    //addPlayer(message.author);
  }

  //Listen if someone wants to start a Werelupe Game
  if (message.content === "$r2") {
    gameRunner.start(message);
  }

  //Listen if someone want a compliment 
  if (lowerCaseMessageContent.indexOf("compliment") >= 0 && lowerCaseMessageContent.indexOf("plz") >= 0) {
    
    //initialize compliment giver
    complimenter = new cg.ComplimentGiver (message);
    complimenter.give();
  }

   //Listen if someone want an insult
  if (lowerCaseMessageContent.indexOf("insult") >= 0 && lowerCaseMessageContent.indexOf("plz") >= 0) {
    
    //initialize compliment giver
    insulter = new ig.InsultGiver (message);
    insulter.give();
  }


  //Compliment Giver for Neo
  if (lowerCaseMessageContent === "compliment neo") {
    //Response List
    const response = [
      "Neo, you will NOT flunk out!",
      "Neo you're wonderful",
      "Neo everything will be awesome :D",
      "Neo! Hugs!"
    ];

    //RNG
    var rng = getRandomInt(response.length);
    message.channel.send({
      embeds: [
        {
          title: response[rng]
        }
      ]
    });
  }

  //Neopet Responder Starts Here - Rodaddy 2021
  //new Regex to determine a neopet is mentioned
  let neopet = /.*(8-bit|Agueena|Alien|Apple|Asparagus|Aubergine|Avocado|Baby|Biscuit|Blue|Blueberry|Brown|Burlap|Camouflage|Candy|Carrot|Checkered|Chocolate|Chokato|Christmas|Clay|Cloud|Coconut|Coffee|Corn|Custard|Darigan|Desert|Dimensional|Disco|Durian|Elderlyboy|Elderlygirl|Electric|Eventide|Faerie|Fire|Garlic|Ghost|Glass|Glowing|Gold|Gooseberry|Grape|Green|Grey|Halloween|Ice|Invisible|Island|Jelly|Juppieswirl|Lemon|Lime|Magma|Mallow|Maractite|Maraquan|Marble|Mosaic|Msp|Mutant|Oilpaint|Onion|Orange|Origami|Pastel|Pea|Peach|Pear|Pepper|Pineapple|Pink|Pirate|Plum|Plushie|Polkadot|Purple|Quigukiboy|Quigukigir|Rainbow|Red|Relic|Robot|Royal|Royalboy|Royalgirl|Shadow|Silver|Sketch|Skunk|Slushie|Snot|Snow|Speckled|Split|Sponge|Spotted|Starry|Stealthy|Steampunk|Stone|Strawberry|Striped|Swampgas|Thornberry|Tomato|Toy|Transparent|Tyrannian|Ummagine|Usukiboy|Usukigirl|Water|White|Woodland|Wraith|Yellow|Zombie)\s(Acara|Aisha|Blumaroo|Bori|Bruce|Buzz|Chia|Chomby|Cybunny|Draik|Elephante|Eyrie|Flotsam|Gelert|Gnorbu|Grarrl|Grundo|Hissi|Ixi|Jetsam|Jubjub|Kacheek|Kau|Kiko|Koi|Korbat|Kougra|Krawk|Kyrii|Lenny|Lupe|Lutari|Meerca|Moehog|Mynci|Nimmo|Ogrin|Peophin|Poogle|Pteri|Quiggle|Ruki|Scorchio|Shoyru|Skeith|SlushieChia|Techo|Tonu|Tuskaninny|Uni|Usul|Vandagyre|Wocky|Xweetok|Yurble|Zafara).*/i;

  if (neopet.exec(message.content)) {

    //extract color and pet from message in lowercase
    var color = neopet.exec(message.content)[1].toLowerCase();
    var pet = neopet.exec(message.content)[2].toLowerCase();

    //special case for pineapple since it contains "apple"
    if (lowerCaseMessageContent.indexOf("pineapple") >= 0) {
      color = "pineapple";
    }
    //if someone mentions royal - rng boy or girl
    var royals = ["royalboy", "royalgirl"];
    if (color === "royal") color = royals[getRandomInt(royals.length)];

    //Capitalize Pet Names
    var petCap = pet.charAt(0).toUpperCase() + pet.slice(1);
    //special case for JubJub
    if (pet === "jubjub") petCap = "JubJub";
    //special case for Slushie Chia
    if (pet === "slushiechia") petCap = "SlushieChia";
    //Capitalize Color Name
    var colorCap = color.charAt(0).toUpperCase() + color.slice(1);

    //Create Pet URL
    var petUrl = "http://neopetsclassic.com/images/pets/" + petCap + "/circle/" + pet + "_" + color + "_baby.gif";

    //Have to check if this pet exists
    //Async Function to check if the Pet Exists
    //Calls the URL - Images will return the image
    //No Image returns HTML Text saying not found
    async function checkImage() {
      let response = await fetch(petUrl);
      let data = response.text();
      return data;
    }

    //run the check image function
    checkImage().then(d => {
      //if pet is not found 
      if (d.indexOf("Not Found") >= 0) {
        message.channel.send({
          embeds: [
            {
              title: colorCap + " " + petCap + " doesn't Exist...Yet"
            }
          ],
        }).then(m => {
          m.react("🥺");
        });
      }
      else {

        //import responses need to fix this so the + variables work
        const response = require('./NeopetFetcher/NeopetCaptions.json');
        
        //RNG the response
        var rng = getRandomInt(response.length);
        //get the response here; replace the %c and %p placeholders as needed
        finalCaption = response[rng].replace('%c', colorCap).replace('%p', petCap);

        //special caption for aubergine chia
        if (pet === "chia" && color === "aubergine") finalCaption = "🍆🍆 Sexy Time 🍆🍆";

        //Send Message
        message.channel.send({
          embeds: [
            {
              title: finalCaption
            }
          ],
          files: [petUrl],
        }).then(m => {
          //if this was a halloween lupe react with werewolf emoji
          if (pet === "lupe" && color === "halloween") {
            m.react("902350295215005726");
          }
        });
      }
    });
  } //end of big if statement and bulk of neopet responder

  //function to get a random Int in a range
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  //End Neopet Responder

  // message.content.toLowerCase().includes("TEXTHERE") does not work in IE fun fact

  //Random React Rules

  if (lowerCaseMessageContent.indexOf("werelupe") >= 0) {
    console.log("Someone Said Werelupe!!");
    message.react("902357197382631514")
  }

  //bingus react
  if (lowerCaseMessageContent.indexOf("bingus") >= 0) {
    message.react("913981696158863401");
  }

  //tiki man juice react
  if (lowerCaseMessageContent.indexOf("juic") >= 0) {
    message.react("903661431700983890");
  }
  
  //occam razor sus react
  if (lowerCaseMessageContent.indexOf("occam's razor") >= 0 || lowerCaseMessageContent.indexOf("occams razor") >= 0) {
    message.react("902350293839261736");
  }

  //mystic and faith geese react  
  if (lowerCaseMessageContent.indexOf("mystic") >= 0 && lowerCaseMessageContent.indexOf("faith") >= 0 && (lowerCaseMessageContent.indexOf("wolf") || lowerCaseMessageContent.indexOf("sus") >= 0 || lowerCaseMessageContent.indexOf("wolves") >= 0)) {
    message.react("911398187233853491");
  }

  //horse and breeding react
  if (lowerCaseMessageContent.indexOf("breeding") >= 0 || lowerCaseMessageContent.indexOf("horse") >= 0) {
    message.react("912532635509719110");
  }

  //cancelled react
  if (lowerCaseMessageContent.indexOf("cancelled") >= 0) {
    message.react("902350293382094908");
  }

  //grundo react to thicc
  if (lowerCaseMessageContent.indexOf("thicc") >= 0) {
    message.react("915620643733643284");
  }

  //corn reacts for Faith
  if (message.author.id === "785678185899229204" && lowerCaseMessageContent.indexOf("corn") >= 0) {
    message.react("🌽");
  }
  //Nice react to 69s
  let sixtyNine = /(^|\D)(69)(\D|$)/;
  if (sixtyNine.exec(message.content)) {
    message.react("915437195731546182");
    message.react("😏");
  }

  //smirk react to rodo
  if (lowerCaseMessageContent.indexOf("rodo") >= 0 || lowerCaseMessageContent.indexOf("rodolfo") >= 0 || lowerCaseMessageContent.indexOf("rodaddy") >= 0 || lowerCaseMessageContent.indexOf("ropapa") >= 0 ||
    lowerCaseMessageContent.indexOf("rowolfo") >= 0) {
    console.log("Someone's talking about Rodaddy....")
    message.react("😏");
  }
  
  //TM react to Ruby
  if (lowerCaseMessageContent.indexOf("ruby") >= 0 &&
    lowerCaseMessageContent.indexOf("list") >= 0) {
    message.react("™️");
  }
  //End Reactions Rules



  //Post message to specific channel
  if (lowerCaseMessageContent.indexOf("alexuh") >= 0) {
    client.channels.cache.get('911666334050451507').send('Hello here!');
  }

  //Print an inspiring quote and it's author
  if (message.content === "$inspire") {
    inspire().then(quote => message.channel.send(quote))
  }
  //Answer 0 or 1 
  if (message.content === "?gamble") {
    var ppPhrase = random.peerPressure();
    message.channel.send({
      "embeds": [
        {
          "color": 0xffbb00,
          "author": {
            "name": `${ppPhrase}`,
            "icon_url": `https://images.neopets.com/games/arcade/cat/luck_chance_50x50.png`
          }
        }
      ]
    });

  }
  //Island Mystic
  if (message.content === "$fortune") {
    var fortune = random.islandMystic();
    message.channel.send({
      "embeds": [

        {
          "type": "rich",
          "title": "",
          "description": `Welcome to my little hut. Ahh, I guess you came here to have your fortune told, eh? Well... here it is...`,
          "color": 0x65cf9b,
          "fields": [
            {
              "name": `${fortune}`,
              "value": "\u200B"
            }
          ],
          "author": {
            "name": `Mystic`,
            "icon_url": `https://images.neopets.com/neoboards/avatars/islandmystic.gif`
          },
          "footer": {
            "text": `Remember to come back!!! type $fortune`
          }
        }
      ]
    });
  }




}); //End bracket for 'do things when messages are sent to server'


//Start the bot
client.login(token);

//Current Issues
//when initialize - start game - end game - init - start (already ongoing game issue) - end (does not edit box) 
//when init - end (not editingw)