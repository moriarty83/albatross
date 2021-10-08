const mongoose = require('./connection');
const Hole = require('./hole');

const HoleSchema = mongoose.model('Hole').schema;

const Schema = mongoose.Schema;

const gameSchema = new Schema(
    {
        course: String,
        courseId: String,
        type: String,
        date: Date,
        pars: [{type: Number}],
        strokes: [{type: Number}],
        holeScore: [{type: Number}],
        holeNotes: [{type: String}],
        gameNotes: String,
        holesComplete: Number,
        totalPar: Number,
        totalStrokes: Number,
        totalScore: Number,
        complete: Boolean,
        user: String,
    },
    { timestamps: true }
);

// Creating course model that pushes Schema to mongoose
const Game = mongoose.model('Game', gameSchema);

// Export course model so it can be used in controller
module.exports = Game;