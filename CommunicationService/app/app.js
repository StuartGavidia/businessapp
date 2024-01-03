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

const cosmosdbUri = "mongodb://bma-database:QCVFyzTDxUO4dKF0yOWWVZS6bzGFDC6XIO3eTUXRGQJsIDtIJ9Ks8qto5qIBRDxXhbY4AgVxF2irACDbuCxbjw==@bma-database.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@bma-database@";
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
  const doc = req.body;
  collection.insertOne(doc, (err) => {
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
    const messages = await collection.find({ conversationId: conversationID }).toArray();
    res.json(messages);
  }catch(error){
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching messages.' });
  }
})

//Adding message to conversation
app.post("/communication/conversations/addMessage", (req,res) =>{
  const newMessage = req.body;
  const collection = database.collection('Messages');
  collection.insertOne(newMessage, (err) => {
    if (err) {
      console.error('Error inserting document: ', err);
      res.status(500).json({error: 'Internal Server Error'});
      return;
    }
    res.json({message: 'Document inserted successfully'});
  });
})

//Adding participant to conversation
app.put("/communication/conversations/addParticipant", async (req, res) => {
  const conversationID = req.body.conversationId;
  const userID = req.body.userId;
  try {
    const collection = database.collection('Conversations');

    const result = await collection.updateOne(
      { "conversationId": conversationID },
      { $addToSet: { "participants": userID } }
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Participant added successfully.' });
    } else {
      res.status(404).json({ error: 'Conversation not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding participant.' });
  } finally {
    await client.close();
  }
});

//Getting Conversations by UserID
app.get("/communication/conversations/:userID", async (req,res) =>{
  const userId = req.params.userId;
  try{
    const collection = database.collection('Conversations');
    const threads = await collection.find({"userId": userId}).toArray();
    res.json(threads);
  }
  catch(error){
    console.error(error);
    res.status(500).json({error: "An error occurred while fetching conversation threads"})
  }
})
app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
