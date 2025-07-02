import React from "react";
import UnitConverterForm from "../components/UnitConverterForm";

type Props = { onBack: () => void };

const weightUnits = [
  { value: "milligram", label: "Milligram (mg)" },
  { value: "gram", label: "Gram (g)" },
  { value: "kilogram", label: "Kilogram (kg)" },
  { value: "ounce", label: "Ounce (oz)" },
  { value: "pound", label: "Pound (lb)" },
];

const toKilograms = (value: number, unit: string) => {
  switch (unit) {
    case "milligram": return value / 1e6;
    case "gram": return value / 1000;
    case "kilogram": return value;
    case "ounce": return value * 0.0283495;
    case "pound": return value * 0.453592;
    default: return value;
  }
};

const fromKilograms = (value: number, unit: string) => {
  switch (unit) {
    case "milligram": return value * 1e6;
    case "gram": return value * 1000;
    case "kilogram": return value;
    case "ounce": return value / 0.0283495;
    case "pound": return value / 0.453592;
    default: return value;
  }
};

const convertWeight = (value: number, from: string, to: string) => {
  const kg = toKilograms(value, from);
  return fromKilograms(kg, to);
};

const WeightConverter: React.FC<Props> = ({ onBack }) => (
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
      units={weightUnits}
      convertFn={convertWeight}
      label="Weight"
    />
  </main>
);

export default WeightConverter; 