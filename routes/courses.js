const express = require("express");
const router = express.Router();

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
  { id: 4, name: "course4" },
];

//All courses get request
router.get("/", (req, res) => {
  res.send(courses);
});

//Specific get request for courses using route params as id
router.get("/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course not found");
  res.send(course);
});

//POST verb request
router.post("/", (req, res) => {
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
router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course not found");

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

module.exports = router;
