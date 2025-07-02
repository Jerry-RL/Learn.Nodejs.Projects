import React, { useState, useEffect } from 'react';

const BASE_FIELDS = [
  { label: '监听端口 (listen)', type: 'number', value: '80', key: 'listen', desc: 'Nginx 监听的端口号，通常为 80 或 443。' },
  { label: '服务器名称 (server_name)', type: 'text', value: 'localhost', key: 'server_name', desc: '用于虚拟主机匹配的域名。' },
  { label: '根目录 (root)', type: 'text', value: '/usr/share/nginx/html', key: 'root', desc: '静态资源或网站根目录路径。' },
  { label: '启用 SSL (ssl)', type: 'checkbox', value: '', key: 'ssl', desc: '是否启用 HTTPS/SSL。' },
];
const PROXY_FIELDS = [
  { label: '反向代理地址 (proxy_pass)', type: 'text', value: '', key: 'proxy_pass', desc: '如需反向代理，请填写后端服务地址。' },
];

const DynamicForm: React.FC = () => {
  const [baseFields, setBaseFields] = useState<typeof BASE_FIELDS>([]);
  const [proxyFields, setProxyFields] = useState<typeof PROXY_FIELDS>([]);

  useEffect(() => {
    setBaseFields(BASE_FIELDS);
    setProxyFields(PROXY_FIELDS);
  }, []);

  const handleFieldChange = (
    idx: number,
    value: string | boolean,
    group: 'base' | 'proxy'
  ) => {
    if (group === 'base') {
      setBaseFields(fields =>
        fields.map((f, i) =>
          i === idx ? { ...f, value: typeof value === 'boolean' ? (value ? 'on' : '') : value } : f
        )
      );
    } else {
      setProxyFields(fields =>
        fields.map((f, i) =>
          i === idx ? { ...f, value: typeof value === 'boolean' ? (value ? 'on' : '') : value } : f
        )
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-50 to-white">
      <header className="w-full flex justify-center pt-10">
        <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight drop-shadow-lg select-none">Nginx 配置生成器</h1>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <form className="w-full max-w-2xl">
          {/* 基础设置分组 */}
          <section className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-8 mb-10 border border-blue-100/60">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xl shadow"><svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeWidth="2" d="M10 2v16m8-8H2"/></svg></span>
              <h2 className="text-xl font-bold text-blue-700">基础设置</h2>
            </div>
            <div className="italic text-blue-300 mb-6 text-sm">常用 Nginx 基础参数，适用于大多数场景。</div>
            {baseFields.map((field, idx) => (
              <div key={field.key} className="flex flex-col sm:flex-row items-center gap-6 mb-8 last:mb-0">
                <div className="w-full sm:w-44 text-right font-semibold text-blue-900 text-base mb-2 sm:mb-0 select-none">
                  {field.label}
                  <span className="block text-xs text-blue-300 font-normal mt-1 sm:hidden">{field.desc}</span>
                </div>
                {field.type === 'checkbox' ? (
                  <input
                    id={field.key}
                    className="w-7 h-7 accent-blue-600 rounded-lg border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 transition duration-150 shadow-sm hover:scale-110"
                    type="checkbox"
                    checked={!!field.value}
                    onChange={e => handleFieldChange(idx, e.target.checked, 'base')}
                  />
                ) : (
                  <input
                    id={field.key}
                    className="flex-1 border-2 border-blue-200 rounded-full px-6 py-3 text-lg bg-blue-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-inner transition-all duration-200 placeholder:italic placeholder:text-blue-300 hover:border-blue-400"
                    type={field.type}
                    value={field.value}
                    onChange={e => handleFieldChange(idx, e.target.value, 'base')}
                    placeholder={field.label}
                  />
                )}
                <span className="hidden sm:block w-56 text-xs text-blue-300 font-normal">{field.desc}</span>
              </div>
            ))}
          </section>
          {/* 反向代理分组 */}
          <section className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-8 mb-10 border border-blue-100/60">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xl shadow"><svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeWidth="2" d="M15 5l-10 10m0-10l10 10"/></svg></span>
              <h2 className="text-xl font-bold text-blue-700">反向代理</h2>
            </div>
            <div className="italic text-blue-300 mb-6 text-sm">如需将请求转发到后端服务，请填写下方代理地址。</div>
            {proxyFields.map((field, idx) => (
              <div key={field.key} className="flex flex-col sm:flex-row items-center gap-6 mb-8 last:mb-0">
                <div className="w-full sm:w-44 text-right font-semibold text-blue-900 text-base mb-2 sm:mb-0 select-none">
                  {field.label}
                  <span className="block text-xs text-blue-300 font-normal mt-1 sm:hidden">{field.desc}</span>
                </div>
                <input
                  id={field.key}
                  className="flex-1 border-2 border-blue-200 rounded-full px-6 py-3 text-lg bg-blue-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-inner transition-all duration-200 placeholder:italic placeholder:text-blue-300 hover:border-blue-400"
                  type={field.type}
                  value={field.value}
                  onChange={e => handleFieldChange(idx, e.target.value, 'proxy')}
                  placeholder={field.label}
                />
                <span className="hidden sm:block w-56 text-xs text-blue-300 font-normal">{field.desc}</span>
              </div>
            ))}
          </section>
          {/* 操作栏 */}
          <div className="flex justify-end gap-4 mt-8 border-t pt-6">
            <button type="reset" className="rounded-full px-8 py-3 text-lg font-bold shadow bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:scale-105 transition">重置</button>
            <button type="submit" className="rounded-full px-8 py-3 text-lg font-bold shadow bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:scale-105 transition">导出配置</button>
          </div>
        </form>
      </main>
      <footer className="w-full text-center text-gray-400 text-sm py-6 select-none">
        © {new Date().getFullYear()} NginxVision. All rights reserved.
      </footer>
    </div>
  );
};

export default DynamicForm;
