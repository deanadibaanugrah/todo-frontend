import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { getTodos, createTodo } from '../controllers/todoController.js';
import { validateRegister, validateLogin, validateTodo } from '../middlewares/validator.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Auth routes
router.post('/auth/register', validateRegister, register);
router.post('/auth/login', validateLogin, login);

// Todo routes
router.get('/todos', verifyToken, getTodos);
router.post('/todos', verifyToken, validateTodo, createTodo);

export default router;
