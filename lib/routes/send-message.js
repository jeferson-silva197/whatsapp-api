// sendMessage.js
const { body, validationResult } = require("express-validator");

const sendMessage = (client) => async (req, res) => {

  console.log(req.body);
  const errors = validationResult(req).formatWith(({ msg }) => msg);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped(),
    });
  }

  const number = req.body.number.replace(/\D/g, "");
  const message = req.body.message;


  if (number < 13) {
    const numberZDG = "55" + number  + "@c.us";
    client
      .sendMessage(numberZDG, message)
      .then((response) => {
        res.status(200).json({
          status: true,
          message: "Mensagem enviada",
          response: response,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: false,
          message: "Mensagem não enviada",
          response: err.text,
        });
      });
  } else if (number >= 13) {
    const numberZDG = number + "@c.us";
    client
      .sendMessage(numberZDG, message)
      .then((response) => {
        res.status(200).json({
          status: true,
          message: "Mensagem enviada",
          response: response,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: false,
          message: "Mensagem não enviada",
          response: err.text,
        });
      });
  }
};

module.exports = sendMessage;
