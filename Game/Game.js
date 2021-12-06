function Game(gameOwner, rt, nt, instructions) {
  this.initialized= true; //flag determining if the game is initialized
  this.collectionDone = false; //flag for determining if player collection is done
  this.gameStarted = false; //flag indicating if the game has started
  this.gameEnded = false; //flag determining if the game has ended
  this.gameMaster = gameOwner; //variable the will hold the owner of this game

  this.players = [];   //array for player list //players needs tp be an array of objects
  this.ghosts = []; //array for ghost
  this.playerCap;
  this.numWolves;
  this.numVillagers;
  this.roundTime = rt;
  this.nightTime = nt;
  //this.remainingRounds;
  this.startTime;
  this.endTime;
  this.nextRoundTime;
  this.instructions = instructions;

  this.calcRoles = function(){
    this.numWolves = Math.ceil(players.length/4);
    this.numVillagers = players.length-numWolves;
  }

  this.reset = function(){
    this.initialized= true; //flag determining if the game is initialized
    this.collectionDone = false; //flag for determining if player collection is done
    this.gameStarted = false; //flag indicating if the game has started
    this.gameEnded = false; //flag determining if the game has ended
    this.gameMaster = gameOwner; //variable the will hold the owner of this game

    this.players = [];   //array for player list
    this.ghosts = []; //array for ghost
    this.playerCap;
    this.numWolves;
    this.numVillagers;
    this.roundTime = rt;
    this.nightTime = nt;
    this.startTime;
    this.endTime;
    this.nextRoundTime;
    this.instructions = instructions;
  }
}

module.exports = { Game }