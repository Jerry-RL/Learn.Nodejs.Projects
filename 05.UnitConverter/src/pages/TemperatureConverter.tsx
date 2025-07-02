import React from "react";
import UnitConverterForm from "../components/UnitConverterForm";

type Props = { onBack: () => void };

const temperatureUnits = [
  { value: "celsius", label: "Celsius (°C)" },
  { value: "fahrenheit", label: "Fahrenheit (°F)" },
  { value: "kelvin", label: "Kelvin (K)" },
];

const convertTemperature = (value: number, from: string, to: string) => {
  if (from === to) return value;
  // Convert from -> Celsius
  let celsius = value;
  if (from === "fahrenheit") celsius = (value - 32) * (5 / 9);
  if (from === "kelvin") celsius = value - 273.15;
  // Celsius -> to
  if (to === "celsius") return celsius;
  if (to === "fahrenheit") return celsius * (9 / 5) + 32;
  if (to === "kelvin") return celsius + 273.15;
  return value;
};

const TemperatureConverter: React.FC<Props> = ({ onBack }) => (
  <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <button
      className="self-start ml-4 mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
      onClick={onBack}
      tabIndex={0}
      aria-label="Back to Home"
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onBack(); }}
    >
      ← Back
    </button>
    <UnitConverterForm
      units={temperatureUnits}
      convertFn={convertTemperature}
      label="Temperature"
    />
  </main>
);

export default TemperatureConverter; 