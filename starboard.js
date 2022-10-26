function channel(reaction){
  var id = null;
  var emoji = reaction.emoji.name;

  switch (emoji){
    case "🌽":
      id = "902331472688599071"
      break;

    case "npcnews":
      id = "968319916757360680"
      break;

    case "halloffame":
      id = "902329829502898207"
      break;

    case "⭐":
      id = "922163116530339871"
      break;

    case "fart":
      id = "975893368078999563"
      break;

    case "🇬🇷":
      id = "911666334050451507"
      break;
  }
  return id;
}

function checkReact(reaction){
  var starboard = channel(reaction);
  
  if (starboard != null && reaction.count >= 2){
    return [starboard, reaction.message]
  }
  else{
    return null
  }
//console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
//console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
//console.log(reaction.emoji);
}

module.exports = { checkReact }