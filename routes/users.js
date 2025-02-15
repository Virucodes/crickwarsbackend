const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Hardcoded stadium data
const STADIUMS = {
    1: { name: "Narendra Modi Stadium, Ahmedabad", currentUsers: 0 },
    2: { name: "Wankhede Stadium, Mumbai", currentUsers: 0 },
    3: { name: "Chepauk (M. A. Chidambaram Stadium), Chennai", currentUsers: 0 },
    4: { name: "Eden Gardens, Kolkata", currentUsers: 0 },
    5: { name: "M. Chinnaswamy Stadium, Bengaluru", currentUsers: 0 }
};

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        
        // Check if username exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        
        // Find stadium with least users
        let assignedStadiumId = 1;
        let minUsers = STADIUMS[1].currentUsers;
        for (let i = 1; i <= 5; i++) {
            if (STADIUMS[i].currentUsers < minUsers) {
                minUsers = STADIUMS[i].currentUsers;
                assignedStadiumId = i;
            }
        }
        
        // Create new user
        const user = new User({
            username,
            password,
            group2_id: assignedStadiumId
        });
        
        // Update stadium count in memory
        STADIUMS[assignedStadiumId].currentUsers++;
        
        // Save user to MongoDB
        await user.save();
        
        res.status(201).json({
            message: 'Registration successful',
            username: user.username,
            stadiumName: STADIUMS[assignedStadiumId].name,
            group2_id: assignedStadiumId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        res.json({
            username: user.username,
            stadiumName: STADIUMS[user.group2_id].name,
            group2_id: user.group2_id,
            score: user.score
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all stadiums
router.get('/stadiums', (req, res) => {
    res.json(STADIUMS);
});

// NEW ROUTES FOR SCORE MANAGEMENT

// Get user's score
router.get('/score/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ username: user.username, score: user.score });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user's score
router.put('/score/:username', async (req, res) => {
    try {
        const { score } = req.body;
        
        // Validate score
        if (typeof score !== 'number' || score < 0) {
            return res.status(400).json({ message: 'Invalid score value' });
        }

        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.score = score;
        await user.save();

        res.json({ username: user.username, score: user.score });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Increment user's score
router.post('/score/:username/increment', async (req, res) => {
    try {
        const { points = 1 } = req.body; // Default increment by 1 if not specified
        
        // Validate points
        if (typeof points !== 'number' || points <= 0) {
            return res.status(400).json({ message: 'Invalid points value' });
        }

        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.score += points;
        await user.save();

        res.json({ username: user.username, score: user.score });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get leaderboard (top 10 users by score)
router.get('/leaderboard', async (req, res) => {
    try {
        const leaderboard = await User.find()
            .select('username score group2_id -_id')
            .sort({ score: -1 })
            .limit(6);

        // Add stadium names to the response
        const leaderboardWithStadiums = leaderboard.map(user => ({
            username: user.username,
            score: user.score,
            stadium: STADIUMS[user.group2_id].name
        }));

        res.json(leaderboardWithStadiums);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
