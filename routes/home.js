const express = require("express");
const Express = require("express");
const router = Express.Router();

//HOME get request
router.get("/", (req, res) => {
  res.render("index", { title: "My Express App", message: "Hello" });
});

module.exports = router;
