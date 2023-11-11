require("dotenv").config()
const {
    MongoClient,
    ServerApiVersion
} = require('mongodb');
const {
    seedDb
} = require("./seeders/usersSeeder");


const uri = process.env.MONGODB_URI

// Create client
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    
    await seedDb().catch(console.dir)
    
    try {
        // Connect to client
        await client.connect();
        
        // Select collection
        const collection = client.db('ex9').collection('users');
        
        const result = await collection.aggregate([
            
            {
                $unwind: '$roles' // Unwind roles, create a document for each role user has
            },
            {
                $group: { // Group emails by role
                    _id: '$roles',
                    users: {
                        $push: "$email" // Push email on to the array
                    }
                }
            },
            {
                $project: { // Filter not needed fields
                    _id: 1,
                    users: 1
                }
            }
        ]).toArray()
        
        console.log(result)
        
        
    } finally {
        
        await client.close()
        
        console.log('Operation complete :)')
    }
}

// Run the code
run().catch(console.dir)