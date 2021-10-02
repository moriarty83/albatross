const mongoose = require('./connection');

const Schema = mongoose.Schema;

const courseSchema = new Schema(
    {
        title: String,
        type: String,
        holes: Number,
        pars: [Number],
        location: String,
        createdBy: String,
        isPublic: Boolean
    },
    { timestamps: true }
);

// Creating course model that pushes Schema to mongoose
const Course = mongoose.model('Course', courseSchema);

// Export course model so it can be used in controller
module.exports = Course;