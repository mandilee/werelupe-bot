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

//import starboard
const sb = require('./Starboard/starboard.js');

//import Neopet Fetcher
const nf = require('./NeopetFetcher/NeopetFetcher.js');

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

//import the NeoRPG
const nr = require('./NeoRPG/NeoRPG.js');
neoRPG = new nr.NeoRPG();

//Neo RPG Slash Commands Responding
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  //adopt a pet
  if (interaction.commandName === 'adopt') {
    const petName = interaction.options.getString('petname');
    content = await neoRPG.adopt(interaction.user, petName);
    await interaction.reply({ embeds: [content] });
  }
  
  //create a pet
  if (interaction.commandName === 'create') {
    const petName = interaction.options.getString('petname');
    content = await neoRPG.create(interaction.user, petName);
    await interaction.reply({ embeds: [content] });
  }

  //abandon a pet
  if (interaction.commandName === 'abandon') {
    const petName = interaction.options.getString('petname');
    content = await neoRPG.abandon(interaction.user, petName);
    await interaction.reply({ embeds: [content] });
  }

  //view a pet
  if (interaction.commandName === 'view') {
    const petName = interaction.options.getString('petname');
    content = await neoRPG.view(interaction.user, petName);
    await interaction.reply({ embeds: [content] });
  }

  //view the pound
  if (interaction.commandName === 'pound') {
    content = await neoRPG.pound(interaction.user);
    await interaction.reply({ embeds: [content] });
  }

  //feed a pet
  if (interaction.commandName === 'feed') {
    const petName = interaction.options.getString('petname');
    content = await neoRPG.feed(interaction.user, petName);
    await interaction.reply({ embeds: [content] });
  }
  
  //join NeoRPG
  if (interaction.commandName === 'join') {
    content = await neoRPG.join(interaction.user);
    await interaction.reply({ embeds: [content] });
  }

  //quit NeoRPG
  if (interaction.commandName === 'quit') {
    content = await neoRPG.quit(interaction.user);
    await interaction.reply({ embeds: [content] });
  }

  //Get a Random Event
  if (interaction.commandName === 'shh') {
    let content = new MessageEmbed();
    content.setTitle("Working on it..");
    await interaction.reply({ embeds: [content] });
    content = await neoRPG.randomEvent(interaction.user);
    await interaction.editReply({ embeds: [content] });
  }

  //wheel of excitement NeoRPG
  if (interaction.commandName === 'excitement') {
    content = await neoRPG.excitement(interaction.user);
    await interaction.reply({ embeds: [content] });
  }
  
  //Set Active Pet
  if (interaction.commandName === 'setactive') {
    const petName = interaction.options.getString('petname')
    content = await neoRPG.setActive(interaction.user, petName);
    await interaction.reply({ embeds: [content] });
  }

  //zap a pet
  if (interaction.commandName === 'zap') {
    const petName = interaction.options.getString('petname')
    let content = new MessageEmbed();
    content.setTitle("Working on it..");
    await interaction.reply({ embeds: [content] });
    content = await neoRPG.zap(interaction.user, petName);
    await interaction.editReply({ embeds: [content] });
  }

  //get user stats
  if (interaction.commandName === 'getstats') {
    let profile = interaction.user
    if(interaction.options.getUser('user')){
      profile = interaction.options.getUser('user')
    }
    content = await neoRPG.getStats(profile);
    await interaction.reply({ embeds: [content] });
  }

  //view inventory
  if (interaction.commandName === 'inventory') {
    content = await neoRPG.inventory(interaction.user);
    await interaction.reply({ embeds: [content], ephemeral: true});
  }
  //paint Pet
  if (interaction.commandName === 'paint') {
    const petName = interaction.options.getString('petname')
    const color = interaction.options.getString('color')
    let content = new MessageEmbed();
    content.setTitle("Working on it..");
    await interaction.reply({ embeds: [content] });
    content = await neoRPG.paint(interaction.user, petName, color);
    await interaction.editReply({ embeds: [content] });
  }

   //morph pet
  if (interaction.commandName === 'morph') {
    const petName = interaction.options.getString('petname')
    const color = interaction.options.getString('color')
    const species = interaction.options.getString('species')
    let content = new MessageEmbed();
    content.setTitle("Working on it..");
    await interaction.reply({ embeds: [content] });
    content = await neoRPG.morph(interaction.user, petName, color, species);
    await interaction.editReply({ embeds: [content] });
  }
  
  //healing springs
  if (interaction.commandName === 'heal') {
    content = await neoRPG.heal(interaction.user);
    await interaction.reply({ embeds: [content] });
  }

  //get help
  if (interaction.commandName === 'help') {
    content = await neoRPG.help();
    await interaction.reply({ embeds: [content], ephemeral: true});
  }
  
});

//RoDaddy Stuff
//initialize Game Runner
gameRunner = new gameBot.GMBot();

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

//Do things when users send messages to the server:
client.on("messageCreate", (message) => {//Do Not Close This Function Till Later

  //turn the message to Lower Case for comparisons
  let lowerCaseMessageContent = message.content.toLowerCase();

  /* EPIC RPG */ //Moved up to avoid bot excluder
  (new rpg.EpicRPG(message)).check();

  //Don't have the bot react to itself
  if (message.author.bot) return

  //Rodaddy's Den LOL
    if (message.content === "$test") {
    neoRPG.test(message).then(()=>{});
  }
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
  if (message.content === "$r3") {
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
  
  //listen for neopets
  neoFetcher = new nf.NeopetFetcher();
  neoFetcher.respond(message);

  // message.content.toLowerCase().includes("TEXTHERE") does not work in IE fun fact

  //Random React Rules

  if (lowerCaseMessageContent.indexOf("bad bot") >= 0) {
    message.channel.send({
          embeds: [
            {
              title: 'Please forgive Werelupe-bot',
              description: 'Werelupe-bot is sorry ☹️'
            }
          ],
        })
  }

  //Vote Dani as a twist
  if (lowerCaseMessageContent.indexOf("dani") >= 0) {
    //Response List
    const response = [
      "Vote Dani, as a twist"
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

  //panda react to panpan
  if (lowerCaseMessageContent.indexOf("panpan") >= 0) {
    message.react("931286481262215178");
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