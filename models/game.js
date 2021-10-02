const mongoose = require('./connection');

const Schema = mongoose.Schema;

const courseSchema = new Schema(
    {
        course: String,
        holes: Array,
        note: String,
        complete: Boolean,
    },
    { timestamps: true }
);

// Creating course model that pushes Schema to mongoose
const Course = mongoose.model('Course', courseSchema);

// Export course model so it can be used in controller
module.exports = Course;