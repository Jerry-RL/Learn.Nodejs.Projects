import { useState } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  // TODO: 实现登录、登出、注册等逻辑
  return { user, setUser };
}; 