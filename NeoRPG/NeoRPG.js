//RodoYolo 2022
const neoList = require('./Neopets.json');
const itemList = require('./Items.json');
//const help = require('./Help.json');
const Database= require("@replit/database")
//const petList = require('./PetList.json'); //in case to use JSON Instead of Replit DB

//import fetch functionality from node
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

//import message embed functionality from node
const { MessageEmbed } = require('discord.js');

const db = new Database("https://kv.replit.com/v0/eyJhbGciOiJIUzUxMiIsImlzcyI6ImNvbm1hbiIsImtpZCI6InByb2Q6MSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjb25tYW4iLCJleHAiOjE2NDYzOTA3ODEsImlhdCI6MTY0NjI3OTE4MSwiZGF0YWJhc2VfaWQiOiJkMzZkMzVkOC02OGQyLTQyMWUtYTZmMy05M2M5OTcxNTNkM2MifQ.LjjZLBF2IWEIYwhGaPzICuBpBhAE9NFUPJnyzS7XLe6oX7L6PCvo2_ihhG4GsK5iAZQAp7Y1eDyzO90kYJZQrw");

//declare constants
const MAX_HUNGER = 11;
const MAX_HAPPINESS = 9;
const NAME_REGEX = /^[A-Za-z0-9_-]+$/;
const FEED_COST = 20;
const POUND = "pound";
const SHH_INTERVAL = 5;
const ZAP_INTERVAL = 60;
const RANDOM_RARITY = 10;

