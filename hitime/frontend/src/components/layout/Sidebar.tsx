import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => (
  <aside className="w-64 bg-white dark:bg-gray-800 shadow flex flex-col p-4">
    <h2 className="text-xl font-bold mb-6">HiTime</h2>
    <nav className="flex flex-col gap-2 mb-6">
      <Link to="/" className="rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">日历</Link>
      <Link to="/settings" className="rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">设置</Link>
    </nav>
    <button className="mt-auto bg-primary text-white rounded-xl py-2 px-4 shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary">
      + 添加事件
    </button>
  </aside>
);

export default Sidebar; 