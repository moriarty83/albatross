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
router.get('/new', requiresAuth(), (req, res)=>{
    const loggedIn = req.oidc.isAuthenticated() ? true : false;
    Course.find({createdBy: req.oidc.user.email}, (err, foundCourses)=>{
        res.render('game/new.ejs', {'courses': foundCourses, loggedIn: loggedIn});
     });
});

// Delete
router.delete('/:id', requiresAuth(), (req, res)=>{
    Game.findByIdAndDelete(req.params.id, (err, deletedCourse)=>{
        res.redirect('/game')
    });
});

// Update
router.put('/:id', requiresAuth(), (req, res)=>{
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

        let totalGames = 0;
        let avgTotalScore = 0;
        let avgStrokes = []

            Game.find({courseId: foundGame.courseId, complete: true}, (err, foundGames)=>{
                if(attributes.complete === true){
                    console.log(foundGames.length)
                    totalGames = foundGames.length + 1;
                    console.log(totalGames);

                    for(let i = 0; i < attributes.holeScore.length; i++){
                        let avg = 0;
                        for(game of foundGames){
                            console.log(`Game Score: ${game.totalScore}`)

                            avgTotalScore = +avgTotalScore + (+game.totalScore);
                            console.log(`avgTotalScore: ${avgTotalScore}`)
                            avg = avg + game.strokes[i]
                        }

                        
                        avgTotalScore = ((avgTotalScore + attributes.totalScore)/totalGames).toFixed(2);
                        avg = avg + attributes.strokes[i];
                        avg = (avg/totalGames).toFixed(1);
                        avgStrokes.push(avg);

                        console.log(totalGames)
                        console.log("AvgTotal")
                        console.log(avgTotalScore)
                        console.log(avgStrokes.length)

                    }
                    Course.findByIdAndUpdate(foundGame.courseId, {gamesPlayed: totalGames, averageStrokes: avgStrokes, averageTotalScore: avgTotalScore, lastTotalScore: attributes.totalScore, lastStrokes: attributes.strokes}, {new: true}, (err, updatedCourse)=>{
                    });  
                }

            });
            
        


        // Updates Game
        Game.findByIdAndUpdate(req.params.id, attributes, {new: true}, (err, updatedGame)=>{
            if(attributes.complete === true){

            }
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
router.post('/', requiresAuth(), (req, res)=>{
    Course.findById(req.body.course, (err, foundCourse)=>{
        let newHoles = [];
        

        let newGame = new Game({
            course: foundCourse.title,
            courseId: foundCourse._id,
            date: req.body.date !== undefined ? req.body.date : Date.now(),
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
router.get('/:id/edit', requiresAuth(), (req, res)=>{
    const loggedIn = req.oidc.isAuthenticated() ? true : false;
    Game.findById(req.params.id, (err, foundGame)=>{
        Course.findById(foundGame.courseId, (err, foundCourse)=>{
            res.render('game/edit.ejs', {'game': foundGame, 'course': foundCourse, loggedIn: loggedIn});
        });
    }); 
});

// Show
router.get('/:id', requiresAuth(), (req, res)=>{
    const loggedIn = req.oidc.isAuthenticated() ? true : false;
    Game.findById(req.params.id, (err, foundGame)=>{
        res.render('game/show.ejs', {'game': foundGame, loggedIn: loggedIn})
    })
});


///////////////////////
// EXPORT
///////////////////////
module.exports = router;
