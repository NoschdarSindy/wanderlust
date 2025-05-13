import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import List from "./pages/list/List";
import Checkout from "./pages/checkout/Checkout";
import { useEffect } from "react";
import Questionnaire from "./pages/questionnaire/Questionnaire";
import Detail from "./pages/hotel/Detail";
import { getImage, getSite } from "src/lib/composables";
import { showBackdropAtom } from "src/lib/atoms";
import { useRecoilValue } from "recoil";
import { Backdrop } from "@mui/material";
import { sendEvent } from "src/lib/client";
import Config from "src/pages/Config";
import ConsentForm from "src/pages/Consent";
import Demographics from "src/pages/Demographics";
import TaskPage from "src/pages/Task";
import Favicon from "react-favicon";
import siteData from "src/lib/siteData";
import Success from "src/pages/success/Success";
import ScrollToTop from "src/components/ScrollToTop";

function App() {
  const location = useLocation();
  const showBackdrop = useRecoilValue(showBackdropAtom);
  const s = getSite();
  const itemNames = Object.values(siteData).map((s) => s.item_name);

  useEffect(() => {
    if (!s.isStudy) {
      sendEvent(`routeChange/${location.pathname.split("/").pop()}`);
    }
  }, [location, s.isStudy]);

  return (
    <>
      <ScrollToTop />
      {!s.isStudy && <Favicon url={getImage("favicon")} />}
      <div
        id={s.name}
        style={{
          ...(showBackdrop && { pointerEvents: "none", userSelect: "none" }),
          position: "relative",
        }}
      >
        <title>{s.title}</title>
        {s.isStudy ? (
          <Routes>
            <Route path="/" element={<Config />} />
            <Route path="/consent" element={<ConsentForm />} />
            <Route path="/demographics" element={<Demographics />} />
            <Route path="/task" element={<TaskPage />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<List />} />
            {itemNames.map((name) => (
              <Route key={name} path={`/${name}`} element={<Detail />} />
            ))}
            <Route path="/checkout/*" element={<Checkout />} />
            <Route path="/summary" element={<Detail />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        )}
        <Backdrop
          transitionDuration={500}
          sx={{
            color: "#777",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={showBackdrop}
          onClick={() => {}}
        />
      </div>
    </>
  );
}

export default App;
