require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const { seedDb } = require("./seeders/usersSeeder");

const uri = process.env.MONGODB_URI;

// Create client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run(_id) {
  await seedDb().catch(console.dir); // Run seeder before executing code

  try {
    // Connect to client
    await client.connect();

    // Select collection
    const collection = client.db("ex10").collection("users");

    console.log(
      `Initial state of Document _id ${_id} updated. \nNew version of document:`,
      await getRecord(collection, _id)
    );

    // Update date, address and push new role into document
    await collection.updateOne(
      {
        _id,
      },
      {
        $set: {
          last_connection_date: new Date(),
          addresses: {
            zip: 75001,
            city: "Paris 1",
          },
        },
        $push: {
          roles: "admin",
        },
      }
    );

    console.log(
      `Document with _id ${_id} updated. \nNew version of document:`,
      await getRecord(collection, _id)
    );
  } finally {
    await client.close();
  }
}

async function getRecord(collection, _id) {
  return await collection.findOne({
    _id,
  });
}
// Run the code
run("5cd96d3ed5d3e20029627d4a").catch(console.dir);
