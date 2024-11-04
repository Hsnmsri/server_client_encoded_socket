class ClientHandler {
  constructor(socket, encryptor, onDisconnect) {
    this.socket = socket;
    this.encryptor = encryptor;
    this.onDisconnect = onDisconnect;

    socket.on("data", this.handleData.bind(this));
    socket.on("end", this.handleEnd.bind(this));
    socket.on("error", this.handleError.bind(this));
  }

  handleData(data) {
    try {
      const clientMessage = JSON.parse(data);
      const decryptedMessage = this.encryptor.decrypt(
        clientMessage.encryptedData,
        clientMessage.iv
      );
      console.log(`Client: ${decryptedMessage}`);
    } catch (err) {
      console.error(`Failed to process data: ${err}`);
    }
  }

  handleEnd() {
    this.onDisconnect(this);
  }

  handleError(err) {
    console.error(`Socket error: ${err}`);
  }

  sendMessage(message) {
    this.socket.write(message);
  }
}

module.exports = ClientHandler;
