const { Intents } = require('discord.js');

function EpicRPG(message) {
  
  this.message = message;
  
  let msgTxt = this.message.content;
  let epicRoleId = '<@&928404367063777311>';
  let action = false;
  
  this.check = function() {
  
    // Add a warning heart react if HP drops below 30%
    // Add a warning triangle if (lost HP*2) > remaining HP
    if (msgTxt.indexOf('remaining HP is') > 0) {
      let str = msgTxt.split('HP, remaining HP is');
      let lostHp = str[0].split('Lost');
      let health = str[1].split('/'),
          fullhealth = health[1].split('*');
      if ((health[0] / fullhealth[0]) < 0.3) { this.message.react("❣️"); }
      if ((lostHp[1] * 2) > health[0]) { this.message.react("⚠️"); }
    }
    
    // Join Arena
    if (msgTxt.indexOf('Type join to join the arena!') > 0) {
      action = "join";
    }
    
    // Fight Miniboss
    if (msgTxt.indexOf('Type fight to help and get a reward!') > 0) {
      action = "fight";
    }
    
    // Catch Coins
    if (msgTxt.indexOf('Type CATCH (once) to collect some coins!') > 0) {
      action = "catch";
    }
    
    // Collect Fish
    if (msgTxt.indexOf('Type FISH (once) to collect some fish!') > 0) {
      action = "fish";
    }
    
    // Collect Fish
    if (msgTxt.indexOf('Type SUMMON (once) to join the summoning!') > 0) {
      action = "summon";
    }
    
    // Chop logs
    if (msgTxt.indexOf('Type CHOP (once) to collect some wooden logs!') > 0) {
      action = "chop";
    }
    
    if (action != false) {
      this.message.channel.send(epicRoleId + ' ' + action);      
    }

  }
}
    
module.exports = { EpicRPG }