//RodoYolo - Rodaddy 2021
//import Caption List
const neoResponse = require('./NeopetCaptions.json');
const hoeResponse = require('./HoeCaptions.json');
const neopetRegex = require('./NeoRegex.json');

//import fetch functionality from node
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const { MessageEmbed } = require('discord.js');

function NeopetFetcher() {

  this.neopetEvaluator = new RegExp(neopetRegex.regex, "i");
  this.petInfo = {};
  this.message = "";
  //check is message has a neopet in it
  this.hasNeopet = 
    function(message){
      
      this.message = message;
      //Regex to determine a neopet is mentioned
      neopet = this.neopetEvaluator.exec(this.message.content);
      
      //this returns an array with the full Neopet name (0), color (1), species (2)

      //special cases
      if(neopet){
        
        //special case for pineapple
        lowerCaseMessageContent = this.message.content.toLowerCase();
        if (lowerCaseMessageContent.indexOf("pineapple") >= 0) neopet[1] = "pineapple";

        //checkered
        lowerCaseMessageContent = this.message.content.toLowerCase();
        if (lowerCaseMessageContent.indexOf("checkered") >= 0) neopet[1] = "checkered";

        //sheared
        lowerCaseMessageContent = this.message.content.toLowerCase();
        if (lowerCaseMessageContent.indexOf("sheared") >= 0) neopet[1] = "sheared";

        
        //special case for usuki & quiguki
        if (lowerCaseMessageContent.indexOf("usukiboy") >= 0 || lowerCaseMessageContent.indexOf("usuki boy") >= 0  || lowerCaseMessageContent.indexOf("quigukiboy") >= 0  || lowerCaseMessageContent.indexOf("quiguki boy") >= 0  ){
          if (neopet[2].toLowerCase() === "quiggle") neopet[1] = "quigukiboy";
          else neopet[1] = "usukiboy";
        }
    
        if (lowerCaseMessageContent.indexOf("usukigirl") >= 0 || lowerCaseMessageContent.indexOf("usuki girl") >= 0 || lowerCaseMessageContent.indexOf("quigukigirl") >= 0  || lowerCaseMessageContent.indexOf("quiguki girl") >= 0 ){
          if (neopet[2].toLowerCase() === "quiggle") neopet[1] = "quigukigirl";
          else neopet[1] = "usukigirl";
        }
      }  
      return neopet;
    };

  //respond
  this.respond = 
    function(message){
      //if there is a Neopet in the content respond
      neopet = this.hasNeopet(message)
      //if message contains neopet
      var npc = false;
      //npc
      lowerCaseMessageContent = this.message.content.toLowerCase();
      if (lowerCaseMessageContent.indexOf("gross") >= 0) npc = true;
      if(neopet){
        this.petInfo = getPetInfo(neopet, npc);
        //run the check image function
    checkImage(this.petInfo.petUrl).then(d => {
      //if pet is not found 
      if (d.indexOf("Not Found") >= 0 || d.indexOf("Error") >= 0) {
        var notFoundText = this.petInfo.colorCap + " " + this.petInfo.petCap + " doesn't Exist...Yet";
      if(this.petInfo.color === "hoe") notFoundText = notFoundText + " but you should ask Amy to make it 😏"
        
      this.message.channel.send(
        {
          embeds: [
            {
              title: this.petInfo.colorCap + " " + this.petInfo.petCap + " doesn't Exist...Yet"
            }
          ],
        }).then(m => {
          m.react("🥺");
        });
        
      }//end if not found
        
      else {
        var response = neoResponse;
        if (this.petInfo.color === "hoe") response = hoeResponse;
        
        //RNG the response
        var rng = getRandomInt(response.length);
        //get the response here; replace the %c and %p placeholders as needed
        finalCaption = response[rng].replace('%c', this.petInfo.colorCap).replace('%p', this.petInfo.petCap);

        //special caption for aubergine chia
        if (this.petInfo.pet === "chia" && this.petInfo.color === "aubergine") finalCaption = "🍆🍆 Sexy Time 🍆🍆";

        //special caption for sheared jub
        if (this.petInfo.pet === "jubjub" && this.petInfo.color === "sheared") finalCaption = "That's definitely a testicle...";
        
        //Send Message
        message.channel.send({
          embeds: [
            {
              title: finalCaption
            }
          ],
          files: [this.petInfo.petUrl],
        }).then(m => {
          //if this was a halloween lupe react with werewolf emoji
          if (this.petInfo.pet === "lupe" && this.petInfo.color === "halloween") {
            m.react("🐺");
          }
        });
      }
    });        
      }//end if Neopet exists
    }
  
  
    //Have to check if this pet exists
    //Async Function to check if the Pet Exists
    //Calls the URL - Images will return the image
    //No Image returns HTML Text saying not found
    //check image 
  async function checkImage(petUrl) {
      let response = await fetch(petUrl);
      let data = response.text();
      return data;
  }
    
} //end of Neopet Fetcher Class

  //function to get a random Int in a range
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  //evaluate the colors and pets
  function getPetInfo(rawPetInfo, npc){
    
    //petInfo = rawPetInfo
    if (rawPetInfo) {

    //extract color and pet from message in lowercase
    var color = rawPetInfo[1].toLowerCase();
    var pet = rawPetInfo[2].toLowerCase();
      
   //if someone mentions usuki - rng boy or girl
    var usukis = ["usukiboy", "usukigirl"];
    //special quiguki case
    if (pet === "quiggle") usukis = ["quigukiboy", "quigukigirl"];
    if (color === "usuki" || color === "quiguki") color = usukis[getRandomInt(usukis.length)];
      
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
      var petUrl = ""
    if (npc){
    petUrl = "http://neopetsclassic.com/images/pets/" + petCap + "/beaten/" + pet + "_" + color + "_baby.gif";
    }
    else{
         petUrl = "https://grundoscafe.b-cdn.net/pets/circle/" + pet + "_" + color + ".gif";
      }

    //special URL for Nugget Chia
    // if(pet === "chia" && color === "nugget") petUrl = "https://media.discordapp.net/attachments/911666334050451507/944090945287254066/Screen_Shot_2022-02-17_at_11.39.42_PM.png";

    //special URL for Hoe Chia
    if(pet === "chia" && color === "hoe")petUrl = "https://media.discordapp.net/attachments/917538490118467624/943544804762075246/Screenshot_20220211-191754-309.png";

    return {"petUrl": petUrl, "petCap": petCap, "colorCap": colorCap, "pet": pet, "color":color};
  }
} //end get Pet Info

module.exports = { NeopetFetcher }
