// Dependencies
require("dotenv").config();
const axios = require("axios")
const db = require("../models");
const passport = require("../config/passport");

module.exports = function (app) {

  //! login
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  //! signup
  app.post("/api/signup", function (req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  //! logout
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  //! user_data
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      res.json({});
    } else {
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  //! add-recipe
  app.post("/api/add-recipe", function (req, res) {
    db.Recipe.create({
      title: req.body.title,
      description: req.body.description,
      instructions: req.body.instructions
    })
      .then(function () {

      })
      .catch(function (err) {
        res.status(401).json(err);
      });;
  });

  //! add-ingredient
  app.post("/api/add-ingredient", function (req, res) {
    db.Ingredient.create({
      qty: req.body.qty,
      measurement: req.body.measurement,
      ingredient: req.body.ingredient
    })
      .then(function () {

      })
      .catch(function (err) {
        res.status(401).json(err);
      });;
  });

  // Query 3rd party API and produce random recipe

  app.get("/api/random-recipe", function (req, res) {

    let keys = [process.env.SPOON_API_KEY_1, process.env.SPOON_API_KEY_2, process.env.SPOON_API_KEY_3, process.env.SPOON_API_KEY_4]
    let key = keys[Math.floor(Math.random() * keys.length)]

    axios.get("https://api.spoonacular.com/recipes/random?number=2&tags=dinner&apiKey=" + key)
      .then((response) => {
        res.send(response.data)
      })
      .catch((error) => {
        console.log(error)
      })

  });
};
