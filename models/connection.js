//////////////////////////
// DEPENDENCIES
//////////////////////////
require('dotenv').config();
const mongoose = require('mongoose');

//////////////////////////
// CONNECTION
//////////////////////////
const DATABASE_URI = process.env.DATABASE_URI;
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

// Connect
mongoose.connect(DATABASE_URI, CONFIG);

// Logs
mongoose.connection
.on("open", () => console.log("Connected to Mongoose"))
.on("close", () => console.log("Disconnected from Mongoose"))
.on("error", (error) => console.log(error))

//////////////////////////
// EXPORT
//////////////////////////
module.exports = mongoose;