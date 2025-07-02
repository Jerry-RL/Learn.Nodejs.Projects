import React from 'react';

const LogPanel: React.FC = () => {
  return (
    <div className="w-full h-48 bg-gray-900/95 text-green-200 font-mono p-6 rounded-xl shadow-inner text-base overflow-auto">
      {/* TODO: 日志内容展示 */}
      <span className="text-gray-500">日志内容区域</span>
    </div>
  );
};

export default LogPanel; 