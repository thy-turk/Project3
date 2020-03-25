const db = require("../models");

// Defining methods for the recipesController
module.exports = {
  findAll: function (req, res) {
    db.User
      .find(req.query)
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findByEmail: function (req, res) {
    db.User
      .findById({ email: email })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function (req, res) {
    console.log(`create req.body = ${JSON.stringify(req.body, null, 2)}`);
    db.User
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      // .catch(err => console.log(err.message));
      .catch(err => res.status(422).json(err));
  },
  findAllContacts: function (req, res) {
    console.log(`findAllContacts: req.params.userEmail = ${req.params.userEmail}`);
    db.User
      .findOne({ email: JSON.parse(req.params.userEmail) })
      .then(dbModel => res.json(dbModel.contacts))
      .catch(err => res.status(422).json(err));
  },
  updateContacts: function (req, res) {
    console.log(`updateContacts: id: ${req.params.id}`);
    db.User.findOne({ email: JSON.parse(req.params.id) }, function (err, user) {
      if (err) { console.log(err) }
      if (user) {
        console.log(`User found: ${JSON.stringify(user)}`);
        var newContact = {
          name: req.body.name,
          mobile: req.body.mobile,
          email: req.body.email
        }
        console.log(`newContact: ${JSON.stringify(newContact)}`);

        // db.User.update({ name: req.params.id, contacts: {$ne: {name: req.body.name}} }, { $addToSet: { contacts: newContact } })
        db.User.findOneAndUpdate({ name: user.name }, { $addToSet: { contacts: newContact } })
          .then(dbModel => {
            res.json(dbModel)
            console.log(`dbModel: ${dbModel}`)
          })
          .catch(err => res.status(422).json(err));
      }
    })
  },
  removeContact: function (req, res) {
    // console.log(`removeContact: id: ${req.params.id}`);
    // console.log(`removeContact: ${req.body}`);
    db.User.findOne({ email: JSON.parse(req.params.id) }, function (err, user) {
      if (err) { console.log(err) }
      if (user) {
        console.log(`User found: ${JSON.stringify(user)}`);
        var newContact = {
          name: req.body.name,
          mobile: req.body.mobile,
          email: req.body.email
        }
        console.log(`removeContact: ${JSON.stringify(newContact)}`);

        db.User.findOneAndUpdate({ _id: user._id }, { $pull: { contacts: newContact } })
          .then(dbModel => {
            res.json(dbModel)
            console.log(`dbModel: ${dbModel}`)
          })
          .catch(err => res.status(422).json(err));
      } else {
        console.log(`Not found: ${req.params.id}`)
      }
    })
  },
update: function (req, res) {
  db.User
    .findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
},
remove: function (req, res) {
  db.User
    .findById({ _id: req.params.id })
    .then(dbModel => dbModel.remove())
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
}
};