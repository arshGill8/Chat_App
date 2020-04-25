import reducers from "./reducers";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import handleNewMessage from "./sagas";
import username from "./utils/name";
import  setupSocket  from "./sockets";

const sagaMiddleware = createSagaMiddleware()

const store = createStore(reducers, applyMiddleware(sagaMiddleware));

const socket = setupSocket(store.dispatch,username)

sagaMiddleware.run(handleNewMessage, {socket, username})

export default store;
