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

async function run(param = "josemi") {
  await seedDb().catch(console.dir);

  try {
    // Connect to client
    await client.connect();

    // Select collection
    const collection = client.db("ex8").collection("users");

    const date = new Date();

    const result = await collection
      .find({
        $or: [
          {
            email: param, // Exact match
            first_name: {
              $regex: "^" + param,
              $options: "i",
            }, // Use regex to check starts with
            last_name: {
              $regex: "^" + param,
              $options: "i",
            },
          },
          {
            last_connection_date: {
              $lte: date.toISOString(date.setMonth(date.getMonth() - 6)), // Last connection date should be less than today minus 6 months
            },
          },
        ],
      })
      .toArray();

    console.log(result);
  } finally {
    await client.close();

    console.log("Operation complete :)");
  }
}

// Run the code
run().catch(console.dir());
