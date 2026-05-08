const uri = "mongodb+srv://adminUser617:wGgaJxnp2OpQy2Lj@cluster0.wuckxtp.mongodb.net/CMSC335DB?retryWrites=true&w=majority&appName=Cluster0";
const uri2 = "mongodb+srv://adminUser617:wGgaJxnp2OpQy2Lj@cluster0.wuckxtp.mongodb.net/?appName=Cluster0"
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({
   path: path.resolve(__dirname, "credentialsDontPost/.env"),
});
const { MongoClient, ServerApiVersion } = require("mongodb");
const dns = require("dns") 
dns.setServers(["1.1.1.1", "1.0.0.1"]);

(async () => {
   /* The connection string must have the name of the database before
      ?retryWrites=true, otherwise the test database in Atlas will be used */
   try {
      console.log(uri)
      await mongoose.connect(uri);

      /* Schema defining structure of a song document */
      /* Valid types: String, Number, Date, Buffer, Boolean, Mixed,
      ObjecdtId, Array, Decimal128, Map */
      const songsSchema = new mongoose.Schema({
         title: String,
         awards: Number,
         released: Date,
         grammyWinner: Boolean
      });

      /* Creating a Model what will allow us to complete CRUD operations
      IMPORTANT: The first argument to model() should be the singular
      form of the collection's name (e.g. the collection will be named
      "songs", if you provide "Song"). Moongoose will change the argument
      you provide to model() to plural and lowercase, and use it as the
      collections name */
      const Song = mongoose.model("Song", songsSchema);

      /* Creating a document (instance of Model) */
      const song1 = new Song({
         title: "Hello",
         awards: 2,
         released: new Date(),
         grammyWinner: true
      });

      /* Saving the song */
      await song1.save();

      /* Retrieving all songs */
      let songs = await Song.find({});
      console.log("Songs\n", songs);

      mongoose.disconnect();
   } catch (err) {
      console.error(err);
   }
})();


// async function main() {
//    const databaseName = "CMSC335DB";
//    const collectionName = "moviesCollection";
//    console.log(uri2);
//    const client = new MongoClient(uri2, { serverApi: ServerApiVersion.v1 });

//    /*try {
//       await client.connect();
//       const database = client.db(databaseName);
//       const collection = database.collection(collectionName);

//       const movie = { name: "Notebook", year: 2000, stars: 2.0 };
//       let result = await collection.insertOne(movie);
//       console.log(`Inserted Movie ${movie.name}, Movie Id: ${result.insertedId}`);
   
//       const moviesArray = [
//          { name: "Batman", year: 2021, stars: 1.5 },
//          { name: "Wonder Women", year: 2005, stars: 2.0 },
//          { name: "When Harry Met Sally", year: 1985, stars: 5 },
//          { name: "Hulk", year: 1985, stars: 5 },
//       ];
//       result = await collection.insertMany(moviesArray);
//       console.log(`Inserted ${result.insertedCount} additional movies`);
//    } catch (e) {
//       console.error(e);
//    } finally {
//       await client.close();
//    }*/
//      try {
//       await client.connect();
//       const database = client.db(databaseName);
//       const collection = database.collection(collectionName);

//       /* Inserting one movie */
//       const movie = { name: "Notebook", year: 2000, stars: 2.0 };
//       let result = await collection.insertOne(movie);
//       console.log(`Inserted Movie ${movie.name}, Movie Id: ${result.insertedId}`);
   
//       /* Inserting several movies */
//       const moviesArray = [
//          { name: "Batman", year: 2021, stars: 1.5 },
//          { name: "Wonder Women", year: 2005, stars: 2.0 },
//          { name: "When Harry Met Sally", year: 1985, stars: 5 },
//          { name: "Hulk", year: 1985, stars: 5 },
//       ];
//       result = await collection.insertMany(moviesArray);
//       console.log(`Inserted ${result.insertedCount} additional movies`);
//    } catch (e) {
//       console.error(e);
//    } finally {
//       await client.close();
//    }
// }
// main();