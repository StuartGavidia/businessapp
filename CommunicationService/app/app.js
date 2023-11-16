import express from 'express';
import cors from 'cors'
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5103;
const HOST = '0.0.0.0';



app.get('/communication/', (req, res) => {
  res.send('hello');
});

const cosmosdbUri = "mongodb://bma-database:FDIXUCt0gpWhEoX8bT3tDIHi6e6IVfGLjSr2q1wIMLYwcLBKpPgd834LPzt1PG3SudtVdb5g3KMlACDbJoFU2A==@bma-database.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@bma-database@";
const client = new MongoClient(cosmosdbUri);
await client.connect();
const database = client.db('SampleDB');

const document = {
  "conversationId": "8675309",
  "participants": [
    "12345",
    "67890",
    "11111"
  ],
  "createdAt": "2023-10-20T10:00:00Z",
  "title": "Project Discussion"
};

// Define the /createThread route here
app.post('/communication/createThread',  (req, res) => {
  // connect to the server
  const collection = database.collection('Conversations');
  collection.insertOne(document, (err) => {
    if (err) {
      console.error('Error inserting document: ', err);
      res.status(500).json({error: 'Internal Server Error'});
      return;
    }
    res.json({message: 'Document inserted successfully'});
  });
});

//Getting Message Results by Conversation ID
app.get("/communication/messages/:conversationID", async (req, res) => {
  // connect to the server
  const conversationID = req.params.conversationID;
  try{
    const collection = database.collection('Messages');
    const messages = await collection.find().toArray();
    res.json(messages);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching messages.' });
  }
})
app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
