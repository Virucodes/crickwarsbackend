// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    group2_id: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    score: {
        type: Number,
        default: 0,  // Default score when user is created
        min: 0      // Score cannot be negative
    }
});

module.exports = mongoose.model('User', userSchema);