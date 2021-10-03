const mongoose = require('./connection');

const Schema = mongoose.Schema;

const holeSchema = new Schema(
    {
        course: String,
        courseId: String,
        hole: Number,
        par: Number,
        strokes: Number,
        notes: String,
    },
    { timestamps: true }
);

// Creating course model that pushes Schema to mongoose
const Hole = mongoose.model('Hole', holeSchema);

// Export course model so it can be used in controller
module.exports = Hole;