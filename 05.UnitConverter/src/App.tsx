import React, { useState } from "react";
import Home from "./pages/Home";
import LengthConverter from "./pages/LengthConverter";
import TemperatureConverter from "./pages/TemperatureConverter";
import WeightConverter from "./pages/WeightConverter";

type Page = "home" | "length" | "weight" | "temperature";

const App: React.FC = () => {
  const [page, setPage] = useState<Page>("home");

  if (page === "length") return <LengthConverter onBack={() => setPage("home")} />;
  if (page === "weight") return <WeightConverter onBack={() => setPage("home")} />;
  if (page === "temperature") return <TemperatureConverter onBack={() => setPage("home")} />;
  return <Home onNavigate={setPage} />;
};

export default App; 