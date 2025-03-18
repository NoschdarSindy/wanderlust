import { Routes, Route, useLocation } from "react-router-dom";
import { WebsiteProvider } from "./contexts/WebsiteContext";
import { DesignModeProvider } from "./contexts/DesignModeContext";
import Hotels from "./pages/home/Hotels";
import Flights from "./pages/home/Flights";
import CarRentals from "./pages/home/CarRentals";
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
    <DesignModeProvider>
      <WebsiteProvider>
        {loading ? (
          <span></span>
        ) : (
          <Routes>
            <Route path="/" element={<Hotels />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/car-rentals" element={<CarRentals />} />
            <Route path="/results" element={<List />} />
            <Route path="/details" element={<List />} />
            <Route path="/checkout/*" element={<Checkout />} /> {/* Added Checkout route */}
            <Route path="/questionnaire" element={<Questionnaire />} />
          </Routes>
        )}
      </WebsiteProvider>
    </DesignModeProvider>
  );
}

export default App;