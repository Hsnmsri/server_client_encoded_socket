const net = require("net");
const ClientHandler = require("./ClientHandler");

class Server {
  constructor(host, port, encryptor) {
    this.host = host;
    this.port = port;
    this.clients = [];
    this.encryptor = encryptor;
    this.server = net.createServer(this.handleConnection.bind(this));
  }

  handleConnection(socket) {
    const clientHandler = new ClientHandler(
      socket,
      this.encryptor,
      this.removeClient.bind(this)
    );
    this.clients.push(clientHandler);
    console.log("Client connected");
  }

  removeClient(clientHandler) {
    this.clients = this.clients.filter((client) => client !== clientHandler);
    console.log("Client disconnected");
  }

  broadcastMessage(message) {
    this.clients.forEach((client) => client.sendMessage(message));
  }

  start() {
    this.server.listen(this.port, this.host, () => {
      console.log(`Server listening on ${this.host}:${this.port}`);
    });

    this.server.on("error", (err) => {
      console.error(`Server error: ${err}`);
    });
  }
}

module.exports = Server;
