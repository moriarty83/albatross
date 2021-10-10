////////////////////////////
// DEPENDENCIES
////////////////////////////
const express = require('express');

const middleware = require('./util/middleware')

// Auth0 Dependencies
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');

const app = express();


require('dotenv').config();

// AUTH0 CONFIG
const config = {
	authRequired: false,
	auth0Logout: true,
	secret: process.env.AUTH0_CLIENT_SECRET,
	baseURL: 'https://albatross4golf.herokuapp.com/',
	clientID: 'yEqtB27DBHpzdGebqWUsZ8gxEshgG94p',
	issuerBaseURL: 'https://dev-oxzyqg97.us.auth0.com'
  };

////////////////////////////
// PORT
////////////////////////////
// Allow use of Heroku's port or your own local port, depending on the environment

const PORT = process.env.PORT || 3000;

////////////////////////////
// MIDDLEWARE
////////////////////////////
app.use(auth(config))
middleware(app);

// Auth0 Middleware
// auth router attaches /login, /logout, and /callback routes to the baseURL
;


////////////////////////////
// AUTH0 ROUTES
////////////////////////////
//req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
	console.log(req.oidc.user.email);
	res.send(JSON.stringify(req.oidc.user));
  });



////////////////////////////
// LISTENER
////////////////////////////
app.listen(PORT, () => {
    console.log("Hello Seattle, I'm listening on " + PORT);
});