require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');

const session = require('express-session');
const MongoStore = require('connect-mongo');

// Auth0 Dependencies
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');

// Routers
const MycoursesRouter = require('../controllers/mycourses');




/////////////////////////////////////
// MiddleWare Function
//////////////////////////////////////
const middleware = (app) => {
    app.use(morgan("tiny"));
    app.use(methodOverride("_method"));
    app.use(express.urlencoded({extended: true}));
    app.use(express.static('public'));
    app.use(express.json());
    // TODO: app.use session stuff

    app.use('/mycourses', MycoursesRouter);
}

module.exports = middleware;