const WebSocket = require("ws");

// create web socket server
const wss = new WebSocket.Server({ port: 8989 });

// create array to hold users
const users = [];

// create broadcast function, sends data to all web socket clients besides self
const broadcast = (data, ws) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== ws) {
      client.send(JSON.stringify(data));
    }
  });
};

// on connection listen for add user/message events
wss.on("connection", (ws) => {
  let index;
  ws.on("message", (message) => {
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
