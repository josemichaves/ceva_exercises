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

async function run(param = "jo") {
  await seedDb().catch(console.dir); // Run seeder before executing code

  try {
    // Connect to client
    await client.connect();

    // Select collection
    const collection = client.db("ex8").collection("users");

    const date = new Date();

    const result = await collection
      .find({
        $and: [
          {
            last_connection_date: {
              $gte: Date.parse(
                date.toISOString(date.setMonth(date.getMonth() - 5))
              ),
            },
          },
          {
            $or: [
              { email: param },
              {
                first_name: {
                  $regex: "^" + param,
                  $options: "i",
                },
              },
              {
                last_name: {
                  $regex: "^" + param,
                  $options: "i",
                },
              },
            ],
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
run();
