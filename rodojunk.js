//  const filter = (reaction, user) => {
// //   //return user.id === m.author.id;
//  };
// m.awaitReactions().then(collected =>  collected.each(user => console.log(user.username)));
//               m.awaitReactions({filter, max:10,  time: 10000}).then(collection => {
// console.log("we made it here")
// //console.log(collection.first().users); // Collection of users
// console.log(collection.toJSON()); // Collection of users


//}).catch(console.error);
//}).catch(console.error);

//               //let werelupeID;
// msg.channel.fetchMessage();
// let collector = m.createReactionCollector();
// collector.on('collect', (reaction, user) => {
//   console.log("we made it here")
//   console.log('got a reaction from ' + user.tag);
// });

//global werelupe variables
let currentGame = false; //flag determining if there's a current game
var currentGameOwner; //variable the will hold the owner of this game
let gameStarted = false; //flag indicating if the game has started
var players = [];   //array for player list
let collectionDone = false; //flag for determining if player collection is done
let roundTime = 0;
let nightTime = 0;
var startTime;
var endTime;
var instructions;

//accepts User, RoundTime, and nightTime, and Instructions
function initializeGame(user, rt, nt, inst) {
  //Initialize Variables

  currentGame = true;
  currentGameOwner = user;
  collectionDone = false;
  roundTime = rt;
  nightTime = nt;
  instructions = inst;

  //Send Instructions to Starter
  currentGameOwner.send(instructions);
}

//starts a Werelupe Game
function startAWerelupeGame(message) {

  if (!currentGame) {
    let werelupeEmbed = new MessageEmbed();
    werelupeEmbed.setTitle("So you wanna play Werelupe?");
    werelupeEmbed.setDescription("React to join");
    message.channel.send({ embeds: [werelupeEmbed] }).then(m => {
      m.react("902350295215005726");
      game(m, message.author, werelupeEmbed);
    });
  }

  else {
    let werelupeEmbed = new MessageEmbed();
    werelupeEmbed.setDescription("Sorry " + message.author.toString() + ", but " + currentGameOwner.toString() + " already started a game! You should join that one!");
    message.channel.send({ embeds: [werelupeEmbed] });
  }
}

//takes reference to players and orignal messageEmbed
function createPlayerEmbed(players, messageEmbed) {
  //Reset Pretty List - used for displaying the text
  let prettyList = "";

  //make the list a nice list
  for (let i = 0; i < players.length; i++) {
    prettyList = prettyList + "@" + players[i].tag + "\n";
  }

  //check if the list of players is empty and remove player from display if not
  if (players.length > 0) {
    //set fields to players
    messageEmbed.setFields({
      name: "Player List",
      value: prettyList
    })
  }// end if prettyList is not empty

  //if player list is empty reset the text
  else {
    messageEmbed.setFields(); //if there are no players set Fields to empty
  }//end else list is empty

  return messageEmbed;
}

function startGame(gameStartMessage, messageEmbed) {
  if (!gameStarted) {
    collectionDone = true;
    gameStarted = true;

    //Getting start time
    startTime = getTime(0);

    //Get the time when round ends
    nextRoundTime = getTime(roundTime);

  }//end if game started
}

