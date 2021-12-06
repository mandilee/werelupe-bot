//import Compliment List
const response = require('./Compliments.json');
const { MessageEmbed } = require('discord.js');


function ComplimentGiver(message){
  //set needed variables
  this.messageAuthor = message.author;
  this.messageChannel = message.channel;
  this.targetMember = message.mentions.members.first();
  this.responseEmbed = new MessageEmbed();

  this.give = function(){
    var rng = getRandomInt(response.length);
    if (!this.targetMember) {
      //RNG compliment with no mentioned user
      this.responseEmbed.setDescription(message.author.toString() + ": " + response[rng]);
      this.messageChannel.send({ embeds: [this.responseEmbed] }); //end send
    }
    else {
      //compliment with a mentioned user
      this.responseEmbed.setDescription(this.targetMember.toString() + ": " + response[rng]);
      this.messageChannel.send({ embeds: [this.responseEmbed] });
    }
  }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
    
module.exports = { ComplimentGiver }
