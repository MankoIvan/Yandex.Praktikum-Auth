const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (card) {
        if (card.owner.toString() === req.user._id) {
          Card.findByIdAndRemove(cardId)
            .then((deletedCard) => res.send(deletedCard))
            .catch((err) => res.status(500).send({ message: err.message }));
        } else {
          res.send({ message: "Вы не можете удалять чужие карточки" });
        }
      } else {
        res.send({ message: "Эта карточка не найдена" });
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