//constructor
function NeoRPG() {

  // //Creating / Emptying the Pound
  // this.test = async function(message){
  //   await db.delete("Pound"); //delete user and their info
  //   //creating the pound
  //   pound = {"np": 0, "pets": [], "totalPets": 0, "maxPets": Number.MAX_SAFE_INTEGER, "activePet": -1, "labAccess": false, "ownerTag": "In the **Pound**", "id": "pound"};
  //   await db.set("pound", pound);
  //   console.log("Pound Cleared/Created");
  // }

 // // Rodo Test Stuff 
 //  this.test = async function(message){
 //    //add boochie shield soon
 //    userList = await db.list()
 //    petChosen = "Milo"
 //    userChosen = "marsw#0003"
 //    //traverse the db for all users
 //    for(let i =0;i<userList.length;i++){
 //      user = await db.get(userList[i]); //get user
 //      user.inventory = [];
 //      if(user.ownerTag.toLowerCase() === userChosen.toLowerCase()){
 //        //user.maxPets = 3; //adjusts specific user stats
 //        //user.np = 10000;
 //        user.labAccess = true;
 //      }
      
 //      for(let j=0;j<user.pets.length;j++){ //look at users pets
 //          //user.pets[j].mood = 0;//set hp to 10 //this adjusts all pets
 //          //user.pets[j].hunger = 0;//set every pet to max hunger to 10 //this adjusts all pets
 //          //user.pets[j].level = 1;
        
 //          //adjusts one specific pet - pet Chosen
 //          if(user.pets[j].name.toLowerCase() === petChosen.toLowerCase()){
 //            user.pets[j].species = "Kougra";
 //            user.pets[j].color = "Baby";
 //            user.pets[j].gender = "Male";
 //          }
 //      }
 //      await db.set(user.id, user);
 //    }
 //    console.log("Done");
 //  }
  this.test = async function(message){
    console.log(process.env.REPLIT_DB_URL)
  }
  //join NeoRPG takes in user information
  this.join = async function(user){
    
    //retrieve the user.id
    value = await db.get(user.id)
    
    let embed = new MessageEmbed(); //create a new message embed
    
    if(value){ //if there is a value this mean the user already joined
      caption = `You already joined NeoRPG!`;
      embed.setTitle(caption);
      embed.setDescription("");
      return embed;
    } 
    else{
      //add the user with 
      //user id as database key
      //0 np
      //0 pets
      //1 max pet
      //no active pet
      //user id and ownerTag
      member = {"np": 0, "pets": [], "totalPets": 0, "maxPets": 2, "activePet": -1, "inventory":[], "labAccess": false, "ownerTag": user.tag, "id": user.id};
      await db.set(user.id, member);
      caption = `Welcome to NeoRPG!`;
      
      embed = getUserEmbed(member, "Welcome to NeoRPG!");
      return embed;
    }
  }

  //Quit Neo RPG
  this.quit = async function(user){
    value = await db.get(user.id)//get user from key
    let embed = new MessageEmbed(); //create a new message embed
      if(value){ //if there is a user in database
        await db.delete(user.id); //delete user and their info
        embed.setTitle("You quit NeoRPG. Thanks for playing!");
        embed.setDescription("");
        return embed
      } 
      else{
        //if no user respond with message saying this:
        embed.setTitle("Umm...you can't quit NeoRPG if you aren't playing.");
        embed.setDescription("");
        return embed
      }
  }

  //uses the input from the slash function to create a random basic pet
  this.create = async function(user, petName){ //async function that takes in the user profile and pet name from slash command
    value = await db.get(user.id) //get the user id from the user
    let embed = new MessageEmbed(); //create a new message embed
      if(value){ //if the database returned a value
        //user is in database
        //probably should check that the name meets regular input guidelines here
        if(!NAME_REGEX.test(petName)){
          embed.setTitle(`Sorry the name ${petName}  is not a valid name :(`);
          embed.setDescription("");
          return embed;
        }
        //check the provided pet name to see if it is already in the DataBase
        nameFree = await this.isNameFree(petName); 
        
        //if name is not free
        if(!nameFree){
          //return an embed saying the neopet cannot be created 
          embed.setTitle(`Sorry the name ${petName}  is taken :(`);
          embed.setDescription("");
          return embed;
        }
        //if the user reached max pets
        if(value.totalPets >= value.maxPets){
          //set the embed caption to
          caption = `You already have the Maximum Pets (${value.maxPets}) including your active pet:\n${value.pets[value.activePet].name} the ${value.pets[value.activePet].color} ${value.pets[value.activePet].species}!`
          embed = getPetEmbed(value.pets[value.activePet], caption);
          embed.setTitle(caption);
          embed.setDescription("");
          return embed;
        }//end if reached maxed pet
          
        else{ //user has space for a pet
          //create a new pet object with 
          // name - user provided name
          // species - random basic species
          // color - a random basic color
          // strength, defense, movement, - start at 1
          // hunger at 0 
          // roll gender - male or female
          // owner information - discord id and tag

          //roll gender
          randomGen = getRandomInt(2)
          gender = ""
          if(randomGen == 0) gender = "Female";
          if(randomGen == 1) gender = "Male";
          
          //set pet object
          pet = {"name": petName, "species": neoList.regularSpecies[getRandomInt(neoList.regularSpecies.length)], "color": neoList.basicColor[getRandomInt(neoList.basicColor.length)], "level": 1, "strength": 1, "defense": 1, "hp":10, "maxhp": 10, "movement": 1, "hunger": 0, "gender": gender, "mood": 0,"owner": user.id, "ownerTag": user.tag}
          //insert pet to the value - the key response in the database
          value.pets[value.totalPets] = pet;
          value.totalPets++;
          ///set active pet to this newly created pet
          activeIndex = value.pets.findIndex(x => x.name === petName);
          value.activePet = activeIndex;
          //set the database to add this new pet
          db.set(user.id, value).then(() => {});
          //get the embed of this pet with the caption below
          embed = getPetEmbed(pet, "Look at this beautiful new pet!");
          return embed;
        }
      } 
      else{ //the user has not joined neoRPG
        embed.setTitle("You can't adopt if you haven't joined NeoRPG!");
        embed.setDescription("");
        return embed;
    }
  }

  //adopt a pet from the pound
  this.adopt = async function(user,petName){
    value = await db.get(user.id);
    let embed = new MessageEmbed();

    //start most functions with checking if the player is playing
    if(!value){
      embed.setTitle("You can't adopt a pet if you haven't joined NeoRPG!");
      embed.setDescription("");
      return embed;
    }
    
    //check that the player has slots for the pet
    if(value.totalPets == value.maxPets){
      let caption = `You already have the Maximum Pets (${value.maxPets}) including your active pet:\n${value.pets[value.activePet].name} the ${value.pets[value.activePet].color} ${value.pets[value.activePet].species}!`;
      
      //this below can be reduces to get petURL lol but I borrowed from reused code yolo
      embed = getPetEmbed(value.pets[value.activePet], caption);
      embed.setTitle(caption);
      embed.setDescription("");
      return embed;
    }
    
    //retrieve the pound user
    poundUser = await db.get(POUND);
    //check if the pet is in the pound
    adoptIndex = poundUser.pets.findIndex(x => x.name.toLowerCase() === petName.toLowerCase());
    if(adoptIndex < 0){
      embed.setTitle(`Sorry, ${petName} is not in the pound :(`);
      embed.setDescription("");
      return embed;
    }
    //remove the adopted pet from the pound
    adoptedPet = poundUser.pets.splice(adoptIndex, 1); // 2nd parameter means remove one item only
    //change owner information
    console.log(adoptedPet)
    console.log(adoptedPet[0]);
    adoptedPet[0].owner = value.id;
    adoptedPet[0].ownerTag = value.tag;
    //set the changes to the pound
    await db.set(POUND, poundUser);
    //push the adopted pet to the user
    value.pets.push(adoptedPet[0]);
    //set the adopted pet changes to the user
    await db.set(user.id, value);
    //set active pet to the newly adopted pet
    await this.setActive(user, adoptedPet[0].name);
    //return success embed 
    embed = getPetEmbed(adoptedPet[0], "Thank you for adopting me! 🥺");
    return embed;
  }//end adopt function

  //abandon the specified pet
  this.abandon = async function(user, petName){
    value = await db.get(user.id);
    let embed = new MessageEmbed();

    //start most functions with checking if the player is playing
    if(!value){
      embed.setTitle("You can't abandon a pet if you haven't joined NeoRPG!");
      embed.setDescription("");
      return embed;
    }
    //check if the player even has pets
    if(value.totalPets <= 0){
      embed.setTitle("You have no pets to abandon!");
      embed.setDescription("");
      return embed
    }
    //check if the user has np to adopt
    //ToDo
    //check that the pet is owned
    //find this pet
    abandonIndex = value.pets.findIndex(x => x.name.toLowerCase() === petName.toLowerCase());
    //if no index is returned then the user does not own this pet 
    if(abandonIndex < 0){
      embed.setTitle("You don't own " + petName + " - so you can't abandon them :(");
      embed.setDescription("");
      return embed
    }
    //if we made it here..the user is playing, has pets, and owns the pet they wish to abandon, 
    //declare a temporary variable to store the abandoned pet
    let sadPet = {};
    //check if the user has an active pet
    //if they have an active pet, there will need to be some adjustments when the pet is abandoned
    //case 1 the pet that is being abandoned is the active pet or the user has no active pets
    if(abandonIndex === value.activePet || value.activePet < 0){
      //set the active pet to -1 (No Active) Either way the user will end up with no active pet
      value.activePet = -1;
      //find the pet to be abandoned and hold the pet info
      //remove the pet from the pets array and store it as sadPet
      sadPet = value.pets.splice(abandonIndex, 1); // 2nd parameter means remove one item only
      //value no longer has the abandoned pet
      
    }//end if abandoned pet is the active
    //else the abandoned pet is not the active pet
    else{
      let oldActivePetName = value.pets[value.activePet].name;
      //remove the pet from the pets array and store it as sadPet
      sadPet = value.pets.splice(abandonIndex, 1); // 2nd parameter means remove one item only
      //value no longer has the abandoned pet
      //reset active pet after removing
      await this.setActive(user, oldActivePetName)
    }
    //put the pet in the pound
    //change the owner of the pet to Pound
    sadPet[0].owner = "pound";
    sadPet[0].ownerTag = "In the **Pound**";
    poundUser = await db.get(POUND);
    poundUser.pets.push(sadPet[0]);
    await db.set(POUND, poundUser);
    //subtract one from the owners total pets
    value.totalPets--; 
    //set the user's pets with the adjustments
    console.log(value.pets)
    await db.set(user.id, value);
    //return the succesfully completed embed
    embed.setTitle("You abandoned " + petName + " :(");
    embed.setImage(getSadPetURL(sadPet[0]));
    embed.setDescription("");
    return embed
  }//end abandon function

  //shows you the pet you search for
   this.view = async function(user, petName){
     //initialize embed
      let embed = new MessageEmbed();
     //first get all the keys in the database
      if(!NAME_REGEX.test(petName)){
        embed.setTitle(`Sorry the name ${petName} is not a valid name :(`);
        embed.setDescription("");
        return embed;
      }
      userList = await db.list()
      //traverse the db for all users
      for(let i =0;i<userList.length;i++){
        user = await db.get(userList[i]); //get user
        for(let j=0;j<user.pets.length;j++){ //look at users pets
            if(user.pets[j].name.toLowerCase() === petName.toLowerCase()) return getPetEmbed(user.pets[j],"What a beautiful pet!");             //if pets name matches return the embed for that pet
        }
      }
          embed.setTitle(`${petName} does not exist...yet`);
          embed.setDescription("");
          return embed;
    } 

  //shows you pets in the pound
   this.pound = async function(user){
      value = await db.get(user.id);
     //initialize embed
      let embed = new MessageEmbed();
      //start most functions with checking if the player is playing
      if(!value){
        embed.setTitle("You can't view the pound if you haven't joined NeoRPG!");
        embed.setDescription("");
        return embed;
      }
      //grab the pound user
      poundUser = await db.get(POUND);
     //case 1 pound has no pets
     if(poundUser.pets.length == 0){
       embed.setTitle(`There are no pets in the pound! <3`);
       embed.setDescription("");
       return embed;
     }
    //case 2 pound has one pet
     else if(poundUser.pets.length == 1){
       embed.setTitle(`**${poundUser.pets[0].name}** is the only pet in the pound and they need a new home!`);
       embed.setDescription("");
       embed.setImage(getSadPetURL(poundUser.pets[0]));
       return embed;
     }
      //case 3 pound has 2 pets
     else if(poundUser.pets.length == 2){
       let randomPet = getRandomInt(poundUser.pets.length);
      embed.setTitle(`**${poundUser.pets[randomPet].name}** needs a new home!`);
      adjacentPetIndex = (randomPet + 1) % poundUser.pets.length
      embed.setDescription(`You should also consider adopting:\n**${poundUser.pets[adjacentPetIndex].name}** the ${poundUser.pets[adjacentPetIndex].color} ${poundUser.pets[adjacentPetIndex].species}`);
      embed.setImage(getSadPetURL(poundUser.pets[randomPet]));
      return embed;
     }
     else{
       let randomPet = getRandomInt(poundUser.pets.length);
      embed.setTitle(`**${poundUser.pets[randomPet].name}** needs a new home!`);
      adjacentPetIndex = (randomPet + 1) % poundUser.pets.length
      adjacentPetIndex2 = (randomPet + 2) % poundUser.pets.length
      embed.setDescription(`You should also consider adopting:\n**${poundUser.pets[adjacentPetIndex].name}** the ${poundUser.pets[adjacentPetIndex].color} ${poundUser.pets[adjacentPetIndex].species} or \n**${poundUser.pets[adjacentPetIndex2].name}** the ${poundUser.pets[adjacentPetIndex2].color} ${poundUser.pets[adjacentPetIndex2].species}  `);
      embed.setImage(getSadPetURL(poundUser.pets[randomPet]));
      return embed;
     }
  }

   //provides you with help with NeoRPG
   this.help = async function(){
     //initialize embed
      let embed = new MessageEmbed();
      embed.setTitle(`NeoRPG Help`);
      embed.setDescription("\*\*Thanks for playing NeoRPG! Here are some helpful tips:\*\*\n\n `/join` - use this to join NeoRPG\n `/create` - use this to create a Neopet\n `/adopt` - use this to adopt a pet from the Neopian Pound\n `/setactive` - use this to set your active Neopet\n `/abandon` - use this to abandon a Neopet\n `/pound` - use this to view the Neopian Pound\n `/view` - use this to view the pet profile of the specified pet\n `/getstats` - use this to view a user profile\n `/feed` - use this to feed one of your Neopets\n `/zap` - use this to zap a Neopet\n `/shh` - use this receive a random event\n `/inventory` - use this to view your inventory\n `/paint` - use this to paint a pet if you have the Paint Brush\n `/quit` - use this to quit NeoRPG and give up all your progress\n `/help` - use this to get a list of commands and help with NeoRPG");
      return embed;
    } 
  
  //set active pet
   this.setActive = async function(user, petName){
     //get user
     userToSetActive = await db.get(user.id);
     //get a new embed
      let embed = new MessageEmbed();
     ///if the user exists in the database
      if(userToSetActive){
        //if the user even has pets
        if(userToSetActive.totalPets >= 0){
          //ensure this pet is owned
          newActiveIndex = userToSetActive.pets.findIndex(x => x.name === petName);
          //if the pet at the active index exists
          if(userToSetActive.pets[newActiveIndex]){//probably not necessary
            userToSetActive.activePet = newActiveIndex;
            await db.set(user.id, userToSetActive);
            return getPetEmbed(userToSetActive.pets[newActiveIndex], `I'm so happy we'll be playing together now!`);
            }
          else{
            embed.setTitle("You don't own " + petName + " - so you can't set them as your active pet :(");
            embed.setDescription("");
            return embed
          }
        }  
        else{
          embed.setTitle("You have no pets to set as active! Adopt one using /adopt or create one using /create");
          embed.setDescription("");
          return embed
        }
      } 
      else{
        embed.setTitle("You can't set an active pet if you haven't joined NeoRPG!");
        embed.setDescription("");
        return embed;
      } 
    }
    
  //feed the pet searched for 
   this.feed = async function(user, petName){
     value = await db.get(user.id);
      let embed = new MessageEmbed();
      if(value){
        if(value.totalPets > 0){
          //ensure this pet is owned
          feedMeIndex = value.pets.findIndex(x => x.name.toLowerCase() === petName.toLowerCase());
          if(value.pets[feedMeIndex]){
            if(value.pets[feedMeIndex].hunger < MAX_HUNGER){
            value.pets[feedMeIndex].hunger++;
            //To Do Check NP or Inventory
            if(value.np < FEED_COST){
               embed.setTitle(`Sorry you do not have enough Neopoints to Feed Your Pet!\nCost: ${FEED_COST}\nYour NP:${value.np}`);
              embed.setDescription("");
              return embed
            }
            value.np = value.np - 20;
            await db.set(user.id, value);
            return getPetEmbed(value.pets[feedMeIndex], `Thank you for feeding me!`);
            }
            else{
              return getPetEmbed(value.pets[feedMeIndex], `I can't eat anymore - I'm so full!`);
            }
            
          }
          else{
            embed.setTitle("You don't own " + petName + " - so you can't feed them :(");
            embed.setDescription("");
            return embed
          }
        }  
        else{
          embed.setTitle("You have no pets to feed! Adopt one using /adopt");
          embed.setDescription("");
          return embed
        }
      } 
      else{
        embed.setTitle("You can't feed a pet if you haven't joined NeoRPG!");
        embed.setDescription("");
        return embed;
      } 
    }

  //get User stats, like NP, Pet List, ETC
  this.getStats= async function(user){
    value = await db.get(user.id)
      if(value){//if a value is in the db = then show stats
        return getUserEmbed(value)
      }
      else{
        let embed = new MessageEmbed();
        embed.setTitle("This user isn't playing NeoRPG so you can't see their stats... use /join to join");
        embed.setDescription("");
        return embed;
      }
  }

  //view inventory
  this.inventory= async function(user){
    value = await db.get(user.id)
      if(value){//if a value is in the db = then show stats
        return getInventoryEmbed(value);
      }
      else{
        let embed = new MessageEmbed();
        embed.setTitle("You can't see your inventory cause you aren't playing NeoRPG.. use /join to join");
        embed.setDescription("");
        return embed;
      }
  }

  //random events
  this.randomEvent = async function(user){
    //retrieve user
    value = await db.get(user.id);
    //initialize embed
    let embed = new MessageEmbed();
    
    //check that the user is playing
    if(!value){
      embed.setTitle("You can't have a random event a pet if you haven't joined NeoRPG!");
      embed.setDescription("");
      return embed;
    } 
    //Date and Time blocks are here
    //get today's time
    var today = new Date();
    //if there is a value for last SHH (AKA The User got an SHH Before)
    if(value.lastSHH){
      //calcuate time remaining
      const timeRemaining = dateDiffInMinutes(value.lastSHH, today)
      //if more than designated minutes reset the last shh value
      if(timeRemaining >=SHH_INTERVAL){
        value.lastSHH = today;
      }
      //otherwise tell the user it is too soon
      else{
        embed.setTitle("Too Soon");
        embed.setDescription(`You can get your next random event in ${SHH_INTERVAL-timeRemaining} minutes.`);
        return embed;
      }
    }
    //if never received a SHH set the value to now
    else{
      value.lastSHH = today;
    }
    //update the datebase
    await db.set(user.id, value);
    //Date and Time blocks finish here

    //Get a random event equal to SSH Count
    let rareRandom = getRandomInt(RANDOM_RARITY); 
    //rareRandom = 0; //for testing rare events
    
    //randoms that require an active pet
    if(rareRandom==0){//if rare random is exactly 0 then get a random event from this list
      let random = getRandomInt(5);
      //Boochi
      if(random == 0){
        //check for an active pet
        if(value.activePet < 0) return nothingSHH();
       //check baby is an avaialble color
       isAvail = await this.isPetColorAvailable("Baby",value.pets[value.activePet].species); 
        if(isAvail){
          await this.paintPet(user, "Baby", value.activePet)
          embed.setTitle("Something Has Happened");
          embed.setDescription(`${value.pets[value.activePet].name} has been zapped by Boochi!`);   embed.setImage("https://static.wikia.nocookie.net/guilds/images/5/52/BOOCHI.png/revision/latest/scale-to-width-down/246?cb=20160709191118");
          return embed;
        }
        else{
         embed.setTitle("Something Has Happened");
        embed.setDescription(`Boochi takes aim at ${value.pets[value.activePet].name} but thankfully he misses!`);   embed.setImage("https://static.wikia.nocookie.net/guilds/images/5/52/BOOCHI.png/revision/latest/scale-to-width-down/246?cb=20160709191118");
        return embed;
        }
      }
      //fairy fountain water
      if(random==1){
        //check for an active pet
        if(value.activePet < 0) return nothingSHH();
        //asume the color is not available
        let isAvail = false;
        //init newColor
        let newColor = "";
       //while it's not available try a color until one works
        while(!isAvail){
          //generate a random color for this random event
          newColor = generateColor();
          //check this color is an avaialble color
          isAvail = await this.isPetColorAvailable(newColor, value.pets[value.activePet].species);
        }
        await this.paintPet(user, newColor, value.activePet)
        embed.setTitle("Something Has Happened");
        embed.setDescription(`${value.pets[value.activePet].name} got drenched in Rainbow Fountain Water and changed color to ${newColor}`);   
        embed.setImage("https://items.jellyneo.net/assets/imgs/neodeck-images/340.gif");
        return embed;
      }
      //lab access 
      if(random==2){
        //if user already has lab access do a boochi miss lol
        if(value.labAccess){
          embed.setTitle("Something Has Happened");
          embed.setDescription(`Boochi takes aim at ${value.pets[value.activePet].name} but thankfully he misses!`);   embed.setImage("https://static.wikia.nocookie.net/guilds/images/5/52/BOOCHI.png/revision/latest/scale-to-width-down/246?cb=20160709191118");
          return embed;
        }
        //otherwise this code executes
        await this.grantLabAccess(user);
        embed.setTitle("Something Has Happened");
        embed.setDescription(`You now have access to the Secret Lab Ray..`); embed.setImage("https://images.neopets.com/games/betterthanyou/contestant441.gif");
        return embed
      }
      //pet Slot Increase 
      if(random==3){
        //increment maxPets
        value.maxPets++
        //adjust dp
        await db.set(user.id, value);
        embed.setTitle("Something Has Happened");
        embed.setDescription(`You gained another Pet Slot!`);
        embed.setImage("https://neopetsclassic.com/images/items/pet_token.gif");
        return embed
      }
      //Random PB
      if(random==4){
        let randomPB = getRandomInt(itemList.pbs.length);
        value.inventory.push(itemList.pbs[randomPB]);
        //adjust db
        await db.set(user.id, value);
        embed.setTitle("Something Has Happened");
        embed.setDescription(`Jacko the Phantom Painter has dropped a ${itemList.pbs[randomPB].name} in your pocket`);
        embed.setImage(itemList.pbs[randomPB].url);
        return embed;
      }
    }
    else{
      //regular randoms
      let random = getRandomInt(9);
      //add NP
      if(random==0){
        await this.addNP(user, 50);
        embed.setTitle("Something Has Happened");
        embed.setDescription(`You found 50 NPs on the floor!`);
  embed.setImage("https://images.neopets.com/randomevents/images/neopoint_bag.png");
        return embed;
      }
      //add NP
      if(random==1){
        await this.addNP(user, 10);
        embed.setTitle("Something Has Happened");
        embed.setDescription(`You found 10 NPs on the floor!`);
  embed.setImage("https://images.neopets.com/randomevents/images/neopoint_bag.png");
        return embed;
      }
      //add NP
      if(random==2){
        await this.addNP(user, 100);
        embed.setTitle("Something Has Happened");
        embed.setDescription(`You found 100 NPs on the floor!`);
  embed.setImage("https://images.neopets.com/randomevents/images/neopoint_bag.png");
        return embed;
      }
      //add NP
      if(random==3){
        await this.addNP(user, 1000);
        embed.setTitle("Something Has Happened");
        embed.setDescription(`You found 1000 NPs on the floor!`);
  embed.setImage("https://images.neopets.com/randomevents/images/neopoint_bag.png");
        return embed;
      }
      //add NP
      if(random==4){
        await this.addNP(user, 5000);
        embed.setTitle("Something Has Happened");
        embed.setDescription(`You found 5000 NPs on the floor!`);
  embed.setImage("https://images.neopets.com/randomevents/images/neopoint_bag.png");
        return embed;
      }
      //raise active strength
      if(random==5){
        //check for an active pet
        if(value.activePet < 0) return nothingSHH();
        value.pets[value.activePet].strength++
        await db.set(user.id, value);
        embed.setTitle("Something Has Happened");
        embed.setDescription(`${value.pets[value.activePet].name} got Stronger!`);
        embed.setImage("https://images.neopets.com/randomevents/images/battle_faerie2.png");
        return embed
      }
      //lava ghoul
      if(random==6){
        //check for an active pet
        if(value.activePet < 0) return nothingSHH();
        value.pets[value.activePet].hp = 0;
        await db.set(user.id, value);
        embed.setTitle("Something Has Happened");
        embed.setDescription(`${value.pets[value.activePet].name} got attacked by the lava ghoul!`); embed.setImage("https://bookofages.jellyneo.net/assets/imgs/characters/lg/584.png");
        return embed
      }
      //raise active defense
      if(random==7){
        //check for an active pet
        if(value.activePet < 0) return nothingSHH();
        value.pets[value.activePet].defense++
        await db.set(user.id, value);
        embed.setTitle("Something Has Happened");
        embed.setDescription(`${value.pets[value.activePet].name} got Stronger!`); embed.setImage("https://images.neopets.com/randomevents/images/battle_faerie2.png");
        return embed
      }
      //Boochi Miss
      if(random==8){
        embed.setTitle("Something Has Happened");
        embed.setDescription(`Boochi takes aim at ${value.pets[value.activePet].name} but thankfully he misses!`);   embed.setImage("https://static.wikia.nocookie.net/guilds/images/5/52/BOOCHI.png/revision/latest/scale-to-width-down/246?cb=20160709191118");
        return embed;
      }
      
    }
    
    function nothingSHH(){
      let nEmbed = new MessageEmbed();
      nEmbed.setTitle("Aww nothing happened");
      nEmbed.setDescription("Maybe you should have an active pet...");
      return nEmbed;
    }
  }

  //ToDo Gifting
  this.gift = async function(user1, user2, itemName){
    
  }

  //paints the specified pet the color specified
  this.paint = async function(user, petName, color){
    //get user
    value = await db.get(user.id);
    let embed = new MessageEmbed();

    //start most functions with checking if the player is playing
    if(!value){
      embed.setTitle("You can't abandon a pet if you haven't joined NeoRPG!");
      embed.setDescription("");
      return embed;
    }
    //check if the player even has pets
    if(value.totalPets <= 0){
      embed.setTitle("You have no pets to paint!");
      embed.setDescription("");
      return embed
    }
    //find the pet that the user wants to paint
    paintIndex = value.pets.findIndex(x => x.name.toLowerCase() === petName.toLowerCase());
    //find the color that the user wants to paint
    colorIndex = neoList.color.findIndex(x => x.toLowerCase() === color.toLowerCase());
    //if no index is returned then the user does not own this pet 
    if(paintIndex < 0){
      embed.setTitle("You don't own " + petName + " - so you can't paint them :(");
      embed.setDescription("");
      return embed
    }
    //if no index is found then the pet cannot be painted cause that color doesn't exist
    if(paintIndex < 0){
      embed.setTitle(`Sorry ${color} doesn't exist..yet`);
      embed.setDescription("");
      return embed
    }
    //check to see if the pet is available at this color
    let isAvail = await this.isPetColorAvailable(color, value.pets[paintIndex].species);
    if(!isAvail){
      embed.setTitle(`Sorry this color is not available for ${value.pets[paintIndex].species}s`);
      embed.setDescription("");
      return embed
    }
    //check to see if the user has the right paintbrush
    brushIndex = value.inventory.findIndex(x => x.color?.toLowerCase() === color.toLowerCase());
    if(brushIndex < 0){
      embed.setTitle(`Sorry you don't have the right paint brush to paint your pet ${color}`);
      embed.setDescription("");
      return embed
    }
    //if we made it here then all the conditions are right to paint the pet
    //set the color to the right color
    value.pets[paintIndex].color = color;
    //remove the paint brush from the inventory
    value.inventory.splice(brushIndex, 1);
    embed.setTitle(`I love my new look!!`);
    embed.setImage(getPetURL(value.pets[paintIndex]));
    await db.set(user.id, value);
    return embed;
  }//end paint function
  
  //zap a pet
   this.zap = async function(user, petName){
     //get user
     userZapping = await db.get(user.id);
     //get a new embed
      let embed = new MessageEmbed();
     ///if the user doesn't exist - return
      if(!userZapping){
        embed.setTitle("You can't set an active pet if you haven't joined NeoRPG!");
        embed.setDescription("");
        return embed;
      }
      //if the user has no pets - return
      if(userZapping.totalPets < 0){
          embed.setTitle("You have no pets to zap! Adopt or Create One!");
          embed.setDescription("");
          return embed
      }
      //if the user has no lab access return
      if(!userZapping.labAccess){
          embed.setTitle("You don't have access to the lab ray! Try your luck with random events to get access.");
          embed.setDescription("");
          embed.setImage("https://bookofages.jellyneo.net/assets/imgs/characters/lg/400.png");
          return embed
      }
     //Date and Time blocks are here
      //get today's time
      var today = new Date();
      //if there is a value for last SHH (AKA The User got an SHH Before)
      if(userZapping.lastZap){
        //calcuate time remaining
        const timeRemaining = dateDiffInMinutes(userZapping.lastZap, today)
        //if more than designated minutes reset the last shh value
        if(timeRemaining >=ZAP_INTERVAL){
          userZapping.lastZap = today;
        }
        //otherwise tell the user it is too soon
        else{
          embed.setTitle("Too Soon");
          embed.setDescription(`You can get your next zap in ${ZAP_INTERVAL-timeRemaining} minutes.`);
          return embed;
        }
      }
      //if never received a SHH set the value to now
      else{
        userZapping.lastZap = today;
      }
      //update the datebase
      await db.set(user.id, userZapping);
      //Date and Time blocks finish here
      //ensure this pet is owned
      zapIndex = userZapping.pets.findIndex(x => x.name === petName);
      //if the pet at the active index exists
        if(userZapping.pets[zapIndex]){
         //zapping happens here
          let random = getRandomInt(8);
          //strength
          if(random==0){
            let change = getRandomInt(4);
            change++//because random starts with 0
            userZapping.pets[zapIndex].strength += change;
            embed.setTitle(`The ray is fired at ${userZapping.pets[zapIndex].name} and they gained ${change} strength points`);
            embed.setDescription("");
            embed.setImage(getSadPetURL(userZapping.pets[zapIndex]));
            return embed;
          }
          //hp
          if(random==1){
            let change = getRandomInt(4);
            change++//because random starts with 0
            userZapping.pets[zapIndex].maxhp += change;
            await db.set(user.id, userZapping);
            embed.setTitle(`The ray is fired at ${userZapping.pets[zapIndex].name} and they gained ${change} max hit points`);
            embed.setDescription("");
            embed.setImage(getSadPetURL(userZapping.pets[zapIndex]));
            return embed;
          }
          //defense
          if(random==2){
            let loseGain = getRandomInt(2);
            let change = getRandomInt(4);
            change++//because random starts with 0
            if(loseGain == 0){
              userZapping.pets[zapIndex].defense += change;
              await db.set(user.id, userZapping);
              embed.setTitle(`The ray is fired at ${userZapping.pets[zapIndex].name} and they gained ${change} defense points`);
              embed.setDescription("");
              embed.setImage(getSadPetURL(userZapping.pets[zapIndex]));
              return embed;
            }
            else{
              if((userZapping.pets[zapIndex].defense-change) <= 0){
                return nothingHappens();
              }
              else{
                userZapping.pets[zapIndex].defense -= change;
                await db.set(user.id, userZapping);
                embed.setTitle(`The ray is fired at ${userZapping.pets[zapIndex].name} and they lose ${change} defense points`);
                embed.setDescription("");
                embed.setImage(getSadPetURL(userZapping.pets[zapIndex]));
                return embed;
              }
            }
          }
          //movement
          if(random==3){
            let loseGain = getRandomInt(2);
            let change = getRandomInt(4);
            change++//because random starts with 0
            if(loseGain == 0){
              userZapping.pets[zapIndex].movement += change;
              await db.set(user.id, userZapping);
              embed.setTitle(`The ray is fired at ${userZapping.pets[zapIndex].name} and they gained ${change} movement points`);
              embed.setDescription("");
              embed.setImage(getSadPetURL(userZapping.pets[zapIndex]));
              return embed;
            }
            else{
              if((userZapping.pets[zapIndex].movement-change) <= 0){
                return nothingHappens();
              }
              else{
                userZapping.pets[zapIndex].movement -= change;
                await db.set(user.id, userZapping);
                embed.setTitle(`The ray is fired at ${userZapping.pets[zapIndex].name} and they lose ${change} movement points`);
                embed.setDescription("");
                embed.setImage(getSadPetURL(userZapping.pets[zapIndex]));
                return embed;
              }
            }
          }
          //species
          if(random==4){
            let random = getRandomInt(5);//I want a 1/5 chance the species is limited edition
            if(random == 0){
              userZapping.pets[zapIndex].species = neoList.limitedSpecies[getRandomInt(neoList.limitedSpecies.length)];
            }
            else{
              userZapping.pets[zapIndex].species = neoList.regularSpecies[getRandomInt(neoList.regularSpecies.length)];
            } 
            //change to a basic color
            userZapping.pets[zapIndex].color = neoList.basicColor[getRandomInt(neoList.basicColor.length)];
            await db.set(user.id, userZapping);
            embed.setTitle(`The ray is fired at ${userZapping.pets[zapIndex].name} and they turned into a  ${userZapping.pets[zapIndex].color} ${userZapping.pets[zapIndex].species}`);
            embed.setDescription("");
            embed.setImage(getSadPetURL(userZapping.pets[zapIndex]));
            return embed;
          }
          //color //ToDo Adjust so no royal,pirate, plushie etc.
          if(random==5){
            //asume the color is not available
            let isAvail = false;
            //init newColor
            let newColor = "";
           //while it's not available try a color until one works
            while(!isAvail){
              //generate a random color for this random event
              newColor = generateColor();
              //check this color is an avaialble color
              isAvail = await this.isPetColorAvailable(newColor, userZapping.pets[zapIndex].species);
            }
            userZapping.pets[zapIndex].color = newColor;
            await db.set(user.id, userZapping);
            embed.setTitle(`The ray is fired at ${userZapping.pets[zapIndex].name} and they changed color to ${newColor}`);
            embed.setDescription("");
            embed.setImage(getSadPetURL(userZapping.pets[zapIndex]));
            return embed;
          }
          //strength
          if(random==6){
            let loseGain = getRandomInt(2);
            let change = getRandomInt(4);
            change++//because random starts with 0
            if(loseGain == 0){
              userZapping.pets[zapIndex].strength += change;
              await db.set(user.id, userZapping);
              embed.setTitle(`The ray is fired at ${userZapping.pets[zapIndex].name} and they gained ${change} strength points`);
              embed.setDescription("");
              embed.setImage(getSadPetURL(userZapping.pets[zapIndex]));
              return embed;
            }
            else{
              if((userZapping.pets[zapIndex].strength-change) <= 0){
                return nothingHappens();
              }
              else{
                userZapping.pets[zapIndex].strength -= change;
                await db.set(user.id, userZapping);
                embed.setTitle(`The ray is fired at ${userZapping.pets[zapIndex].name} and they lose ${change} strength points`);
                embed.setDescription("");
                embed.setImage(getSadPetURL(userZapping.pets[zapIndex]));
                return embed;
              }
            }
          }
          //nothing
          if(random==7){
            embed.setTitle("The ray is shot at " + userZapping.pets[zapIndex].name + " - and nothing happened :(");
            embed.setDescription("");
            embed.setImage(getSadPetURL(userZapping.pets[zapIndex]));
            return embed;
          }
          //level
          if(random==8){
            let loseGain = getRandomInt(5);
            let change = getRandomInt(4);
            change++//because random starts with 0
            if(!loseGain == 0){ //if not zero
              userZapping.pets[zapIndex].level += change;
              await db.set(user.id, userZapping);
              embed.setTitle(`The ray is fired at ${userZapping.pets[zapIndex].name} and they gained ${change} level(s)`);
              embed.setDescription("");
              embed.setImage(getSadPetURL(userZapping.pets[zapIndex]));
              return embed;
            }
            else{ //1/5 chance of going back to level 1
               userZapping.pets[zapIndex].level = 1;
                await db.set(user.id, userZapping);
                embed.setTitle(`The ray is fired at ${userZapping.pets[zapIndex].name} and they went down to level 1`);
                embed.setDescription("");
                embed.setImage(getSadPetURL(userZapping.pets[zapIndex]));
                return embed;
            }
          }
          
        }
        else{
          embed.setTitle("You don't own " + petName + " - so you can't zap them :(");
          embed.setDescription("");
          return embed
        }
     
        function nothingHappens(){
            embed.setTitle("The ray is shot at " + userZapping.pets[zapIndex].name + " - and nothing happened :(");
            embed.setDescription("");
            embed.setImage(getSadPetURL(userZapping.pets[zapIndex]));
            return embed;
        }
    }  
  
  //takes in user, color, and the index of the pet to be painted
  this.paintPet = async function(user, color, petIndex){
    player = await db.get(user.id)
    if(petIndex>=0){//ensure the pet index is valid
      if(player){//if the value is in the db then proceed
        player.pets[petIndex].color = color;
        await db.set(user.id, player);
      }
      else{
        let embed = new MessageEmbed();
        embed.setTitle("Your pet would have been painted but you don't have one - use /adopt to get one");
        embed.setDescription("");
        return embed;
      }
    }
  }
  
  //function to add np - probably should be private
  this.addNP= async function(user, np){
    value = await db.get(user.id)
      if(value){//if a value is in the db = then add np
        value.np = value.np + np;
        await db.set(user.id, value);
      }
      else{
        let embed = new MessageEmbed();
        embed.setTitle("You aren't playing NeoRPG so you can't earn np... use /join to join");
        embed.setDescription("");
        return embed;
      }
  }

  //function to grant lab access np - probably should be private
  this.grantLabAccess= async function(user){
    value = await db.get(user.id)
      if(value){//if a value is in the db = then add np
        value.labAccess = true;
        await db.set(user.id, value);
      }
      else{
        let embed = new MessageEmbed();
        embed.setTitle("You aren't playing NeoRPG so you can't do this... use /join to join");
        embed.setDescription("");
        return embed;
      }
  }

  //there's probably a better way to do this but here goes... check name to see if it's ok
  this.isPetColorAvailable = async function(color, species){
    //create a temporary pet variable
    aPet = {"color":color, "species":species};
    //get the pet URL
    aURL = getPetURL(aPet);
    //get a response from the URL
    aResponse = await checkImage(aURL);
    if (aResponse.indexOf("Not Found") >= 0) return false;
    else{
      return true;
    }
  }
  
  //there's probably a better way to do this but here goes... check name to see if it's ok
  this.isNameFree = async function(petName){
    //check that name isn't taken
    //first get all the keys in the database
    userList = await db.list()
    //traverse the db for all users
    for(let i =0;i<userList.length;i++){
      user = await db.get(userList[i]); //get user
      for(let j=0;j<user.pets.length;j++){ //look at users pets
          if(user.pets[j].name.toLowerCase() === petName.toLowerCase()) return false;             //if pets name in lower case match return false
      }
    }
    return true; // if we haven't returned yet it's cause we good so name is free
  }
  
}//end constructor

