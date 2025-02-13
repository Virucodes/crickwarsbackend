const express = require('express');
const router = express.Router();
const Stadium = require('../models/stadium');
const User = require('../models/User');

// Initialize stadiums if they don't exist
router.post('/init', async (req, res) => {
  try {
    const stadiums = [
      {
        name: 'M. Chinnaswamy Stadium',
        pitchType: 'batting',
        batsmanBonus: 1,
        bowlerBonus: -0.5
      },
      {
        name: 'M. A. Chidambaram Stadium',
        pitchType: 'bowling',
        batsmanBonus: -0.5,
        bowlerBonus: 1
      },
      {
        name: 'Wankhede Stadium',
        pitchType: 'balanced',
        batsmanBonus: 0.2,
        bowlerBonus: 0.2
      }
    ];

    for (const stadium of stadiums) {
      await Stadium.findOneAndUpdate(
        { name: stadium.name },
        stadium,
        { upsert: true }
      );
    }

    res.json({ message: 'Stadiums initialized successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available stadiums with space
router.get('/available', async (req, res) => {
  try {
    const stadiums = await Stadium.find({
      currentUsers: { $lt: 5 }
    });
    res.json(stadiums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});