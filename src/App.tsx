import { Routes, Route, useLocation } from "react-router-dom";
import Hotels from "./pages/home/Hotels";
import List from "./pages/list/List";
import Checkout from "./pages/checkout/Checkout";
import { useEffect, useState } from "react";
import Questionnaire from "./pages/questionnaire/Questionnaire";
import Hotel from "./pages/hotel/Hotel";
import { useWebsite } from "./contexts/WebsiteContext";

function App() {
  const location = useLocation();
  const site = useWebsite();
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(() => false);
  }, 500);

  useEffect(() => {
    setLoading(() => true);
  }, [location]);

  return loading ? (
    <span />
  ) : (
    <Routes>
      <Route path="/" element={<Hotels />} />
      <Route path="/results" element={<List />} />
      <Route path={`/${site.t.item_name}`} element={<Hotel />} />
      <Route path="/checkout/*" element={<Checkout />} />
      <Route path="/questionnaire" element={<Questionnaire />} />
    </Routes>
  );
}

export default App;
