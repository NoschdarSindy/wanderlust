import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Hotels from "./pages/home/Hotels";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import PersonalDetails from "./pages/personalDetails/PersonalDetails";
import React, { useEffect, useState } from "react";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading((loading) => false);
  }, 500);

  useEffect(() => {
    setLoading((loading) => true);
  }, [location]);

  return (
    <>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <Routes>
          <Route path="/" element={<Hotels />} />
          <Route path="/hotel-results" element={<List />} />
          <Route path="/hotel/:id" element={<Hotel />} />
          <Route path="/your-details" element={<PersonalDetails />} />
          <Route path="/hotel-checkout" element={<Hotel />} />
        </Routes>
      )}
    </>
  );
}

export default App;
