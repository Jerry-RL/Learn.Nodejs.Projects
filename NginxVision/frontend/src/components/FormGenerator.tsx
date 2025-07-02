import React from 'react';

type Field = {
  label: string;
  type: string;
  value: string;
};

type FormGeneratorProps = {
  fields: Field[];
  onChange: (index: number, value: string) => void;
};

const FormGenerator: React.FC<FormGeneratorProps> = ({ fields, onChange }) => {
  return (
    <form className="space-y-4">
      {fields.map((field, idx) => (
        <div key={idx} className="flex items-center gap-4 bg-blue-50 rounded-xl p-4 shadow">
          <label className="w-40 text-right font-medium text-blue-900" htmlFor={field.label}>{field.label}</label>
          <input
            className="flex-1 border-2 border-blue-200 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            type={field.type}
            value={field.value}
            onChange={e => onChange(idx, e.target.value)}
            aria-label={field.label}
            id={field.label}
          />
        </div>
      ))}
    </form>
  );
};

export default FormGenerator; 