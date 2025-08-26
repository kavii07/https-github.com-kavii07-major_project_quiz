const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    scores: { type: Map, of: Number },
    status: { type: String, enum: ['waiting', 'ongoing', 'finished'], default: 'waiting' },
    userProgress: { type: Map, of: Number },
});

module.exports = mongoose.model('GameSession', gameSessionSchema);
