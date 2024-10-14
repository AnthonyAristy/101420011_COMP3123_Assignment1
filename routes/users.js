require('dotenv').config(); // Load environment variables

const express = require('express');
const User = require('../models/User'); 
const bcrypt = require('bcryptjs'); // Make sure to import bcrypt
const routes = express.Router();
const mongoose = require("mongoose");

// Update your connection string
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

mongoose.connect(DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB for users! connected well!!");
}).catch(err => {
    console.error("MongoDB connection for user error:", err);
});

// Signup route
routes.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'User already exists.' });
        }

        // Hash password
        const hashedPw = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPw });

        // Save the user to MongoDB
        const newUser = await user.save();
        
        // Save session ID in MongoDB
        req.session.userId = newUser._id;

        // Return the success message with user ID
        res.status(201).send({ 
            message: "User created successfully.",
            user_id: newUser._id 
        });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Login route
routes.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: 'Invalid Email, try again' });
        }

        const isPw = await bcrypt.compare(password, user.password);
        if (!isPw) {
            return res.status(400).send({ message: 'Invalid password, try again' }); 
        }

        req.session.userId = user._id;
        
        // Optional JWT token implementation can go here
        const jwtToken = ""; // Implement JWT token generation if needed

        return res.send({ 
            message: "Login successful.",
            jwt_token: jwtToken // Optional
        });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
});

module.exports = routes;
