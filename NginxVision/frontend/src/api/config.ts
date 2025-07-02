import axios from 'axios';

export const exportConfig = async (config: any) => {
  // TODO: 调用后端导出接口
  const res = await axios.post('/api/config/export', config);
  return res.data;
};

export const publishConfig = async (config: any) => {
  // TODO: 调用后端发布接口
  const res = await axios.post('/api/config/publish', config);
  return res.data;
}; 