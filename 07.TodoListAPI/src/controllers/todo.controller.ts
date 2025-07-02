import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { createTodo, getTodos, getTodoById, updateTodo, deleteTodo } from '../services/todo.service';
import { createTodoSchema, updateTodoSchema } from '../schemas/todo.schema';

export const getAllTodos = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const filter = (req.query.filter as string) || '';
  const sort = (req.query.sort as 'asc' | 'desc') || 'desc';
  const result = await getTodos(userId, page, limit, filter, sort);
  res.json(result);
};

export const createNewTodo = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = createTodoSchema.parse(req.body);
    const userId = req.user.id;
    const newTodo = await createTodo(userId, validatedData.title, validatedData.description);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', details: error });
  }
};

export const getTodo = async (req: AuthRequest, res: Response) => {
  const todoId = Number(req.params.id);
  const todo = await getTodoById(todoId);
  if (!todo || todo.userId !== req.user.id) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  res.json(todo);
};

export const updateExistingTodo = async (req: AuthRequest, res: Response) => {
  try {
    const todoId = Number(req.params.id);
    const validatedData = updateTodoSchema.parse(req.body);
    const updatedTodo = await updateTodo(todoId, req.user.id, validatedData.title, validatedData.description);
    if (!updatedTodo) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', details: error });
  }
};

export const deleteExistingTodo = async (req: AuthRequest, res: Response) => {
  const todoId = Number(req.params.id);
  const success = await deleteTodo(todoId, req.user.id);
  if (!success) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.status(204).send();
}; 