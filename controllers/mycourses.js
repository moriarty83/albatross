///////////////////////
// DEPENDENCIES
///////////////////////
const express = require('express');
const Course = require("../models/course.js")
const { requiresAuth } = require('express-openid-connect');

///////////////////////
// ROUTER
///////////////////////
const router = express.Router();

///////////////////////
// ROUTES
///////////////////////

// Index
router.get ('/', requiresAuth(), (req, res) =>{
  Course.find(req.params.id, (error, foundCourses)=>{
      res.render('mycourses/index.ejs', {courses:foundCourses});
  });
});

// New
router.get('/new', requiresAuth(), (req, res)=>{
  res.render('mycourses/new.ejs')
});

// Confirm Delete
router.get('/:id/delete', (req, res)=>{
  Course.findById(req.params.id, (err, foundCourse)=>{
    res.render('mycourses/delete.ejs', {'course': foundCourse});
  });
});

// Delete
router.delete('/:id', (req, res)=>{
  Course.findByIdAndDelete(req.params.id, (err, deletedCourse)=>{
    res.redirect('/mycourses');
  });
});


// Update Course


// Update Pars
router.put('/:id/holes', (req, res)=>{
  console.log(req.body);
  let newPars = new Array();
  for(const par in req.body){
    newPars.push(+req.body[par]);
  }
  Course.findByIdAndUpdate(req.params.id, {pars: newPars}, {new: true }, (err, updatedCourse)=>{
    console.log(updatedCourse);
    res.redirect('/mycourses');
  });
});

// Create
router.post('/', (req, res)=>{
  const pars = new Array();
  for(let i = 0; i < req.body.holes; i++){pars.push(null)};
  req.body.isPublic = req.body.isPublic === "on" ? true : false;
  req.body.pars = pars;
  req.body.createdBy = req.oidc.user.email;

  const entry = new Course(req.body);
  console.log(req.body);
  entry.save(req.body, (err, newCourse)=>{
    res.redirect('/mycourses/'+newCourse._id+'/editholes');
  });
});

// Edit Course
router.get('/:id/edit', (req, res)=>{
  Course.findById(req.params.id, (err, foundCourse)=>{
    res.render('mycourses.edit.ejs', {'course': foundCourse})
  });
});

// Edit Pars
router.get('/:id/editholes', (req, res)=>{
  Course.findById(req.params.id, (err, foundCourse)=>{
    res.render('mycourses/editholes.ejs', {'course': foundCourse});
  });
});

// Show
router.get('/:id', (req, res) => {
  Course.findById(req.params.id, (error, foundCourse)=>{
    res.render('mycourses/show.ejs', {course: foundCourse});
  });
});

///////////////////////
// EXPORT
///////////////////////
module.exports = router;

