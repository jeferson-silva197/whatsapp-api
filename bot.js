// BACKEND DA API
// BIBLIOTECAS UTILIZADAS PARA COMPOSIÇÃO DA API
const { Client, LocalAuth } = require("whatsapp-web.js");
const express = require("express");
const { body, validationResult } = require("express-validator");
const socketIO = require("socket.io");
const qrcode = require("qrcode");
const http = require("http");
const fileUpload = require("express-fileupload");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// PORTA ONDE O SERVIÇO SERÁ INICIADO
const port = 8000;
const idClient = "teste";

// SERVIÇO EXPRESS
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  fileUpload({
    debug: true,
  })
);
app.use("/", express.static(__dirname + "/"));
app.get("/", (req, res) => {
  res.sendFile("index.html", {
    root: __dirname,
  });
});

// PARÂMETROS DO CLIENT DO WPP
const client = new Client({
  authStrategy: new LocalAuth({ clientId: idClient }),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
  },
});

// INITIALIZE DO CLIENT DO WPP
client.initialize();

// EVENTOS DE CONEXÃO EXPORTADOS PARA O INDEX.HTML VIA SOCKET
io.on("connection", function (socket) {
  socket.emit("message", "Iniciado");
  socket.emit("qr", "./images/icon.svg");

  client.on("qr", (qr) => {
    console.log("QR RECEIVED", qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit("qr", url);
      socket.emit("message", "QRCode recebido, aponte a câmera  seu celular!");
    });
  });

  client.on("ready", () => {
    socket.emit("ready", "Dispositivo pronto!");
    socket.emit("message", "Dispositivo pronto!");
    socket.emit("qr", "./images/check.svg");
    console.log("Dispositivo pronto");
  });

  client.on("authenticated", () => {
    socket.emit("authenticated", "Autenticado!");
    socket.emit("message", "Autenticado!");
    console.log("Autenticado");
  });

  client.on("auth_failure", function () {
    socket.emit("message", "Falha na autenticação, reiniciando...");
    console.error("Falha na autenticação");
  });

  client.on("change_state", (state) => {
    console.log("Status de conexão: ", state);
  });

  client.on("disconnected", (reason) => {
    socket.emit("message", "Cliente desconectado!");
    console.log("Cliente desconectado", reason);
    client.initialize();
  });
});

// POST PARA ENVIO DE MENSAGEM
app.post(
  "/send-message",
  [body("number").notEmpty(), body("message").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req).formatWith(({ msg }) => {
      return msg;
    });

    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: errors.mapped(),
      });
    }

    const number = req.body.number.replace(/\D/g, "");
    const numberFormmated = "55" + number + "@c.us";

    client
      .sendMessage(numberFormmated, message)
      .then((response) => {
        res.status(200).json({
          status: true,
          message: " Mensagem enviada",
          response: response,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: false,
          message: " Mensagem não enviada",
          response: err.text,
        });
      });
  }
);

// EVENTO DE ESCUTA/ENVIO DE MENSAGENS RECEBIDAS PELA API
/*client.on("message", async (msg) => {});*/

// INITIALIZE DO SERVIÇO
server.listen(port, function () {
  console.log("Aplicativo rodando na porta: " + port);
});
