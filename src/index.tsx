import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { sendEvent } from "./util";
import { DesignModeProvider } from "./contexts/DesignModeContext";
import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <RecoilRoot>
    <DesignModeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DesignModeProvider>
  </RecoilRoot>,
);
sendEvent("app/start");
