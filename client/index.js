const net = require("net");
const readline = require("readline");
const encription = require("../Encryption");
const app = require("./app");

const PORT = 3000;
const HOST = "127.0.0.1";

const encriptionObj = new encription.AppSecurity(app.env.encode.key);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptMessage() {
  rl.question("Message: ", (message) => {
    // disconnect client
    if (message == "!exit") {
      rl.close();
      client.destroy();
      process.exit(0);
    }

    let clientMessage = encriptionObj.encryptString(message);
    client.write(JSON.stringify(clientMessage));
    promptMessage();
  });
}

// Create the client and connect to the server
const client = net.createConnection({ host: HOST, port: PORT }, () => {
  console.log("Connected to server");
  promptMessage();
});

// Handle data received from the server
client.on("data", (data) => {
  console.log(`\nServer : ${data}`);
  promptMessage();
});

// Handle client disconnection
client.on("end", () => {
  console.log("Disconnected from server");
  rl.close(); // Close readline interface when the client is disconnected
});

// Handle errors
client.on("error", (err) => {
  console.error(`Client error: ${err.message}`);
  rl.close(); // Close readline interface on error
});
