/* Mongo Database (moved from bot.js, put it back if needed but we might do another route so dont do it yet)
const { MongoClient } = require('mongodb');
const uri = process.env['mongo']
const dbclient = new MongoClient(uri);
//Functions for DB stuff
const db = require('./database.js'); */

const {MongoClient} = require('mongodb');
const uri = process.env['mongo']
const dbclient = new MongoClient(uri);

/* Add an entry to a DB. Takes `doc`` to add, `database` name, and `collection` name` */
async function addToDB(doc, db, col) {
  try {
    await dbclient.connect();
    const database = dbclient.db(db);
    const collection = database.collection(col);
    const result = await collection.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    await dbclient.close();
  }
}



//idk if i can do it like this?
async function queryDB(q, db, col) {
  try {
    await dbclient.connect();
    const database = dbclient.db(db);
    const collection = database.collection(col);
  // Query for q
    const result = await collection.findOne(q);
    console.log(result) //needs to return ofc but how
  } finally {
    await dbclient.close();
  }
}


//add a user's info and b-day to the db. [a for (message)author]
function addbday(a,bday) {
  //Need to check if entry exists yet before adding or we get le dupez
    const doc = {
      id: a.id,
      bot: a.bot,
      system: a.system,
      flags: a.flags,
      username: a.username,
      discriminator: a.discriminator,
      avatar: a.avatar,
      banner: a.banner,
      accentColor: a.accentColor,
      birthday: bday,
    }
   queryDB({ username : a.username }, "calendar", "birthdays")
   addToDB(doc, "calendar", "birthdays")
}

module.exports = { addbday }