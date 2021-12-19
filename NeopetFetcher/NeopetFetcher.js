//import Compliment List
const response = require('./NeopetCaptions.json');
const { MessageEmbed } = require('discord.js');

function NeopetFetcher(message){

  this.message = message;
  this.lowerCaseMessageContent = this.message.content.toLowerCase();

  //new Regex to determine a neopet is mentioned
  this.neopet = /.*(8-bit|Agueena|Alien|Apple|Asparagus|Aubergine|Avocado|Baby|Biscuit|Blue|Blueberry|Brown|Burlap|Camouflage|Candy|Carrot|Checkered|Chocolate|Chokato|Christmas|Clay|Cloud|Coconut|Coffee|Corn|Custard|Darigan|Desert|Dimensional|Disco|Durian|Elderlyboy|Elderlygirl|Electric|Eventide|Faerie|Fire|Garlic|Ghost|Glass|Glowing|Gold|Gooseberry|Grape|Green|Grey|Halloween|Ice|Invisible|Island|Jelly|Juppieswirl|Lemon|Lime|Magma|Mallow|Maractite|Maraquan|Marble|Mosaic|Msp|Mutant|Oilpaint|Onion|Orange|Origami|Pastel|Pea|Peach|Pear|Pepper|Pineapple|Pink|Pirate|Plum|Plushie|Polkadot|Purple|Quigukiboy|Quigukigir|Rainbow|Red|Relic|Robot|Royal|Royalboy|Royalgirl|Shadow|Silver|Sketch|Skunk|Slushie|Snot|Snow|Speckled|Split|Sponge|Spotted|Starry|Stealthy|Steampunk|Stone|Strawberry|Striped|Swampgas|Thornberry|Tomato|Toy|Transparent|Tyrannian|Ummagine|Usukiboy|Usukigirl|Water|White|Woodland|Wraith|Yellow|Zombie)\s(Acara|Aisha|Blumaroo|Bori|Bruce|Buzz|Chia|Chomby|Cybunny|Draik|Elephante|Eyrie|Flotsam|Gelert|Gnorbu|Grarrl|Grundo|Hissi|Ixi|Jetsam|Jubjub|Kacheek|Kau|Kiko|Koi|Korbat|Kougra|Krawk|Kyrii|Lenny|Lupe|Lutari|Meerca|Moehog|Mynci|Nimmo|Ogrin|Peophin|Poogle|Pteri|Quiggle|Ruki|Scorchio|Shoyru|Skeith|SlushieChia|Techo|Tonu|Tuskaninny|Uni|Usul|Vandagyre|Wocky|Xweetok|Yurble|Zafara).*/i;

  if (this.neopet.exec(this.message.content)) {

    //extract color and pet from message in lowercase
    var color = this.neopet.exec(this.message.content)[1].toLowerCase();
    var pet = this.neopet.exec(this.message.content)[2].toLowerCase();

    //special case for pineapple since it contains "apple"
    if (this.lowerCaseMessageContent.indexOf("pineapple") >= 0) {
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

}

module.exports = { NeopetFetcher }
