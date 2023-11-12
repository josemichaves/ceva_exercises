require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;

// Create client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

module.exports.seedDb = async function seedDb() {
  try {
    // Connect to client
    await client.connect();

    // Select db, if not exists, created it
    const db = client.db("ex8");

    // Select colleciton, if not exists, created it
    const collection = db.collection("users");

    // Drop existing collection to have clean data to work
    await collection.drop();

    // Create indexes in order to improve query performance
    collection.createIndex({
      email: 1,
      first_name: 1,
      last_name: 1,
      roles: 0,
      last_connection_date: 1,
    });

    // Create Date
    const date = new Date();

    // Push document to users array
    await collection.insertOne({
      email: "johndoe@gmail.com",
      first_name: "John",
      last_name: "Doe",
      roles: [Math.random() < 0.5 ? "admin" : "user"],
      last_connection_date: date.toISOString(
        date.setMonth(date.getMonth() - 3)
      ), //Set last connection date, 3 months prior this month,
    });
  } finally {
    await client.close();

    console.log("Seeding complete :)");
  }
};
