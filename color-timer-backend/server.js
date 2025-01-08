require('dotenv').config(); //loads from .env
const express = require('express'); //web framework express
const mongoose = require('mongoose'); //object data modeling library for mongoDB
const bcrypt = require('bcryptjs'); //library to hash passwords
const jwt = require('jsonwebtoken'); //creating and verifying tokens
const cors = require('cors'); //middleware for cross origin resource sharing

const app = express(); //initializing express app
const port = 5000;

app.use(cors()); //enables CORS
app.use(express.json()); //parses JSON requests

const jwtSecret = process.env.JWT_SECRET; //token


mongoose.connect('mongodb://localhost:27017/color-timer') //connect to mongoDB
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

const userSchema = new mongoose.Schema({ //schema for User
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  colorPresets: [
    {
      name: String,
      colors: [String]
    }
  ]
});

const User = mongoose.model('User', userSchema); //defines a model

app.post('/register', async (req, res) => { //register new user
  try {
    const { username, password } = req.body; //receives username and pw from request body
    const hashedPassword = await bcrypt.hash(password, 10); //hashes pw
    const user = new User({ username, password: hashedPassword }); //new user created
    await user.save(); //saves user to db
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => { //log in a user
  try {
    const { username, password } = req.body; //receives username and pw
    const user = await User.findOne({ username }); //finds user with username
    if (!user) return res.status(400).json({ error: 'Invalid username or password' }); 
    const isMatch = await bcrypt.compare(password, user.password); //compares if pw matches
    if (!isMatch) return res.status(400).json({ error: 'Invalid username or password' });
    const token = jwt.sign({ userId: user._id }, jwtSecret); //creates token
    res.json({ token }); //responds with token
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/save-preset', async (req, res) => { //receives token and preset from request body
  const { token, preset } = req.body; //receives token and preset from request body
  try {
    const decoded = jwt.verify(token, jwtSecret); //verifies token
    const user = await User.findById(decoded.userId); //finds user using ID
    user.colorPresets.push(preset); //adds preset to array
    await user.save(); //saves user
    res.json({ message: 'Preset saved' });
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.post('/load-presets', async (req, res) => { 
  const { token } = req.body; //receives token from request body
  try {
    const decoded = jwt.verify(token, jwtSecret); //verifies token
    const user = await User.findById(decoded.userId); //finds user with ID
    res.json(user.colorPresets); //respond with preset array
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.post('/delete-preset', async (req, res) => {
    const { token, presetId } = req.body; //receives token and presetID from request body
    try {
      const decoded = jwt.verify(token, jwtSecret); //verifies token
      const user = await User.findById(decoded.userId); //finds user with ID
      user.colorPresets = user.colorPresets.filter(preset => preset._id.toString() !== presetId); //finds preset with ID and filters out
      await user.save(); //saves user
      res.json({ message: 'Preset deleted' });
    } catch (err) {
      console.error('Error deleting preset:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

app.listen(port, () => { //starting server
  console.log(`Server running on port ${port}`);
});

//node server.js