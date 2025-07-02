import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getAllTodos, createNewTodo, getTodo, updateExistingTodo, deleteExistingTodo } from '../controllers/todo.controller';

const router = Router();

router.use(authMiddleware);

router.route('/')
    .get(getAllTodos)
    .post(createNewTodo);

router.route('/:id')
    .get(getTodo)
    .put(updateExistingTodo)
    .delete(deleteExistingTodo);

export default router; 