const debug = require("debug")("app:startup");
const config = require("config");
const helmet = require("helmet");
const Joi = require("joi");
const logger = require("./middleware/logger");
const courses = require("./routes/courses");
const home = require("./routes/home");
const express = require("express");
const app = express();

app.set("view engine", "pug");
app.set("views", "./views"); //defaulting it so that all our template resides in this template.

app.use(express.json()); // This particular middleware populates the req.body property
app.use(logger); // Calling the custom middleware function
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
app.use("/api/courses", courses);
app.use("/", home);

debug("Learning debugger....");

//Configuration
debug("Application Name: " + config.get("name"));
debug("Mail Server: " + config.get("mail.host"));
// console.log("Mail Password: " + config.get("mail.password"));

// process.env.NODE_ENV. this sets the environment of the app
// by settng the NODE_ENV=production in the terminal, it sets the enviroment to production
// app.get('env') === 'development also does the same as NODE_ENV under the  hood as used in coding to check foe conditions

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on PORT ${port}`));