//this get the embed with the user information
getUserEmbed = function(player, caption){
  //sample data for player
  //{"np": 0, "pet": [], "totalPets": 0, "maxPets": 1, "activePet": -1, "ownerTag": user.tag}
  //create new message Embed
  embed = new MessageEmbed();
  //set the embed title to the caption
  if(caption) {
    embed.setTitle(caption);
  }
  else{
    embed.setTitle('**Your Stats**');
  }
  //fill out the pet section
  let pets = "";
  //if the player has pets fill out the pets part of the string
  if(player.pets.length > 0){
    for(let i = 0; i<player.pets.length;i++){
      pets = pets + `**${player.pets[i].name}** the ${player.pets[i].color} ${player.pets[i].species} \n`;
    }
  }
  else{//otherwise set pets do display no active pets
    pets = "You don't have any pets! Use /adopt to adopt one!";
  }
  
  let active = "";
  //string cases for active pet
  if(player.activePet >= 0){//if player has an active pet aka Active Pet is not -1
    active = player.pets[player.activePet].name;
    embed.setImage(getPetURL(player.pets[player.activePet])); //add the pet picture to the description
  }
  else{//else the active section advises the user to set an active pet
    active = "You don't have an active pet! Set one with /setactive";
  }

  embed.setDescription(`Player: <@${player.id}>\nNeoPoints: ${player.np}\nActive Pet: **${active}**\n\nPets:\n${pets}\nPet Slots: ${player.maxPets}`);
  //embed.setImage(petUrl);
  return embed;
  
}

