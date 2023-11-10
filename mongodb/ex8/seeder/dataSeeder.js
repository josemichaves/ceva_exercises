require("dotenv").config()
const faker = require("faker");
const {
    MongoClient,
    ServerApiVersion
} = require('mongodb');


const uri = process.env.MONGODB_URI

// Create client
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function seedDb() {

    try {
        // Connect to db
        await client.connect();

        // Select collection
        const collection = client.db('ex8').collection('users');

        // Drop existing collection to have clean data to work
        await collection.drop();

        // Initialize empty array to store object to ssed
        let users = []

        for (let i = 0; i < 5; i++) {

            let roles = [];

            for (let i = 0; i < 2; i++) {
                roles.push(faker.lorem.word())
            }

            users.push({
                email: faker.internet.email(),
                first_name: faker.name.firstName(),
                last_name: faker.name.firstName(),
                roles: roles,
                last_connection_date: faker.date.recent(),
            })
        }

        // Insert in collection
        await collection.insertMany(users)


    } finally {

        await client.close()

        console.log('Seeding complete :)')
    }

}

// Run the seeder
seedDb().catch(console.dir)