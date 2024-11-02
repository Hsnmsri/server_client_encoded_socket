const net = require("net");
const readline = require("readline");
const encription = require("../Encryption");
const app = require("./app");

const PORT = 3000;
const HOST = "127.0.0.1";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const encriptionObj = new encription.AppSecurity(app.env.encode.key);

// Store connected clients in an array
const clients = [];

// Create a TCP server
const server = net.createServer((socket) => {
  console.log("Client connected");
  clients.push(socket);

  // Handle data received from the client
  socket.on("data", (data) => {
    const clientMessage = JSON.parse(data);
    const decryptedMessage = encriptionObj.decryptString(
      clientMessage.encryptedData,
      clientMessage.iv
    );
    console.log(`Client : ${decryptedMessage}`);
  });

  // Remove client from array when they disconnect
  socket.on("end", () => {
    console.log("Client disconnected");
    clients.splice(clients.indexOf(socket), 1);
  });

  // Handle socket errors
  socket.on("error", (err) => {
    console.error(`Socket error: ${err}`);
  });
});

// Send a message from the server to all connected clients
function broadcastMessage(message) {
  clients.forEach((client) => {
    client.write(`${message}`);
  });
}

// Prompt the user for messages to send to clients
function promptMessage() {
  rl.question("Enter message to send to clients: ", (message) => {
    broadcastMessage(message);
    promptMessage(); // Call again to continue prompting for messages
  });
}

// Start listening on the specified host and port
server.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
  promptMessage(); // Start the prompt loop
});

// Handle server errors
server.on("error", (err) => {
  console.error(`Server error: ${err}`);
});
