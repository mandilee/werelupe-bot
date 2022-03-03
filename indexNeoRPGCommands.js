const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const { SlashCommandBuilder } = require('@discordjs/builders');

//Tokens
const token = process.env['token']
const CLIENT_ID = process.env['client_id']
const GUILD_ID = process.env['guild_id']

const rest = new REST({ version: '9' }).setToken(token);

//have to run this individually
// To add these or update these slash commands to the server
// 1. Edit the package.json from:   
//   "main": "bot.js",
//   "scripts": {
//     "start": "node bot.js"
//   },
// to  
//   "main": "index.js",
//   "scripts": {
//     "start": "node index.js"
//   },
// then run the application
const commands = [
  //adopt slash command - /adopt requires pet name
  //adopt a random basic pet
  new SlashCommandBuilder().setName('adopt').setDescription('Adopts a pet from the pound with the name provided!').addStringOption(option => option.setName('petname').setDescription('Enter a name for your pet').setRequired(true)),
  //adopt slash command - /adopt requires pet name
  //adopt a random basic pet
  new SlashCommandBuilder().setName('create').setDescription('Creates a random pet with the name provided!').addStringOption(option => option.setName('petname').setDescription('Enter a name for your pet').setRequired(true)),
  new SlashCommandBuilder().setName('pound').setDescription('Shows you pets in the pound'),
  //abandon slash command - /abandon requires pet name
  //abandons the pet with the selected name
  new SlashCommandBuilder().setName('abandon').setDescription('Abandons the pet with the name provided!').addStringOption(option => option.setName('petname').setDescription('Enter the name of the pet you want to abandon').setRequired(true)),
  //feed slash command -/feed requires pet name
  //feeds the pet wit the name provided - if you're the owner
    new SlashCommandBuilder().setName('feed').setDescription('Feeds the pet with the name provided!').addStringOption(option => option.setName('petname').setDescription('Enter the name of the pet you want to feed').setRequired(true)),
  //join slash command /join
  //adds user the game
  new SlashCommandBuilder().setName('join').setDescription('Lets you join NeoRPG!'),
  //quit slash command /quit 
  //removes user from game
  new SlashCommandBuilder().setName('quit').setDescription('Quit playing NeoRPG and give everything up'),
  //view slash commands - /view requires pet name
  //displays the stats of the pet with the name provided
  new SlashCommandBuilder().setName('view').setDescription('View the pet with the name provided!').addStringOption(option => option.setName('petname').setDescription('Enter pet name').setRequired(true)),
  //setactive slash commands - /setactive requires pet name
  //sets the active pet based on the name provided
  new SlashCommandBuilder().setName('setactive').setDescription('Sets the entered pet as your active pet').addStringOption(option => option.setName('petname').setDescription('Enter pet name').setRequired(true)),
  //zaps your pet
  new SlashCommandBuilder().setName('zap').setDescription('Zaps your selected pet').addStringOption(option => option.setName('petname').setDescription('Enter pet name').setRequired(true)),
  //getStats slash command - /getstats 
  //shows user own stats 
  new SlashCommandBuilder().setName('getstats').setDescription('See your or a user\'s stats in NeoRPG').addUserOption(option => option.setName('user').setDescription('Select a user')),
  //shows user own stats 
  new SlashCommandBuilder().setName('help').setDescription('Provides the user with general information about NeoRPG'),
  //gets a random event
  new SlashCommandBuilder().setName('shh').setDescription('Get A Random Event!'),
  //view inventory
  new SlashCommandBuilder().setName('inventory').setDescription('View your inventory'),
  //paint a pet
  new SlashCommandBuilder().setName('paint').setDescription('Paint the pet with the name and color provided! (Paint Brush Required)').addStringOption(option => option.setName('petname').setDescription('Enter pet name').setRequired(true)).addStringOption(option => option.setName('color').setDescription('Enter the color you wish you paint this pet').setRequired(true))
];

console.log(commands);

//this function loads the commands
(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();