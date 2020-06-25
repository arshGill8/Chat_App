import React from "react";
import "./App.css";
import { AddMessage } from "./containers/AddMessage";
import { MessagesList } from "./containers/MessagesList";
import { Sidebar } from "./containers/Sidebar";

const App = () => (
  <div id="container">
    <Sidebar />
    <section id="main">
      <MessagesList />
      <AddMessage />
    </section>
  </div>
);

export default App;
