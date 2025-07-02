import React from 'react';

const Export: React.FC = () => {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">配置导出与发布</h2>
      <div className="bg-white rounded shadow p-4 flex flex-col gap-4">
        {/* TODO: 导出配置、发布到服务器等功能 */}
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400" tabIndex={0} aria-label="导出配置">
          导出 nginx.conf
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400" tabIndex={0} aria-label="发布配置">
          发布到服务器
        </button>
      </div>
    </div>
  );
};

export default Export; 