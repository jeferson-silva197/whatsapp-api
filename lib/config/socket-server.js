// socketServer.js
const socketIO = require("socket.io");
const qrcode = require("qrcode");

const configureSocket = (server, client) => {
  const io = socketIO(server);

  io.on("connection", (socket) => {
    socket.emit("message", "Conectando...");
    socket.emit("qr", "./images/uncheck.svg");

    client.on("qr", (qr) => {
      console.log("QR RECEIVED", qr);
      qrcode.toDataURL(qr, (err, url) => {
        socket.emit("qr", url);
        socket.emit(
          "message",
          "QRCode recebido, aponte a câmera  seu celular!"
        );
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
};

module.exports = configureSocket;
