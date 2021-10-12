///////////////////////
// DEPENDENCIES
///////////////////////
const express = require('express');
const Course = require("../models/course.js")
const Game = require("../models/game.js")
const Hole = require("../models/hole")
const { requiresAuth } = require('express-openid-connect');

///////////////////////
// ROUTER
///////////////////////
const router = express.Router();

///////////////////////
// ROUTES
///////////////////////

// Index
router.get('/', (req, res)=>{
    console.log("Query");
    console.log(req.query);
    req.query.isPublic = true;
    let newreg = '/${req.query.location}/'
    
    for(const key in req.query){
        if (req.query[key] === ''){ delete req.query[key];}
        else {req.query[key] = (req.query[key].toString()).replace("_", " ");}
    }
    const omissions = "-createdBy -lastStrokes -averageTotalScore -lastTotalScore -gamesPlayed -averageStrokes"
    Course.find(req.query, omissions, (err, foundCourses)=>{
        res.json(foundCourses);
    });
});

// New
router.get('/new', (req, res)=>{

});

// Delete
router.delete('/:id', (req, res)=>{

});

// Update
router.put('/:id', (req, res)=>{

});

// Create
router.post('/', (req, res)=>{

});

// Edit
router.get('/:id/edit', (req, res)=>{

});

// Show
router.get('/:id', (req, res)=>{
    Course.findById(req.params.id, "-createdBy", (err, foundCourse)=>{
        if(foundCourse.isPublic){
        res.json(foundCourse);
        }
        else{
            res.send("you do not have access to this course")
        }
    });

});


///////////////////////
// EXPORT
///////////////////////
module.exports = router;
