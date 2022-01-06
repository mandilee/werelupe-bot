const { Intents } = require('discord.js');

function EpicRPG(message) {

  this.message = message;
  this.action = false;

  let msgTxt = this.message.content;
  this.epicRoleId = '<@&914200180239253535>';

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

    this.checkEmbed();
  }

  this.checkEmbed = function() {
    if (this.message.embeds.length > 0) {
      for (let embed of this.message.embeds) {

        let fullText = embed.description + ' ' + embed.title + ' ';

        for (let field of embed.fields) {
          fullText += field.value + ' ' + field.name;
        }

        if (fullText.includes('Type join to join the arena')) {
          this.action = 'join';
        } else if (fullText.includes('Type fight to help and get a reward')) {
          this.action = 'fight';
        } else if (fullText.includes('Type CATCH (once) to collect some coins')) {
          this.action = 'catch';
        } else if (fullText.includes('Type FISH (once) to collect some fish')) {
          this.action = 'fish';
        } else if (fullText.includes('Type SUMMON (once) to join the summoning')) {
          this.action = 'summon';
        } else if (fullText.includes('Type CHOP (once) to collect some wooden logs')) {
          this.action = 'chop';
        } else if (fullText.includes('Type TIME TO FIGHT (once) to join the battle')) {
          this.action = 'time to fight';
        } 

        if (this.action != false) {
          this.message.channel.send(this.epicRoleId + ' ' + this.action);  
          return;
        }
      } // for
    } // this.message.embeds.length
  } // this.checkEmbed
}

module.exports = { EpicRPG }