import React from 'react';

const Learn: React.FC = () => {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">配置学习助手</h2>
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">字段解释</h3>
        <div className="bg-white rounded shadow p-4">
          {/* TODO: 悬停显示字段解释 */}
          <p className="text-gray-600">悬停字段可查看详细解释。</p>
        </div>
      </section>
      <section>
        <h3 className="text-lg font-semibold mb-2">Nginx 原理图解</h3>
        <div className="bg-white rounded shadow p-4">
          {/* TODO: 集成原理图/流程图组件 */}
          <p className="text-gray-600">展示 Nginx Master-Worker、请求争抢等原理图。</p>
        </div>
      </section>
    </div>
  );
};

export default Learn; 