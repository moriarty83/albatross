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
    Game.find({user: req.oidc.user.email}, (err, foundGames)=>{
        res.render('game/index.ejs', {'games': foundGames});
     });
})

// New
router.get('/new', (req, res)=>{
    Course.find({createdBy: req.oidc.user.email}, (err, foundCourses)=>{
        res.render('game/new.ejs', {'courses': foundCourses});
     });
});

// Delete

// Update
router.put('/:id', (req, res)=>{
    let newStrokes = [];
    let newNotes = [];
    console.log(req.body.completed)
    let gameComplete = req.body.completed === "on" ? true : false;
    console.log(gameComplete);
    for(key in req.body){
        key.includes('strokes')? newStrokes.push(+req.body[key]):key.includes('notes')?newNotes.push(req.body[key]): null;
    }
    Game.findByIdAndUpdate(req.params.id, {strokes: newStrokes, holeNotes: newNotes, complete: gameComplete}, {new: true}, (err, updatedGame)=>{
        if(gameComplete){
            res.redirect('/game')
        }
        else{
        res.redirect('/game/'+req.params.id+'/edit');
        }
    });
});

// Create
router.post('/', (req, res)=>{
    Course.findById(req.body.course, (err, foundCourse)=>{
        let newHoles = [];

        let newGame = new Game({
            course: foundCourse.title,
            courseId: foundCourse._id,
            date: req.body.date,
            pars: foundCourse.pars,
            strokes: new Array(foundCourse.holes),
            holeNotes: new Array(foundCourse.holes),
            gameNotes: '',
            complete: false,
            user: req.oidc.user.email,
        });

        newGame.save((err, savedGame)=>{
            
            console.log(savedGame);
            res.redirect('/game/'+savedGame._id+'/edit')
        });

    });
});

// Edit
router.get('/:id/edit', (req, res)=>{
    Game.findById(req.params.id, (err, foundGame)=>{
        res.render('game/edit.ejs', {'game': foundGame});
    }); 
});

// Show


///////////////////////
// EXPORT
///////////////////////
module.exports = router;
