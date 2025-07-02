import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-56 h-full bg-white/90 shadow-xl rounded-2xl flex flex-col p-6 gap-6 border border-blue-100">
      <a href="/" className="font-extrabold text-2xl mb-8 text-blue-700 tracking-tight">NginxVision</a>
      <nav className="flex flex-col gap-4">
        <a href="/dynamic-form" className="rounded-full px-4 py-2 font-semibold text-blue-700 hover:bg-blue-100 focus:bg-blue-200 focus:outline-none transition" tabIndex={0} aria-label="动态表单">动态表单</a>
        <a href="/learn" className="rounded-full px-4 py-2 font-semibold text-blue-700 hover:bg-blue-100 focus:bg-blue-200 focus:outline-none transition" tabIndex={0} aria-label="配置学习">配置学习</a>
        <a href="/visualize" className="rounded-full px-4 py-2 font-semibold text-blue-700 hover:bg-blue-100 focus:bg-blue-200 focus:outline-none transition" tabIndex={0} aria-label="可视化">可视化</a>
        <a href="/export" className="rounded-full px-4 py-2 font-semibold text-blue-700 hover:bg-blue-100 focus:bg-blue-200 focus:outline-none transition" tabIndex={0} aria-label="导出发布">导出/发布</a>
      </nav>
    </aside>
  );
};

export default Sidebar; 