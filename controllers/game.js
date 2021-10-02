///////////////////////
// DEPENDENCIES
///////////////////////
const express = require('express');
const Course = require("../models/course.js")
const Game = require("../models/game.js")
const { requiresAuth } = require('express-openid-connect');

///////////////////////
// ROUTER
///////////////////////
const router = express.Router();

///////////////////////
// ROUTES
///////////////////////

// Index

// New
router.get('/new', (req, res)=>{
    Course.find({createdBy: req.oidc.user.email}, (err, foundCourses)=>{
        res.render('game/new.ejs', {'courses': foundCourses});
    });
})

// Delete

// Update

// Create

// Edit

// Show


///////////////////////
// EXPORT
///////////////////////
module.exports = router;
