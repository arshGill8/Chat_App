const express = require("express");
const WebSocket = require("ws");

const app = express();

const PORT = process.env.PORT || 3000;

const wss = new WebSocket.Server({ port: PORT });

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "/client", "build", "index.html"));
  });
}

const users = [];
// create broadcast function, sends data to all web socket clients besides self
const broadcast = (data, ws) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client !== ws) {
      client.send(JSON.stringify(data));
    }
  });
};

// on connection listen for add user/message events
wss.on("connection", ws => {
  let index;
  ws.on("message", message => {
    const data = JSON.parse(message);
    switch (data.type) {
      case "ADD_USER": {
        index = users.length;
        users.push({ name: data.name, id: index + 1 });
        ws.send(
          JSON.stringify({
            type: "USERS_LIST",
            users,
          })
        );
        //send to client
        broadcast(
          {
            type: "USERS_LIST",
            users,
          },
          ws
        );
        break;
      }

      case "ADD_MESSAGE":
        broadcast(
          {
            type: "ADD_MESSAGE",
            message: data.message,
            author: data.author,
          },
          ws
        );
        break;

      default:
        break;
    }
  });

  ws.on("close", () => {
    users.splice(index, 1);
    broadcast(
      {
        type: "USERS_LIST",
        users,
      },
      ws
    );
  });
});
