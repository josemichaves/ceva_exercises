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

module.exports.seedDb = async function seedDb() {
    
    try {
        // Connect to client
        await client.connect();
        
        // Select collection
        const collection = client.db('ex9').collection('users');
        
        // Drop existing collection to have clean data to work
        await collection.drop();
        
        // Initialize empty array to store users
        let users = []
        
        for (let i = 0; i < 5; i++) {
            
            // Push document to users array
            users.push({
                email: faker.internet.email(),
                first_name: faker.name.firstName(),
                last_name: faker.name.firstName(),
                roles: [Math.random() < 0.5 ? 'admin' : 'user'],
                last_connection_date: faker.date.recent(),
            })
        }
        
        // Push users to collection
        await collection.insertMany(users);
        
    } finally {
        
        await client.close()
        
        console.log('Seeding complete :)')
    }
}