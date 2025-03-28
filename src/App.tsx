import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import List from "./pages/list/List";
import Checkout from "./pages/checkout/Checkout";
import { useEffect, useState } from "react";
import Questionnaire from "./pages/questionnaire/Questionnaire";
import Hotel from "./pages/hotel/Hotel";
import { useSite } from "./contexts/WebsiteContext";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
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
    <div id={s.name}>
      <title>{s.title}</title>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<List />} />
        <Route path={`/${s.item_name}`} element={<Hotel />} />
        <Route path="/checkout/*" element={<Checkout />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
      </Routes>
    </div>
  );
}

export default App;
