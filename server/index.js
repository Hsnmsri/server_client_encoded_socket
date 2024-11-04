const env = require("./env");
const MessageEncryptor = require("./MessageHandler");
const Server = require("./Server");
const UserInterface = require("./UserInterface");

const HOST = "127.0.0.1";
const PORT = 3000;
const encryptionKey = env.encode.key;

const encryptor = new MessageEncryptor(encryptionKey);
const server = new Server(HOST, PORT, encryptor);
const ui = new UserInterface(server);

server.start();
ui.start();
