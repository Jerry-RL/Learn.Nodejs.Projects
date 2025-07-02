import React from 'react';

const Visualize: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-50 to-white">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-blue-100 p-8">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center">Nginx 逻辑可视化</h2>
          <section className="mb-8">
            <h3 className="text-lg font-bold text-blue-700 mb-4">请求处理拓扑图</h3>
            <div className="bg-blue-50 rounded-xl shadow p-6 min-h-[200px] flex items-center justify-center">
              {/* TODO: 集成 TopologyGraph 组件 */}
              <span className="text-gray-400">拓扑图区域</span>
            </div>
          </section>
          <section>
            <h3 className="text-lg font-bold text-blue-700 mb-4">负载均衡动画</h3>
            <div className="bg-blue-50 rounded-xl shadow p-6 min-h-[200px] flex items-center justify-center">
              {/* TODO: 动画演示 Worker 争抢等 */}
              <span className="text-gray-400">动画区域</span>
            </div>
          </section>
        </div>
      </main>
      <footer className="w-full text-center text-gray-400 text-sm py-6 select-none">
        © {new Date().getFullYear()} NginxVision. All rights reserved.
      </footer>
    </div>
  );
};

export default Visualize; 