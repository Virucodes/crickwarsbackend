const express = require("express");
const router = express.Router();
const Player = require("../models/Player");

// Get all players
router.get("/", async (req, res) => {
  try {
    const players = await Player.find({});
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch players", error: error.message });
  }
});

// Get players by group
router.get("/group/:groupId", async (req, res) => {
  try {
    const players = await Player.find({ group2_id: req.params.groupId });
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch players by group", error: error.message });
  }
});

// Submit a rating for a player (calculates final_rating)


// Add a new player
router.post("/", async (req, res) => {
  try {
    const { name, team, role, price, img, dr, group2_id } = req.body;
    
    const player = new Player({
      name,
      team,
      role,
      price,
      img,
      dr,
      group2_id,
      rating: 0,
      final_rating: 0,
      rating_count: 0
    });
    
    await player.save();
    res.status(201).json(player);
  } catch (error) {
    res.status(500).json({ message: "Failed to add player", error: error.message });
  }
});

module.exports = router;