//this get the embed with the user inventory
function getInventoryEmbed(player){
  //create new message Embed
  embed = new MessageEmbed();
  //set the embed title to the caption
  embed.setTitle('**Your Inventory**');
  
  //fill out the pet section
  let items = "";
  //if the player has pets fill out the pets part of the string
  if(player.inventory.length > 0){
    for(let i = 0; i<player.inventory.length;i++){
      items = items + `${(i+1)}) ${player.inventory[i].name}\n`;
    }
    embed.setImage(player.inventory[0].url);
  }
  else{//otherwise set pets do display no active pets
    items = "You don't have any items!";
    if(player.activePet >= 0) embed.setImage(getSadPetURL(player.pets[player.activePet]));
  }
  
  embed.setDescription(`${items}`);
  return embed;
}

//this gets the URL of the Pet 
function getPetURL(pet){
  //Capitalize Pet Names Appropriately
  //first lowercase species
  species = pet.species.toLowerCase();

  //then capitalize
  var petCap = species.charAt(0).toUpperCase() + species.slice(1);
  //special case for JubJub
  if (species === "jubjub") petCap = "JubJub";
  //special case for Slushie Chia
  if (species === "slushiechia") petCap = "SlushieChia";

  //retrieve lowercase color
  color = pet.color.toLowerCase();
  
  //Capitalize Color Name
  var colorCap = color.charAt(0).toUpperCase() + color.slice(1);

  //Create Pet URL
  var petUrl = "http://neopetsclassic.com/images/pets/" + petCap + "/circle/" + species + "_" + color + "_baby.gif";

  //special URL for Nugget Chia
  if(species === "chia" && color === "nugget") petUrl = "https://media.discordapp.net/attachments/911666334050451507/944090945287254066/Screen_Shot_2022-02-17_at_11.39.42_PM.png";

  //special URL for Hoe Chia
  if(species === "chia" && color === "hoe") petUrl = "https://media.discordapp.net/attachments/902529156653416458/944717611726409828/Screenshot_20220211-191754-309.png";

  return petUrl;
}

  //this gets the sad URL of the Pet 
