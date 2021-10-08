///////////////////////
// DEPENDENCIES
///////////////////////
const express = require('express');
const { requiresAuth } = require('express-openid-connect');

///////////////////////
// ROUTER
///////////////////////

const router = express.Router();

///////////////////////
// ROUTES
///////////////////////

router.get('/', (req, res)=>{
    const loggedIn = req.oidc.isAuthenticated() ? true : false;
    console.log(loggedIn)
    res.render('base/index.ejs', {loggedIn: loggedIn})
});

///////////////////////
// EXPORT
///////////////////////
module.exports = router;
