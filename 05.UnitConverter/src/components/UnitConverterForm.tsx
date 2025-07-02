import React, { useState } from "react";

type Unit = { value: string; label: string };

type Props = {
  units: Unit[];
  convertFn: (value: number, from: string, to: string) => number;
  label: string;
};

const UnitConverterForm: React.FC<Props> = ({ units, convertFn, label }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<string>(units[0].value);
  const [toUnit, setToUnit] = useState<string>(units[1]?.value || units[0].value);
  const [result, setResult] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Please enter a valid number.");
      return;
    }
    const converted = convertFn(value, fromUnit, toUnit);
    setResult(`${value} ${fromUnit} = ${converted} ${toUnit}`);
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult("");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 space-y-6"
        onSubmit={handleSubmit}
        aria-label={`${label} Converter Form`}
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{label} Converter</h2>
          <p className="text-gray-600 text-sm">Convert between different {label.toLowerCase()} units</p>
        </div>

        {/* Input Value */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700" htmlFor="input-value">
            {label} Value
          </label>
          <input
            id="input-value"
            type="number"
            step="any"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            placeholder="Enter value..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            aria-label={`Input ${label} value`}
            tabIndex={0}
          />
        </div>

        {/* Unit Selection */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="from-unit" className="block text-sm font-semibold text-gray-700">
                From
              </label>
              <select
                id="from-unit"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
                value={fromUnit}
                onChange={e => setFromUnit(e.target.value)}
                aria-label={`Select from ${label} unit`}
                tabIndex={0}
              >
                {units.map(unit => (
                  <option key={unit.value} value={unit.value}>{unit.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="to-unit" className="block text-sm font-semibold text-gray-700">
                To
              </label>
              <select
                id="to-unit"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
                value={toUnit}
                onChange={e => setToUnit(e.target.value)}
                aria-label={`Select to ${label} unit`}
                tabIndex={0}
              >
                {units.map(unit => (
                  <option key={unit.value} value={unit.value}>{unit.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <button
            type="button"
            onClick={handleSwapUnits}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
            aria-label="Swap units"
            tabIndex={0}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Swap Units
          </button>
        </div>

        {/* Convert Button */}
        <button
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
          aria-label="Convert"
          tabIndex={0}
        >
          Convert
        </button>

        {/* Result */}
        {result && (
          <div 
            className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl text-center"
            aria-live="polite"
          >
            <div className="text-lg font-semibold text-gray-800 mb-1">Result</div>
            <div className="text-2xl font-bold text-green-700">{result}</div>
          </div>
        )}
      </form>
    </div>
  );
};

export default UnitConverterForm;