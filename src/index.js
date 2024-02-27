import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { sendEvent } from "./util";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <RecoilRoot>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </RecoilRoot>,
);
sendEvent("app/start");
