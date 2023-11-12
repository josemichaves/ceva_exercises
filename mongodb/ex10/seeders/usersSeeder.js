require("dotenv").config();
const faker = require("faker");
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

    // Select collection
    const collection = client.db("ex10").collection("users");

    // Drop existing collection to have clean data to work
    await collection.drop();

    // Initialize empty array to store roles
    let roles = [];

    for (let i = 0; i < 2; i++) {
      roles.push([Math.random() < 0.5 ? "admin" : "user"]);
    }

    // Insert document, with specified ID
    await collection.insertOne({
      _id: "5cd96d3ed5d3e20029627d4a",
      email: faker.internet.email(),
      first_name: faker.name.firstName(),
      last_name: faker.name.firstName(),
      roles: roles,
      last_connection_date: faker.date.recent(),
      addresses: {
        zip: faker.address.zipCode,
        city: faker.address.cityName,
      },
    });
  } finally {
    await client.close();

    console.log("Seeding complete :)");
  }
};
