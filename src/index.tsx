import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { sendEvent } from "./util";
import { WebsiteProvider } from "./contexts/WebsiteContext";
import { DesignModeProvider } from "./contexts/DesignModeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <RecoilRoot>
    <DesignModeProvider>
      <WebsiteProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WebsiteProvider>
    </DesignModeProvider>
  </RecoilRoot>,
);
sendEvent("app/start");
