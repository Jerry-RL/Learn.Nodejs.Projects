import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const dbPath = path.join(__dirname, '..', '..', 'data', 'db.json');

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface Todo {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
}

interface DB {
  users: User[];
  todos: Todo[];
}

export const db: DB = {
  users: [],
  todos: [],
};

export const initDb = async (): Promise<void> => {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    const parsedData = JSON.parse(data);
    db.users = parsedData.users || [];
    db.todos = parsedData.todos || [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await writeDb();
    } else {
      throw error;
    }
  }
};

export const writeDb = async (): Promise<void> => {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf-8');
};