function endGame(gameStartMessage, messageEmbed) {
  currentGameOwner = " ";
  currentGame = false;
  collectionDone = false;
  gameStarted = false;
  endTime = getTime(0);
  players = [];
}
//The main game function
//takes in the start message of the game and the user that started the game
function game(gameStartMessage, gameStarter, messageEmbed) {

  //initialize game with round time and night time and instructions
  initializeGame(gameStarter, 20, 10, "**Werelupe Instructions!**");

  //initialize collector
  let collector = gameStartMessage.createReactionCollector({ dispose: true });

  //collect reactions for sign ups
  collector.on('collect', (reaction, user) => {

    if (collectionDone) return //close collector if collection is done
    if (!user.bot) { //ensure reactor is not a bot
      //add user that reacted to player list
      players.push(user);

      //create player embed
      playerEmbed = createPlayerEmbed(players, messageEmbed);

      //update player list in message
      gameStartMessage.edit({ embeds: [playerEmbed] }); // end message edit
    } //end if user is not a bot
  });// end collector for adding

  //collector for removing players
  collector.on('remove', (reaction, user) => {

    if (collectionDone) return //if collection is done close collector 
    //remove player that removed reaction from list
    players = players.filter(obj => obj.id !== user.id);

    //create player embed
    playerEmbed = createPlayerEmbed(players, messageEmbed);

    //update player list in message
    gameStartMessage.edit({ embeds: [playerEmbed] });
  });// removed reactions collector end

  //check for game creater messages
  client.on("messageCreate", (message) => {

    if (message.author.id === currentGameOwner.id) {//ensure it's only the game owner messaging
      //wl.players checks how many players in game

      if (message.content === "wl.players") {
        message.channel.send("This game has " + players.length + " players");
      }
      //command for starting Game
      if (message.content === "wl.start") {
        if (!gameStarted) {
          startGame(gameStartMessage, messageEmbed);

          //edit embed message
          messageEmbed.setDescription("Werelupe started at " + startTime + " NST");
          messageEmbed.setTitle("Werelupe!");
          //edit start discord post 
          gameStartMessage.edit({ embeds: [messageEmbed] });
          //send message to channel stating game has started
          message.channel.send("Werelupe Starting with " + players.length + " players at " + startTime + " NST.\nAll roles have been sent! \nAll votes due by " + nextRoundTime + " NST.");
        }
        else {
          console.log("game started is " + gameStarted);
          message.channel.send("There is already an ongoing game!");
          return;
        }
      }
      //command for GM to End Game
      if (message.content === "wl.end") {
        endGame(gameStartMessage, messageEmbed);
        console.log("upon gameEnd function gs is " + gameStarted);
        //edit embed message
        messageEmbed.setDescription("Werelupe ended at " + endTime + " NST\n Hope we can play again soon!");
        messageEmbed.setTitle("Werelupe!");

        //edit start of the game main message
        gameStartMessage.edit({ embeds: [messageEmbed] });

        //send message to channel stating game has ended
        message.channel.send("Werelupe ended at " + endTime + " NST.");
        return;
      }
    }//end if gm sent message
    else {
      if (currentGame) {
        if (message.content.toLowerCase().indexOf("wl.") >= 0) {
          let notGMEmbed = new MessageEmbed();
          notGMEmbed.setDescription("Sorry " + message.author.toString() + ", but " + currentGameOwner.toString() + " started the game and is only one that can send commands for it! You should join though!");
          message.channel.send({ embeds: [notGMEmbed] });
        }
      }
    }
  })

} //End Werelupe Start Game Function

