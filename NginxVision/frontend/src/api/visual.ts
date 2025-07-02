import axios from 'axios';

export const fetchTopology = async () => {
  // TODO: 获取 Nginx 拓扑数据
  const res = await axios.get('/api/visual/topology');
  return res.data;
}; 