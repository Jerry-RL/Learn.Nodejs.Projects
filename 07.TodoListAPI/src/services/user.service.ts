import { prisma } from '../db/prisma';
import bcrypt from 'bcryptjs';

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = async (userData: { name: string; email: string; password: string }) => {
  if (!userData.password) {
    throw new Error('Password is required');
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    },
  });
};
