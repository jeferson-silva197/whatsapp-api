// app.js (ou index.js)
require('dotenv/config');
const express = require('express');
const http = require('http');
const fileUpload = require('express-fileupload');
const validateApiKey = require('./middlewares/validate-api-key');
const configureSocket = require('./config/socket-server');
const client = require('./config/whatsapp-config');
const sendMessage = require('./routes/send-message');
const { body } = require("express-validator");




// SERVIÇO EXPRESS
const app = express();
const server = http.createServer(app);
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
  res.sendFile("./html/index.html", {
    root: __dirname,
  });
});
// Inicialização do cliente do WhatsApp
client.initialize();

// Configuração do Socket.IO
configureSocket(server, client);

// Rota para envio de mensagem
app.post('/send-message', [body('number').notEmpty(), body('message').notEmpty(), validateApiKey], sendMessage(client));

// EVENTO DE ESCUTA/ENVIO DE MENSAGENS RECEBIDAS PELA API
client.on("message", async (msg) => {
  // console.log('MESSAGE RECEIVED', msg);
  // client.sendMessage(msg.from, 'Mensagem Automática: Teste de automação de Whatsapp API');
});

// Restante do código para inicializar o serviço
server.listen(process.env.PORT || 8000, () => {
  console.log(`Aplicativo rodando na porta *: ${process.env.PORT || 8000}`);
});






 