function getSadPetURL(pet){
  //Capitalize Pet Names Appropriately
  //first lowercase species
  species = pet.species.toLowerCase();

  //then capitalize
  var petCap = species.charAt(0).toUpperCase() + species.slice(1);
  //special case for JubJub
  if (species === "jubjub") petCap = "JubJub";
  //special case for Slushie Chia
  if (species === "slushiechia") petCap = "SlushieChia";

  //retrieve lowercase color
  color = pet.color.toLowerCase();
  
  //Capitalize Color Name
  var colorCap = color.charAt(0).toUpperCase() + color.slice(1);

  //Create Pet URL
  var petUrl = "http://neopetsclassic.com/images/pets/" + petCap + "/sad/" + species + "_" + color + "_baby.gif";

  //special URL for Nugget Chia
  if(species === "chia" && color === "nugget") petUrl = "https://media.discordapp.net/attachments/911666334050451507/944090945287254066/Screen_Shot_2022-02-17_at_11.39.42_PM.png";

  //special URL for Hoe Chia
  if(species === "chia" && color === "hoe") petUrl = "https://media.discordapp.net/attachments/902529156653416458/944717611726409828/Screenshot_20220211-191754-309.png";

  return petUrl;
}

//this gets the embed with the pet
function getPetEmbed(pet, caption){
  petUrl = getPetURL(pet);
  embed = new MessageEmbed();
  embed.setTitle(caption);
  //translate pet hunger to an actual word
  hunger = translateHunger(pet.hunger);
  happiness = translateHappiness(pet.mood);
  //set the description of the pet
  embed.setDescription(`Name: **${pet.name}**\nOwner: <@${pet.owner}>\nLevel: ${pet.level}\nHunger: ${hunger}\nMood: ${happiness}\nSpecies: ${pet.species} \nColor: ${pet.color}\nGender: ${pet.gender} \nHP: ${pet.hp}/${pet.maxhp} \nStrength: ${pet.strength} \nDefense: ${pet.defense} \nMovement:${pet.movement}`);
  if(pet.owner === "pound"){
    embed.setDescription(`Name: **${pet.name}**\nOwner: In the **Pound**\nHunger: ${hunger}\nMood: ${happiness}\nSpecies: ${pet.species} \nColor: ${pet.color}\nGender: ${pet.gender} \nHP: ${pet.hp}/${pet.maxhp} \nStrength: ${pet.strength} \nDefense: ${pet.defense} \nMovement:${pet.movement}`);
  }
  //set the url to the pet image
  embed.setImage(petUrl);
  
  return embed;
}

