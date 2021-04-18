import React from "react";
import Users from "./Users";
import { BrowserRouter } from "react-router-dom";
import AuthorizedUser from "./AuthorizedUser";

const App = () => (
  <BrowserRouter>
    <main>
      <AuthorizedUser />
      <Users />
    </main>
  </BrowserRouter>
);

export default App;
