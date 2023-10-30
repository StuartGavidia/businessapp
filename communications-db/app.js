const { MongoClient } = require("mongodb");

// Replace with your Azure Cosmos DB connection string
const cosmosdbUri = "mongodb://bma-database:FDIXUCt0gpWhEoX8bT3tDIHi6e6IVfGLjSr2q1wIMLYwcLBKpPgd834LPzt1PG3SudtVdb5g3KMlACDbJoFU2A==@bma-database.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@bma-database@";

// Replace with your database and collection names
const dbName = "SampleDB";
const collectionName = "Messages";

async function addDocument() {
    const client = new MongoClient(cosmosdbUri, { useUnifiedTopology: true });

    try {
        await client.connect();

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Define your document
        const document = {
          "messageType": 'chat',
          "senderId": 'user3',
          "senderDisplayName": 'Carole Poland',
          "messageId": "16234",
          "conversationId": "54321",
          "content": "Yeah agree, let's chat here from now on!",
          "createdOn": new Date('2019-04-13T00:00:00.000+08:09'),
          "attached": false,
          "contentType": 'text'
        };

        // Insert the document into the collection
        const result = await collection.insertOne(document);

        console.log(`Inserted document with ID: ${result.insertedId}`);
    } finally {
        client.close();
    }
}

addDocument().catch(console.error);
