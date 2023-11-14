/*
 * Filename: complex_code.js
 * Description: This code demonstrates a complex implementation of a social media dashboard.
 */
 
// Import necessary libraries
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Connect to MongoDB database
mongoose.connect('mongodb://localhost/social_media_dashboard', { useNewUrlParser: true, useUnifiedTopology: true });

// Define schemas
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const postSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

// Define models
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

// Create express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Signup endpoint
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'my_secret_key');

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create post endpoint
app.post('/posts', async (req, res) => {
  try {
    const { title, content } = req.body;

    // Verify the JWT token
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, 'my_secret_key');

    // Create a new post
    const newPost = new Post({ userId: decodedToken.userId, title, content });
    await newPost.save();

    return res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all posts endpoint
app.get('/posts', async (req, res) => {
  try {
    // Fetch all posts
    const posts = await Post.find();

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Listen on port 3000
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});