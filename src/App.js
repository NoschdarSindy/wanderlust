import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import ScrollToTop from "./components/ScrollToTop";
import React, { useEffect, useState } from "react";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const handleClick = async () => {
    const response = await fetch("http://127.0.0.1:8000");
    const json = await response.json();
    console.log(json);
  };

  setTimeout(() => {
    setLoading((loading) => false);
  }, 500);

  useEffect(() => {
    setLoading((loading) => true);
  }, [location]);

  return (
    <>
      <button onClick={handleClick}>Test</button>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<List />} />
          <Route path="/hotel/:id" element={<Hotel />} />
        </Routes>
      )}
    </>
  );
}

export default App;
