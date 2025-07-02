import React, { ReactNode, useState } from 'react';

type FieldTooltipProps = {
  label: string;
  description: string;
  children: ReactNode;
};

const FieldTooltip: React.FC<FieldTooltipProps> = ({ label, description, children }) => {
  const [show, setShow] = useState(false);
  return (
    <span className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span className="absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 bg-gray-900/90 text-white text-xs rounded-lg px-3 py-2 z-20 shadow-lg border border-blue-500">
          <strong className="text-blue-400">{label}：</strong>{description}
        </span>
      )}
    </span>
  );
};

export default FieldTooltip; 