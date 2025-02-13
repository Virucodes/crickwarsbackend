// models/Stadium.js
const mongoose = require('mongoose');

const stadiumSchema = new mongoose.Schema({
    stadiumId: {
        type: Number,
        required: true,
        unique: true,
        min: 1,
        max: 5
    },
    name: {
        type: String,
        required: true
    },
    currentUsers: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Stadium', stadiumSchema);