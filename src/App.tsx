import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import List from "./pages/list/List";
import Checkout from "./pages/checkout/Checkout";
import { useEffect, useState } from "react";
import Questionnaire from "./pages/questionnaire/Questionnaire";
import Hotel from "./pages/hotel/Hotel";
import { useSite } from "src/lib/composables";
import { showBackdropAtom } from "src/lib/atoms";
import { useRecoilValue } from "recoil";
import { Backdrop } from "@mui/material";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const showBackdrop = useRecoilValue(showBackdropAtom);
  const s = useSite();

  setTimeout(() => {
    setLoading(() => false);
  }, 500);

  useEffect(() => {
    setLoading(() => true);
  }, [location]);

  return loading ? (
    <span />
  ) : (
    <div
      id={s.name}
      style={{
        ...(showBackdrop && { pointerEvents: "none", userSelect: "none" }),
      }}
    >
      <title>{s.title}</title>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<List />} />
        <Route path={`/${s.item_name}`} element={<Hotel />} />
        <Route path="/checkout/*" element={<Checkout />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
      </Routes>

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
  );
}

export default App;
