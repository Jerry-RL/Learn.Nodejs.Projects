import React from "react";
import UnitConverterForm from "../components/UnitConverterForm";

type Props = { onBack: () => void };

const lengthUnits = [
  { value: "millimeter", label: "Millimeter (mm)" },
  { value: "centimeter", label: "Centimeter (cm)" },
  { value: "meter", label: "Meter (m)" },
  { value: "kilometer", label: "Kilometer (km)" },
  { value: "inch", label: "Inch (in)" },
  { value: "foot", label: "Foot (ft)" },
  { value: "yard", label: "Yard (yd)" },
  { value: "mile", label: "Mile (mi)" },
];

const toMeters = (value: number, unit: string) => {
  switch (unit) {
    case "millimeter": return value / 1000;
    case "centimeter": return value / 100;
    case "meter": return value;
    case "kilometer": return value * 1000;
    case "inch": return value * 0.0254;
    case "foot": return value * 0.3048;
    case "yard": return value * 0.9144;
    case "mile": return value * 1609.344;
    default: return value;
  }
};

const fromMeters = (value: number, unit: string) => {
  switch (unit) {
    case "millimeter": return value * 1000;
    case "centimeter": return value * 100;
    case "meter": return value;
    case "kilometer": return value / 1000;
    case "inch": return value / 0.0254;
    case "foot": return value / 0.3048;
    case "yard": return value / 0.9144;
    case "mile": return value / 1609.344;
    default: return value;
  }
};

const convertLength = (value: number, from: string, to: string) => {
  const meters = toMeters(value, from);
  return fromMeters(meters, to);
};

const LengthConverter: React.FC<Props> = ({ onBack }) => (
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
      units={lengthUnits}
      convertFn={convertLength}
      label="Length"
    />
  </main>
);

export default LengthConverter; 