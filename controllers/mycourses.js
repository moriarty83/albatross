///////////////////////
// DEPENDENCIES
///////////////////////
const express = require('express');
const Course = require("../models/course.js")
const { requiresAuth } = require('express-openid-connect');
const Game = require('../models/game.js');

///////////////////////
// ROUTER
///////////////////////
const router = express.Router();

///////////////////////
// ROUTES
///////////////////////

// Index
router.get ('/', (req, res) =>{
  const filterQuery = req.query.filter;
  let filter;
  const loggedIn = req.oidc.isAuthenticated() ? true : false;
  // Determines filter based on if User is Authenticated
  if(req.oidc.isAuthenticated())
  {
    console.log("logged in")
    filter = filterQuery==='user' ? {createdBy: req.oidc.user.email} : filterQuery==='public' ? {isPublic: true} : {};
  }
  // If not authenticated, only shows public items.
  else{
    filter = {isPublic: true}
  }
  Course.find(filter, (error, foundCourses)=>{
      res.render('mycourses/index.ejs', {courses:foundCourses, loggedIn: loggedIn});
  });
});

// New
router.get('/new', requiresAuth(), (req, res)=>{
  const loggedIn = req.oidc.isAuthenticated() ? true : false;

  res.render('mycourses/new.ejs', {loggedIn: loggedIn})
});

// Delete
router.delete('/:id', requiresAuth(), (req, res)=>{
  Course.findByIdAndDelete(req.params.id, (err, deletedCourse)=>{
    res.redirect('/mycourses');
  });
});

// Update Course
router.put('/:id', requiresAuth(), (req, res)=>{
  req.body.isPublic = req.body.isPublic === "on" ? true : false;
  Course.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedCourse)=>{
    res.redirect('/mycourses/'+updatedCourse._id+'/editholes')
  })
})

// Update Pars
router.put('/:id/holes', requiresAuth(), (req, res)=>{
  console.log(req.body);
  let newPars = new Array();
  for(const par in req.body){
    newPars.push(+req.body[par]);
  }
  req.body.totalPars = newPars.reduce((a, b) => a + b, 0);
  // Checks User against Created By
  Course.findById(req.params.id, (err, foundCourse)=>{
    //Rejects Update if User/Createdby Don't match
    if(foundCourse.createdBy !== req.oidc.user.email){
      res.render('mycourses/error.ejs', {'message': 'You do not have permission to edit this course'});
    }

    // Updates
    Course.findByIdAndUpdate(req.params.id, {pars: newPars, totalPar: req.body.totalPars}, {new: true }, (err, updatedCourse)=>{
      res.redirect('/mycourses');
    });
  });
});

// Create
router.post('/', requiresAuth(), (req, res)=>{
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
router.get('/:id/edit', requiresAuth(), (req, res)=>{
  const loggedIn = req.oidc.isAuthenticated() ? true : false;

  Course.findById(req.params.id, (err, foundCourse)=>{
    if(foundCourse.createdBy !== req.oidc.user.email){
      res.render('mycourses/error.ejs', {'message': 'You do not have permission to edit this course'})
    }
    res.render('mycourses/edit.ejs', {'course': foundCourse, loggedIn: loggedIn})
  });
});

// Edit Pars
router.get('/:id/editholes', requiresAuth(), (req, res)=>{
  const loggedIn = req.oidc.isAuthenticated() ? true : false;

  Course.findById(req.params.id, (err, foundCourse)=>{
    if(foundCourse.createdBy !== req.oidc.user.email){
      res.render('mycourses/error.ejs', {'message': 'You do not have permission to edit this course'})
    }
    res.render('mycourses/editholes.ejs', {'course': foundCourse, loggedIn: loggedIn});
  });
});

// Show
router.get('/:id', requiresAuth(), (req, res) => {
  const loggedIn = req.oidc.isAuthenticated() ? true : false;
  Course.findById(req.params.id, (error, foundCourse)=>{
    Game.find({courseId: req.params.id}, (err, foundGames)=>{
      if(foundGames.length>0){
      }
      console.log(foundGames.length);
    });
    const canEdit = foundCourse.createdBy === req.oidc.user.email ? true : false;
    res.render('mycourses/show.ejs', {'course': foundCourse, 'canEdit': canEdit, loggedIn: loggedIn});
  });
});

///////////////////////
// EXPORT
///////////////////////
module.exports = router;

