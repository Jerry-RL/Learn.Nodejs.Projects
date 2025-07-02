import axios from 'axios';

export const generateFormFields = async (input: string) => {
  // TODO: 调用后端 LLM 接口
  const res = await axios.post('/api/llm/generate', { input });
  return res.data;
}; 