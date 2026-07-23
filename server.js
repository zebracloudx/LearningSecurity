const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json()); // Allows your server to read incoming JSON data from users

// Serve static web pages (like HTML, CSS, images) from your project folder
app.use(express.static(__dirname));

// 1. Your digital address to MongoDB Atlas
const mongoURI = 'mongodb+srv://zebracloudx_db_user:Vhn3Ki8swcqEVHN2@cluster0.uonzfzg.mongodb.net/?appName=Cluster0';

// 2. Command the app to connect to the cloud database
mongoose.connect(mongoURI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch(err => console.error('Connection error:', err));

// 3. Define a blueprint (Schema) for a test data entry
const testSchema = new mongoose.Schema({
  message: String,
  date: { type: Date, default: Date.now }
});
const TestModel = mongoose.model('Test', testSchema);

// 4. Define a blueprint and route specifically for Cyberlab-Rookies
const cyberlabSchema = new mongoose.Schema({
  username: String,
  score: Number,
  date: { type: Date, default: Date.now }
});
const CyberlabUser = mongoose.model('CyberlabUser', cyberlabSchema);

app.post('/api/save-score', async (req, res) => {
  try {
    const { username, score } = req.body;
    const newUser = new CyberlabUser({ username, score });
    await newUser.save();
    res.status(201).json({ success: true, message: 'Score saved to MongoDB!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Temporary test web route
app.get('/test-db', async (req, res) => {
  try {
    const newEntry = new TestModel({ message: 'Hello from my sandbox server!' });
    await newEntry.save(); // Tries to write a record to your cloud database
    res.status(201).json({ success: true, data: newEntry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Tell the server to start listening for requests on port 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});