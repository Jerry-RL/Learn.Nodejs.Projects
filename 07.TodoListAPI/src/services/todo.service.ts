import { prisma } from '../db/prisma';

export const createTodo = async (userId: number, title: string, description: string) => {
  return prisma.todo.create({
    data: { title, description, userId },
  });
};

export const getTodos = async (userId: number, page = 1, limit = 10, filter = '', sort: 'asc' | 'desc' = 'desc') => {
  const where = { userId, ...(filter ? { title: { contains: filter } } : {}) };
  const [data, total] = await Promise.all([
    prisma.todo.findMany({
      where,
      orderBy: { createdAt: sort },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.todo.count({ where }),
  ]);
  return { data, page, limit, total };
};

export const getTodoById = async (id: number) => {
  return prisma.todo.findUnique({ where: { id } });
};

export const updateTodo = async (id: number, userId: number, title: string, description: string) => {
  // 只允许拥有者修改
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo || todo.userId !== userId) return null;
  return prisma.todo.update({
    where: { id },
    data: { title, description },
  });
};

export const deleteTodo = async (id: number, userId: number) => {
  // 只允许拥有者删除
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo || todo.userId !== userId) return false;
  await prisma.todo.delete({ where: { id } });
  return true;
}; 