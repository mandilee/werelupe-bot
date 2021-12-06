const { MessageEmbed } = require('discord.js');

const g = require('./Game.js');
const p = require('./Player.js');

let gameStarted = false;

function GMBot() {

this.gameOwner;
this.gameChannel;

  this.start = function(ogMessage) {
    
    
    //start new Game
    if(!gameStarted){
      //set game fields
      this.gameOwner = ogMessage.author;
      this.gameChannel = ogMessage.channel;
      //create a new game
      this.game = new g.Game(this.gameOwner, 1, 1, "[Instructions Go Here]");

      gameStarted=true;
    }
    else{
      let sorryEmbed = new MessageEmbed();
      sorryEmbed.setDescription("Sorry " + ogMessage.author.toString() + ", but " + this.gameOwner.toString() + " already started a game! You should join or watch that one!");
      ogMessage.channel.send({ embeds: [sorryEmbed] });
      return;
    }


    //Send Instructions to Starter
    this.gameOwner.send(this.game.instructions);

    //create message Embed for new Game Post
    this.startEmbed = new MessageEmbed();
    this.startEmbed.setTitle("So you wanna play Werelupe?");
    this.startEmbed.setDescription("React to join");

    //send start message
    this.gameChannel.send({ embeds: [this.startEmbed] }).then(m => {
      m.react("902350295215005726");
      m.react("👻");
      m.react("🟢");
      this.listenForEnd(m);//listen if the game ends
      this.collectPlayers(m);//collects players and calls begins game once start is pressed
    });//end the message send then

  //collectPlayers //need to add logic to flag users who are both ghosts and players
  this.collectPlayers = function(gameStartMessage) {
    //initialize collector
    let collector = gameStartMessage.createReactionCollector({ dispose: true });

    //collect reactions for sign ups
    collector.on('collect', (reaction, user) => {
      
      if (reaction.emoji.name === "🟢" && user.id === this.gameOwner.id){ 
        this.begin(gameStartMessage);//this is where the round begins
        collector.stop();
       } //close collector if collection is done
       if (gameStarted === false){//if the game goes back to not started stop.
         collector.stop(); // this may be unnecessary but leaving here
       }
      
      if (!user.bot){////ensure reactor is not a bot
         if(reaction.emoji.id === "902350295215005726") { //ensure wolf emoji
        //add user that reacted to ghost list
        this.game.players.push(user);

        //create player embed
        playerEmbed = createPlayerEmbed(this.game.players,this.game.ghosts, this.startEmbed);

        //update player list in message
        gameStartMessage.edit({ embeds: [playerEmbed] }); // end message edit
        } //end if wolf react
         if(reaction.emoji.name === "👻") { //ensure ghost emoji
        //add user that reacted to ghost list
        this.game.ghosts.push(user);

        //create player embed
        playerEmbed = createPlayerEmbed(this.game.players, this.game.ghosts,this.startEmbed);

        //update player list in message
        gameStartMessage.edit({ embeds: [playerEmbed] }); // end message edit
        } //end if ghost react
      } //end if user is not a bot
    });// end collector for adding

    //collector for removing players
    collector.on('remove', (reaction, user) => {

      if (this.game.collectionDone) collector.stop(); //if collection is done close collector 
      if (reaction.emoji.id === "902350295215005726") {//if wolf react
        //remove player that removed reaction from list
        this.game.players = this.game.players.filter(obj => obj.id !== user.id);

        //create player embed
        playerEmbed = createPlayerEmbed(this.game.players, this.game.ghosts, this.startEmbed);

        //update player list in message
        gameStartMessage.edit({ embeds: [playerEmbed] });
      }
       if(reaction.emoji.name === "👻") { //ensure ghost emoji
        //remove player that removed reaction from list
        this.game.ghosts = this.game.ghosts.filter(obj => obj.id !== user.id);

        //create player embed
        playerEmbed = createPlayerEmbed(this.game.players, this.game.ghosts,this.startEmbed);

        //update player list in message
        gameStartMessage.edit({ embeds: [playerEmbed] }); // end message edit
        } //end if ghost react
    });// removed reactions collector end
  }//end collect players

  //begins the werelupe rounds
  this.begin = function (gameStartMessage){
    this.game.collectionDone = true;

    //create a collector to check if game is ended probably
    //calculate roles
    //check if game already began??
    //this.listenForEnd(gameStartMessage);
    //Getting start time
    this.game.startTime = getTime(0);

    //Get the time when round ends
    this.game.nextRoundTime = getTime(this.game.roundTime);

    this.startEmbed.setDescription("Werelupe started at " + this.game.startTime + " NST"); // Game Title Field 
    this.startEmbed.setTitle("Werelupe!");//maybe add Game Title Field

    //edit start discord post 
    gameStartMessage.edit({ embeds: [this.startEmbed] });

    //need to turn or add this.game.players into an array of objects so when collecting the players set this.game.players.push(new p.Player(user)) this way I can assign roles and fields to the players 

    //calculate Roles

    //assign roles

    //send roles

    
    //send a post with the start time
    gameStartMessage.channel.send("Werelupe Starting with " + this.game.players.length + " players at " + this.game.startTime + " NST.\nAll roles have been sent! \nAll votes due by " + this.game.nextRoundTime + " NST."); //<-- break this up and sent the all roles do part with the round start.
    //make this pretty ^^ 
     console.log("game begins with " + this.game.players.length + " players");

    //while villager count is greater than wolves.. start rounds
    //this.startRound();
    //else end game
    


  }// end begin round
  
  this.startRound = function(){
    //round needs to last this.game.roundTime miutes
    //while waiting roundtimeminutes
    //listen for votes
    //wait roundtTime minutes
    //stop listening for votes
    //calculate and post post execution
    //update count
    //if villager count is greater than wolf count
    //while waiitng for night time minutes
    //listen for wolf votes if game.player.role.canSee /canVoteWolf / canProtect
    //listen for seer check and overnight roles (upon seer check reveal role)
    //listen for protector vote
    //wait nightTime minutes
    //stop listening for protector vote
    //stop listening for seer check and overnight roles
    //stop listening for wolf votes 
    //calculate and post kill
    //update count
    //this function will be called again
  };
  this.end = function(gameStartMessage){
    //some of this isn't needed since the bot will make a new object later
    gameStarted = false; //tell the bot the next game hasn't started
    this.game.endTime = getTime(0); //get end time

    //edit embed message
    this.startEmbed.setDescription("Werelupe ended at " + this.game.endTime + " NST\n Hope we can play again soon!");
    this.startEmbed.setTitle("Werelupe!");

    //edit start of the game main message
    gameStartMessage.edit({ embeds: [this.startEmbed] });
    
    gameStartMessage.channel.send("Werelupe ended at " + this.game.endTime + " NST.");
    
    console.log("Game Over")
  }

  this.listenForEnd = function(gameStartMessage) {
    //initialize collector
    let collector = gameStartMessage.createReactionCollector();

    //collect reactions for end game red button
    collector.on('collect', (reaction, user) => {
      if (reaction.emoji.name === "🔴" && user.id === this.gameOwner.id){ 
        this.end(gameStartMessage);//this is where the round ends
        collector.stop();
       } //close collector if collection is done
    });
  }


  }
}

