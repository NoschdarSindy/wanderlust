import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import List from "./pages/list/List";
import Checkout from "./pages/checkout/Checkout";
import { useEffect, useState } from "react";
import Questionnaire from "./pages/questionnaire/Questionnaire";
import Detail from "./pages/hotel/Detail";
import { getSite, getImage } from "src/lib/composables";
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

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const showBackdrop = useRecoilValue(showBackdropAtom);
  const s = getSite();
  const favicon = getImage("favicon");
  const itemNames = Object.values(siteData).map((s) => s.item_name);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      if (!s.isStudy)
        sendEvent(`routeChange/${location.pathname + location.search}`);
    }, 500);
  }, [location]);

  useEffect(() => {
    setLoading(true);
  }, [location]);

  return (
    <>
      {!s.isStudy && <Favicon url={favicon} />}
      <div
        id={s.name}
        style={{
          ...(showBackdrop && { pointerEvents: "none", userSelect: "none" }),
          ...(loading && { opacity: 0, pointerEvents: "none" }),
        }}
      >
        <title>{s.title}</title>

        {s.isStudy ? (
          <Routes>
            <Route path="/config" element={<Config />} />
            <Route path="/consent" element={<ConsentForm />} />
            <Route path="/demographics" element={<Demographics />} />
            <Route path="/task" element={<TaskPage />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<List />} />
            {itemNames.map((name) => (
              <Route key={name} path={`/${name}`} element={<Detail />} />
            ))}
            <Route path="/checkout/*" element={<Checkout />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
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