//translates hunger level from number to word
function translateHunger(hunger){
  if(hunger >=0 && hunger <= MAX_HUNGER){
    if(hunger == 0) return "Dying"
    if(hunger == 1) return "Starving"
    if(hunger == 2) return "Famished"
    if(hunger == 3) return "Very Hungry"
    if(hunger == 4) return "Hungry"
    if(hunger == 5) return "Not Hungry"
    if(hunger == 6) return "Fine"
    if(hunger == 7) return "Satiated"
    if(hunger == 8) return "Full Up"
    if(hunger == 9) return "Very Full"
    if(hunger == 10) return "Bloated"
    if(hunger == 11) return "Very Bloated"
  }
  else{
    return "Weird" //shouldn't be hit
  }
}

//translates happiness level level from number to word
function translateHappiness(happiness){
  if(happiness >=0 && happiness <= MAX_HAPPINESS){
    if(happiness == 0) return "Depressed"
    if(happiness == 1) return "Very Unhappy"
    if(happiness == 2) return "Miserable"
    if(happiness == 3) return "Unhappy"
    if(happiness == 4) return "Content"
    if(happiness == 5) return "Happy"
    if(happiness == 6) return "Cheerful"
    if(happiness == 7) return "Extremely Happy"
    if(happiness == 8) return "Joyful"
    if(happiness == 9) return "Delighted"
  }
  else{
    return "Weird" //shouldn't be hit
  }
}

//gets random int
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// a and b are javascript Date objects
function dateDiffInMinutes(a, b) {
  const MS_PER_MINUTE = 1000 * 60;
  var a = new Date(a);
  var b = new Date(b);
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getUTCHours(), a.getUTCMinutes(), a.getUTCSeconds());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getUTCHours(), b.getUTCMinutes(), b.getUTCSeconds());

  return Math.floor((utc2 - utc1) / MS_PER_MINUTE); //can do ms per minute and get device difference in minutes hours etc...
}

async function checkImage(petUrl) {
    let response = await fetch(petUrl);
    let data = response.text();
    return data;
}

function generateColor(){
  let randomColorNumber = getRandomInt(neoList.color.length);
  return randomColor = neoList.color[randomColorNumber];
}

module.exports = { NeoRPG }