//takes reference to players and orignal messageEmbed
function createPlayerEmbed(players, ghosts, messageEmbed) {
  //Reset Pretty List - used for displaying the text
  let prettyListPlayers = "";
  let prettyListGhosts = "";

  //make the list a nice list for players
  for (let i = 0; i < players.length; i++) {
    prettyListPlayers = prettyListPlayers + "@" + players[i].tag + "\n";
  }

  //make the list a nice list for ghosts
  for (let i = 0; i < ghosts.length; i++) {
    prettyListGhosts = prettyListGhosts+ "@" + ghosts[i].tag + "\n";
  }

  //check if players is not empty
  if (players.length > 0) {
    //set fields to players
    messageEmbed
    .setFields(
      {name: "Player List",value: prettyListPlayers}
      )
  }// end if players list is not empty

  //check if ghosts is empty
  if (ghosts.length > 0) {
    //set fields to ghosts
    messageEmbed
    .setFields(
      {name: "Ghost List",value: prettyListGhosts}
      )
  }// end if players list is not empty

  //check if the list of players and ghosts is empty and remove player from display if not
  if (players.length > 0 && ghosts.length > 0) {
    //set fields to players and ghosts
    messageEmbed
    .setFields(
      {name: "Player List",value: prettyListPlayers},
      {name: "Ghost List", value: prettyListGhosts}
      )
  }// end if prettyList is not empty

  //if boths list is empty reset the text
  if(players.length == 0 && ghosts.length == 0){
    messageEmbed.setFields(); //if there are no players set Fields to empty
  }//end else list is empty

  return messageEmbed;
}


//gets the time based on minutes to add
function getTime(minutesToAdd) {
  let time = "";
  var eastTime = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  var oldDateObj = new Date(eastTime);
  var d = new Date();
  d.setTime(oldDateObj.getTime() + (minutesToAdd * 60 * 1000));
  time = d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  return time;
}
module.exports = { GMBot }