import * as types from "../constants/ActionTypes";
import { messageReceived, populateUsersList } from "../actions";

const setupSocket = (dispatch, username) => {


  const socket = new WebSocket("ws://localhost:5000");

  // called when web socket connection is open
  socket.onopen = () => {
    // send username to server and broadcast
    socket.send(
      JSON.stringify({
        type: types.ADD_USER,
        name: username,
      })
    );
  };

  // called when message received from server
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case types.ADD_MESSAGE:
        dispatch(messageReceived(data.message, data.author));
        break;
      case types.USERS_LIST:
        dispatch(populateUsersList(data.users));
        break;
      default:
        break;
    }
  };
  return socket;
};

export default setupSocket;
