import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {MongoClient} from 'mongodb';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5103;
const HOST = '0.0.0.0';

const authenticate = (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.user_cookie;

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'we_need_to_change_this', (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;

    next();
  });
};

app.get('/communication/', (req, res) => {
  res.send('hello');
});

const cosmosdbUri = 'mongodb://bma-database:YdpClEgzYQYSPzfxBEp3ESCmJV8C1ceynuSFtceydU5IBdVumXeOsHblPZZdfKVEYogUESNbGB5TACDbFjNxvg==@bma-database.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@bma-database@';
const client = new MongoClient(cosmosdbUri);
await client.connect();
const database = client.db('SampleDB');

// Define the /createThread route here
app.post('/communication/createThread', authenticate, (req, res) => {
  // connect to the server
  const userId = req.user.user_id.toString();
  const collection = database.collection('Conversations');
  const doc = req.body;
  doc.participants.push(userId);
  collection.insertOne(doc, (err) => {
    if (err) {
      console.error('Error inserting document: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json({ message: 'Document inserted successfully' });
  });
});

// Getting Message Results by Conversation ID
app.get('/communication/messages/:conversationID', authenticate, async (req, res) => {
  // connect to the server
  const { conversationID } = req.params;
  const userID = req.user.user_id;
  try {
    const collection = database.collection('Messages');
    const messages = await collection.find({ conversationId: conversationID }).toArray();
    for(let i = 0; i < messages.length; i++){
      messages[i].mine = userID === messages[i].senderId;
    }
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching messages.' });
  }
});

// Adding message to conversation
app.post('/communication/conversations/addMessage', authenticate, (req, res) => {
  const newMessage = req.body;
  newMessage.senderId = req.user.user_id;
  newMessage.senderDisplayName = req.user.first_name + " " + req.user.last_name;
  const collection = database.collection('Messages');
  collection.insertOne(newMessage, (err) => {
    if (err) {
      console.error('Error inserting document: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json({ message: 'Document inserted successfully' });
  });
});

//Adding participant to conversation
app.put('/communication/conversations/addParticipant', async (req, res) => {
  const conversationID = req.body.conversationId;
  const userID = req.body.userId;
  try {
    const collection = database.collection('Conversations');

    // First, check if the participant already exists in the conversation
    const conversation = await collection.findOne({ conversationId: conversationID });
    if (conversation && conversation.participants.includes(userID)) {
      return res.status(400).json({ error: 'Participant already exists in the conversation.' });
    }

    // If the participant doesn't exist, proceed to add them
    const result = await collection.updateOne(
      { conversationId: conversationID },
      { $addToSet: { participants: userID } },
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

// Getting Conversations by UserID
app.get('/communication/conversations/', authenticate, async (req, res) => {
  try {
    const collection = database.collection('Conversations');
    const threads = await collection.find({ participants: String(req.user.user_id) }).toArray();
    res.json(threads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching conversation threads' });
  }
});
app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
