const path = require("path");
const Course = require("../models/courses.js")

// Index
const courseIndex  = (req, res) =>{
  Course.find({}, (error, foundCourses)=>{
      res.render('course_index.ejs', {courses:foundCourses});
  });
};

// New


// Delete


// Update


// Create
const courseCreate = (req, res) => {
  Course.create(req.body, (error, createdCourse)=>{
    res.send(createdCourse);
  });
};

// Edit


// Show

module.exports = {
  getCourseIndex: courseIndex,
  postCreateCourse: courseCreate
};