function getTime(minutesToAdd) {
  let time = "";
  var eastTime = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  var oldDateObj = new Date(eastTime);
  var d = new Date();
  d.setTime(oldDateObj.getTime() + (minutesToAdd * 60 * 1000));
  time = d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  return time;
}
//Starts werelupe game
//takes in the start message of the game and the user that started the game
function startWerelupe(gameStartMessage, gameStarter) {

  //Needed Variables
  let players = [];   //array for player list
  let collectionDone = false; //flag for determining if player collection is done

  //Send the Starter Instructions
  gameStarter.send("**Werelupe Instructions!**")
  //Collect Reactions
  //filter the reaction collector to only wolf emojis and not bots
  //not working at the moment
  // const filter = (reaction, user) => {
  //   return reaction.emoji.name === "wolfdance" && !user.bot;
  // };

  //Here is where I would put (filter, {dispose:true}) 
  //Dispose is required for removal logging

  let collector = gameStartMessage.createReactionCollector({ dispose: true });


  collector.on('collect', (reaction, user) => {
    // //debugging
    //   console.log('got a ' + reaction.emoji.name + ' reaction from ' + user.tag + " " + user.username);

    if (!user.bot) {
      //add user that reacted to player list
      players.push(user);

      //Reset Pretty List
      let prettyList = "";

      //
      for (let i = 0; i < players.length; i++) {
        prettyList = prettyList + "@" + players[i].tag + "\n";
      }

      // //debugging
      // console.log(players.toString());
      // console.log(prettyList);
      gameStartMessage.edit({
        embeds: [
          {
            title: "So you wanna play Werelupe?",
            //description: "Say \"Play Werelupe\" to join"
            description: "React to join",
            fields: [
              {
                name: "Player List",
                value: prettyList
              }
            ]
          }
        ]
      }); // end edit
    } //end if user is not a bot


  });// end collector for adding

  //collector for removing players
  collector.on('remove', (reaction, user) => {

    console.log("removals")
    console.log('Removed ' + reaction.emoji.name + ' reaction from ' + user.tag);

    //remove player that removed reaction from list
    players = players.filter(obj => obj.id !== user.id);
    console.log(players.toString());
    //Reset Pretty List
    let prettyList = "";

    //
    for (let i = 0; i < players.length; i++) {
      prettyList = prettyList + "@" + players[i].tag + "\n";
    }

    console.log(players.toString());

    //check if the list of players is empty and remove player from display if so
    if (players.length > 0) {
      console.log(prettyList);
      gameStartMessage.edit({
        embeds: [
          {
            title: "So you wanna play Werelupe?",
            //description: "Say \"Play Werelupe\" to join"
            description: "React to join",
            fields: [
              {
                name: "Player List",
                value: prettyList
              }
            ]
          }
        ]
      }); //end edit
    }// end if prettyList is not empty

    //if empty reset the text
    else {
      gameStartMessage.edit({
        embeds: [
          {
            title: "So you wanna play Werelupe?",
            //description: "Say \"Play Werelupe\" to join" //alternate entry method
            description: "React to join"

          }
        ]
      })
    }

  });// removed reactions collector end

  if (collectionDone) collector.stop();

  client.on("messageCreate", (message) => {
    if (message.author.id === gameStarter.id && message.content === "wl.start") {
      message.channel.send("This game has " + players.length + " players");
    }
  })

} //End Werelupe Start Game Function

// //To DO
// //function to collect players and update start game message to each game
// function collectPlayers(gameStartMessage, players){ 

//   }//end player collection function


// else {
//   gameStartMessage.channel.send("Sorry! " + user.toString() + " this game isn't taking any more players!");
// }



{
  title: "So you wanna play Werelupe?",
    //description: "Say \"Play Werelupe\" to join"
    description: "React to join",
      fields: [
        {
          name: "Player List",
          value: prettyList
        }
      ]
}


              else {
  if (currentGame) {
    if (message.content.toLowerCase().indexOf("wl.") >= 0) {
      let notGMEmbed = new MessageEmbed();
      notGMEmbed.setDescription("Sorry " + message.author.toString() + ", but " + currentGameOwner.toString() + " started the game and is only one that can send commands for it! You should join though!");
      message.channel.send({ embeds: [notGMEmbed] });
    }
    else {
      let notGMEmbed = new MessageEmbed();
      notGMEmbed.setDescription("Sorry " + message.author.toString() + ", but there needs to be an active game so that I can accept commands for it! You should crete one though!")
      message.channel.send({ embeds: [notGMEmbed] });

    }
  }
}



let currentGame2 = false;
//New Create Game func
function createGame(em, m, user) {
  if (currentGame2){
    console.log("there's a game already");
    return;
  }
  if (!currentGame2) {
    currentGame2 = true;
    wGame = new werelupe.Game(em, m, user, 20, 10, "Instructions");
    wGame.collectPlayers();
    client.on("messageCreate", (message) => {
      if (message.content === "$ros") {
        wGame.start()
        
      }

      if (message.content === "$rend") {
        wGame.end()
        message.channel.send("Werelupe ended at " + wGame.endTime + " NST.");
        wGame = " "//on the second game end this breaks it^^
        currentGame2 = false;
        return;
      }
    });
  }
}

function createGame2(message){
  game2 = new werelupe.Game(message,20,10, "Instructions");
  console.log(game2.random);
}
