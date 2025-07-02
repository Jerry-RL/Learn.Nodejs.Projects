import React from "react";

type Props = {
  onNavigate: (page: "length" | "weight" | "temperature") => void;
};

const Home: React.FC<Props> = ({ onNavigate }) => (
  <main className="flex flex-col items-center justify-center min-h-screen gap-8 bg-gray-50">
    <h1 className="text-3xl font-bold mb-8">Unit Converter</h1>
    <div className="flex flex-col gap-4 w-64">
      <button
        className="py-3 px-4 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => onNavigate("length")}
        tabIndex={0}
        aria-label="Go to Length Converter"
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onNavigate("length"); }}
      >
        Length Converter
      </button>
      <button
        className="py-3 px-4 rounded bg-green-600 text-white font-semibold shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        onClick={() => onNavigate("weight")}
        tabIndex={0}
        aria-label="Go to Weight Converter"
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onNavigate("weight"); }}
      >
        Weight Converter
      </button>
      <button
        className="py-3 px-4 rounded bg-yellow-600 text-white font-semibold shadow hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        onClick={() => onNavigate("temperature")}
        tabIndex={0}
        aria-label="Go to Temperature Converter"
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onNavigate("temperature"); }}
      >
        Temperature Converter
      </button>
    </div>
  </main>
);

export default Home;