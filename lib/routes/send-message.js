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

  let number = req.body.number.replace(/\D/g, "");
  const message = req.body.message;

  // Verificar se o número tem DDI
  let ddi = "55";

  if (number.startsWith("55")) {
    number = number.slice(2);
  }

  const ddd = number.slice(0, 2);
  const phone = number.slice(2);

  // Adicionando o '9' após o DDD para números com DDD < 31
  if (parseInt(ddd) < 31 && phone.length === 8) {
    number = ddd + "9" + phone;
  }

  // Removendo o '9' após o DDD para números com DDD >= 30 e 9 dígitos
  if (parseInt(ddd) >= 31 && phone.length === 9) {
    number = ddd + phone.slice(1);
  }

  const numberZDG = ddi + number  + "@c.us";
  console.log(numberZDG);
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
};

module.exports = sendMessage;

