import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useReminders = (userId: string) => {
  return useQuery({
    queryKey: ['reminders', userId],
    queryFn: async () => {
      const { data } = await api.get(`/reminders?userId=${userId}`);
      return data;
    },
    refetchInterval: 1000 * 60 * 5,
  });
}; 