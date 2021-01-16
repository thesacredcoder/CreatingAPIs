const config = require("config");
const helmet = require("helmet");
const Joi = require("joi");
const logger = require("./logger");
const express = require("express");
const app = express();

app.use(express.json()); // This particular middleware populates the req.body property
app.use(logger); // Calling the custom middleware function
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

//Configuration
console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
// console.log("Mail Password: " + config.get("mail.password"));

// process.env.NODE_ENV. this sets the environment of the app
// by settng the NODE_ENV=production in the terminal, it sets the enviroment to production
// app.get('env') === 'development also does the same as NODE_ENV under the  hood as used in coding to check foe conditions

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
  { id: 4, name: "course4" },
];

//HOME get request
app.get("/", (req, res) => {
  res.send("Hello World!!!!");
});

//All courses get request
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

//Specific get request for courses using route params as id
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course not found");
  res.send(course);
});

//POST verb request
app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);

  if (error) {
    // 400 Bad Request
    res.status(400).send(error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

//UPDATION verb request
app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course not found");

  //Validate
  const { error } = validateCourse(req.body); // this is result.error but destructured

  if (error) {
    // 400 Bad Request
    res.status(400).send(error.details[0].message);
    return;
  }

  course.name = req.body.name;
  res.send(course);
});

//Validation function to make the code readable and presentable
function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course not found");

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on PORT ${port}`));
