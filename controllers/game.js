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
    const loggedIn = req.oidc.isAuthenticated() ? true : false;
    filter = req.query.filter === "inprogress" ? {user: req.oidc.user.email, complete: false} : req.query.filter === "complete" ? {user: req.oidc.user.email, complete: true} : {user: req.oidc.user.email};
    console.log(filter);
    Game.find(filter, (err, foundGames)=>{
        res.render('game/index.ejs', {'games': foundGames, loggedIn: loggedIn});
     });
})

// New
router.get('/new', (req, res)=>{
    const loggedIn = req.oidc.isAuthenticated() ? true : false;
    Course.find({createdBy: req.oidc.user.email}, (err, foundCourses)=>{
        res.render('game/new.ejs', {'courses': foundCourses, loggedIn: loggedIn});
     });
});

// Delete
router.delete('/:id', (req, res)=>{
    Game.findByIdAndDelete(req.params.id, (err, deletedCourse)=>{
        res.redirect('/game')
    });
});

// Update
router.put('/:id', (req, res)=>{
    // Declare attributes to be sent in update.
    const attributes = {strokes: [], holeNotes : [], gameNotes: '', holeScore:[], totalScore: 0, totalStrokes: 0, complete: false }
    // Is game Complete
    console.log(req.body.gameNotes)
    attributes.complete = req.body.completed === "on" ? true : false;
    attributes.gameNotes = req.body.gameNotes;
    // Populate hole strokes and hole notes.
    for(key in req.body){
        key.includes('strokes')? attributes.strokes.push(+req.body[key]):key.includes('notes')?attributes.holeNotes.push(req.body[key]): null;
    }

    // Totals strokes
    attributes.totalStrokes = attributes.strokes.reduce((a, b) => a + b, 0);

    // Finds game to populate pars and calculate score.
    Game.findById(req.params.id, (err, foundGame)=>{
        for(let i = 0; i < attributes.strokes.length; i++){
            if (attributes.strokes[i] !== 0){
                attributes.holeScore.push((+attributes.strokes[i])-(+foundGame.pars[i]))
            }
        }
        
        // Calculates score for hole.
        attributes.totalScore = attributes.holeScore.reduce((a, b) => a + b, 0);


        // Updates Game
        Game.findByIdAndUpdate(req.params.id, attributes, {new: true}, (err, updatedGame)=>{
            if(attributes.complete || req.body.returnHome === "true"){
                res.redirect('/game/'+req.params.id)
            }
            else{
            res.redirect('/game/'+req.params.id+'/edit');
            }
        });
    })




});

// Create
router.post('/', (req, res)=>{
    Course.findById(req.body.course, (err, foundCourse)=>{
        let newHoles = [];

        let newGame = new Game({
            course: foundCourse.title,
            courseId: foundCourse._id,
            date: req.body.date,
            type: foundCourse.type,
            pars: foundCourse.pars,
            totalPar: foundCourse.pars.reduce((a, b) => a + b, 0),
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
    const loggedIn = req.oidc.isAuthenticated() ? true : false;
    Game.findById(req.params.id, (err, foundGame)=>{
        res.render('game/edit.ejs', {'game': foundGame, loggedIn: loggedIn});
    }); 
});

// Show
router.get('/:id', (req, res)=>{
    const loggedIn = req.oidc.isAuthenticated() ? true : false;
    Game.findById(req.params.id, (err, foundGame)=>{
        res.render('game/show.ejs', {'game': foundGame, loggedIn: loggedIn})
    })
});


///////////////////////
// EXPORT
///////////////////////
module.exports = router;
