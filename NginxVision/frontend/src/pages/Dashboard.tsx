import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">NginxVision 仪表盘</h1>
      <p className="text-lg text-gray-600 mb-8">欢迎使用 Nginx 可视化配置器！请选择功能模块：</p>
      <nav className="flex flex-col gap-4 w-full max-w-xs">
        <a href="/dynamic-form" className="block p-4 rounded bg-white shadow hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" tabIndex={0} aria-label="动态表单">动态表单生成</a>
        <a href="/learn" className="block p-4 rounded bg-white shadow hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" tabIndex={0} aria-label="配置学习">配置学习助手</a>
        <a href="/visualize" className="block p-4 rounded bg-white shadow hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" tabIndex={0} aria-label="可视化">Nginx 逻辑可视化</a>
        <a href="/export" className="block p-4 rounded bg-white shadow hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" tabIndex={0} aria-label="导出发布">配置导出/发布</a>
      </nav>
    </div>
  );
};

export default Dashboard; 