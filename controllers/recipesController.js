const db = require("../models");
const client = require('twilio')(
  process.env.TWILIO_ACCOUT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Defining methods for the recipesController
module.exports = {
  findAll: function(req, res) {
    db.Recipe
      .find(req.query)
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.Recipe
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    db.Recipe.findOne({ userEmail: req.body.userEmail }, function (err, user) {
      if (err) {console.log(err)}

      if (user) {
        var newRecipe = {
          title: req.body.recipe.title,
          image: req.body.recipe.image,
          idAPI: req.body.recipe.idAPI,
          summary: req.body.recipe.summary,
          ingredients: req.body.recipe.ingredients,
          instructions: req.body.recipe.instructions,
          notes: ""
        }
    
        db.Recipe.findOneAndUpdate(
          { userEmail: req.body.userEmail },
          { $push : { recipes: newRecipe }}
        )
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
      } else {
        console.log("1", req.body)
        db.Recipe
          .create(req.body)
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err));
      }
    })
  },
  update: function(req, res) {
    let newRecipe = req.body.newData;
    console.log(54, newRecipe)
    db.Recipe
      .findOneAndUpdate({ userEmail: req.body.email, "recipes._id": req.params.id }, 
        { $set: { 
          "recipes.$[title]": newRecipe.title,
          "recipes.$[ingredients]": newRecipe.ingredients,
          "recipes.$[summary]": newRecipe.summary,
          "recipes.$[instructions]": newRecipe.instructions,
          "recipes.$[idAPI]": newRecipe.idAPI,
          "recipes.$[image]": newRecipe.image,
          "recipes.$[notes]": newRecipe.notes
        }}

        )
      .then(dbModel => {
        console.log(59, dbModel);
        res.json(dbModel)
      })
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.Recipe
      .update({ userEmail: req.params.email },
        { $pull: {recipes: { _id: req.params.id}}})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  invite: function(req, res) {
    console.log(`recipesController:invite(): from=${process.env.TWILIO_PHONE_NUMBER}, to=${req.body.to}, body=${req.body.body}`);

    res.header('Content-Type', 'application/json');
    client.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: req.body.to,
      body: req.body.body
    })
    .then(() => {
      res.send(JSON.stringify({ success: true }));
    })
    .catch(err => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
  }
};
