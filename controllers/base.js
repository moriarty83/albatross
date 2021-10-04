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
    res.render('base/index.ejs')
});

///////////////////////
// EXPORT
///////////////////////
module.exports = router;
