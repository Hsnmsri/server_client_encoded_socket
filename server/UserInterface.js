const readline = require("readline");

class UserInterface {
  constructor(server) {
    this.server = server;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  promptMessage() {
    this.rl.question("Enter message to send to clients: ", (message) => {
      this.server.broadcastMessage(message);
      this.promptMessage();
    });
  }

  start() {
    this.promptMessage();
  }
}

module.exports = UserInterface;
