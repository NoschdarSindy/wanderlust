import { Routes, Route, useLocation } from "react-router-dom";
import Hotels from "./pages/home/Hotels";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Checkout from "./pages/checkout/Checkout";
import React, { useEffect, useState } from "react";
import Questionnaire from "./pages/questionnaire/Questionnaire";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(() => false);
  }, 500);

  useEffect(() => {
    setLoading(() => true);
  }, [location]);

  return (
    <>
      {loading ? (
        <span></span>
      ) : (
        <Routes>
          <Route path="/" element={<Hotels />} />
          <Route path="/hotel-results" element={<List />} />
          <Route path="/hotel" element={<Hotel />} />
          <Route path="/checkout/*" element={<Checkout />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
        </Routes>
      )}
    </>
  );
}

export default App;
