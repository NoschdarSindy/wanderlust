import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.scss";
import { sendEvent } from "src/lib/client";
import { NavigationProvider } from "src/components/NavigationProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RecoilRoot>
    <NavigationProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NavigationProvider>
  </RecoilRoot>,
);

sendEvent("app/start");
