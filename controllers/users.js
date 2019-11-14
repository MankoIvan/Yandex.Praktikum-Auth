const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(404);
        res.send({ message: `Нет пользователя с таким id: ${id}` });
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  // eslint-disable-next-line object-curly-newline
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    // eslint-disable-next-line object-curly-newline
    .then((hash) => User.create({ name, about, avatar, email, hash }))
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "super-strong-secret", { expiresIn: "7d" });
      res.cookie("jwt", token, {
        maxAge: 3600000,
        httpOnly: true,
      })
        .end();
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
